import {
  createHash,
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from 'node:crypto';

const PASSWORD_KEY_LENGTH = 64;

function deriveKey(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCallback(password, salt, PASSWORD_KEY_LENGTH, (error, key) => {
      if (error) {
        reject(error);
      } else {
        resolve(key as Buffer);
      }
    });
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await deriveKey(password, salt);
  return `scrypt$${salt.toString('hex')}$${key.toString('hex')}`;
}

function parsePasswordHash(value: string): { salt: Buffer; key: Buffer } | null {
  const parts = value.split('$');
  if (parts.length !== 3 || parts[0] !== 'scrypt' || !/^[a-f0-9]{32}$/i.test(parts[1]) || !/^[a-f0-9]{128}$/i.test(parts[2])) {
    return null;
  }

  return { salt: Buffer.from(parts[1], 'hex'), key: Buffer.from(parts[2], 'hex') };
}

let dummyPasswordHash: Promise<string> | undefined;

export async function verifyPassword(password: string, storedHash?: string): Promise<boolean> {
  const fallbackHash = await (dummyPasswordHash ??= hashPassword(randomBytes(32).toString('hex')));
  const parsedHash = storedHash ? parsePasswordHash(storedHash) : null;
  const comparisonHash = parsedHash ?? parsePasswordHash(fallbackHash)!;
  const candidate = await deriveKey(password, comparisonHash.salt);
  const matches = timingSafeEqual(candidate, comparisonHash.key);
  return Boolean(parsedHash && matches);
}

export function createSessionToken(): string {
  return randomBytes(32).toString('hex');
}

export function hashSessionToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}