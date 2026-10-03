import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { database } from './database';
import { hashPassword } from './security';

function readHidden(prompt: string): Promise<string> {
  if (!stdin.isTTY || typeof stdin.setRawMode !== 'function') {
    return Promise.reject(new Error('Run this command in an interactive terminal to enter the admin password securely.'));
  }

  return new Promise((resolve, reject) => {
    let value = '';
    stdout.write(prompt);
    stdin.setEncoding('utf8');
    stdin.setRawMode(true);
    stdin.resume();

    const finish = (error?: Error) => {
      stdin.off('data', onData);
      stdin.setRawMode(false);
      stdin.pause();
      stdout.write('\n');
      if (error) reject(error);
      else resolve(value);
    };

    const onData = (chunk: string) => {
      for (const character of chunk) {
        if (character === '\u0003') {
          finish(new Error('Admin creation cancelled.'));
          return;
        }
        if (character === '\r' || character === '\n') {
          finish();
          return;
        }
        if (character === '\u007f' || character === '\b') {
          value = value.slice(0, -1);
        } else {
          value += character;
        }
      }
    };

    stdin.on('data', onData);
  });
}

async function main(): Promise<void> {
  const prompt = createInterface({ input: stdin, output: stdout });
  try {
    const username = (await prompt.question('Admin username (3-32 letters, numbers, ., _ or -): ')).trim();
    const email = (await prompt.question('Admin email: ')).trim().toLowerCase();
    prompt.close();

    if (!/^[a-zA-Z0-9_.-]{3,32}$/.test(username)) {
      throw new Error('Username must be 3-32 characters and contain only letters, numbers, ., _ or -.');
    }
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Enter a valid email address.');
    }

    const password = await readHidden('Admin password (at least 12 characters): ');
    const confirmation = await readHidden('Confirm admin password: ');
    if (password.length < 12 || password.length > 128) {
      throw new Error('Password must be between 12 and 128 characters.');
    }
    if (password !== confirmation) {
      throw new Error('Passwords do not match.');
    }

    const passwordHash = await hashPassword(password);
    database.prepare(`
      INSERT INTO users (username, email, password_hash, role)
      VALUES (?, ?, ?, 'admin')
    `).run(username, email, passwordHash);
    console.log(`Admin account created for ${username}.`);
  } finally {
    prompt.close();
    database.close();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Admin account could not be created.';
  console.error(message);
  process.exitCode = 1;
});