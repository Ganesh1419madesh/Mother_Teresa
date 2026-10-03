import { spawn } from 'node:child_process';
import net from 'node:net';

const preferredApiPort = Number(process.env.API_PORT || 3001);
const preferredWebPort = Number(process.env.PORT || 3000);

function isPortFree(port) {
  return new Promise((resolve) => {
    const tester = net.createServer();

    tester.once('error', () => resolve(false));
    tester.once('listening', () => {
      tester.once('close', () => resolve(true));
      tester.close();
    });

    tester.listen(port, '0.0.0.0');
  });
}

async function findFreePort(preferredPort, excludedPorts = []) {
  let port = preferredPort;
  let offset = 0;

  while (true) {
    if (!excludedPorts.includes(port) && (await isPortFree(port))) {
      return port;
    }

    offset += 1;
    port = preferredPort + offset;
  }
}

const apiPort = await findFreePort(preferredApiPort);
const webPort = await findFreePort(preferredWebPort, [apiPort]);

const apiEnv = { ...process.env, API_PORT: String(apiPort) };
const webEnv = { ...process.env, API_PORT: String(apiPort), PORT: String(webPort) };

const api = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['tsx', 'watch', 'server/index.ts'], {
  stdio: 'inherit',
  env: apiEnv,
  shell: true,
});

const web = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['vite', '--port', String(webPort), '--host', '0.0.0.0'], {
  stdio: 'inherit',
  env: webEnv,
  shell: true,
});

const shutdown = () => {
  api.kill('SIGTERM');
  web.kill('SIGTERM');
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

api.on('exit', (code, signal) => {
  if (code !== null && code !== 0) {
    process.exit(code ?? 1);
  }
  if (signal) {
    process.exit(1);
  }
});

web.on('exit', (code, signal) => {
  if (code !== null && code !== 0) {
    process.exit(code ?? 1);
  }
  if (signal) {
    process.exit(1);
  }
});

console.log(`Starting admin API on http://localhost:${apiPort}`);
console.log(`Starting frontend on http://localhost:${webPort}`);
