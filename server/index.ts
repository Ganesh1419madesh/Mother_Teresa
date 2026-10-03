import express, { NextFunction, Request, Response } from 'express';
import { database } from './database';
import { createSessionToken, hashSessionToken, verifyPassword } from './security';

const app = express();
const SESSION_COOKIE = 'trust_admin_session';
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;
const SESSION_DURATION_SECONDS = SESSION_DURATION_MS / 1000;
const isProduction = process.env.NODE_ENV === 'production';

interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: 'admin';
}

interface StoredAdmin extends AdminUser {
  password_hash: string;
}

app.disable('x-powered-by');
app.use(express.json({ limit: '8kb' }));

function readSessionToken(request: Request): string | undefined {
  const cookieHeader = request.headers.cookie;
  if (!cookieHeader) return undefined;

  const cookie = cookieHeader.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${SESSION_COOKIE}=`));
  const token = cookie?.slice(SESSION_COOKIE.length + 1);
  return token && /^[a-f0-9]{64}$/i.test(token) ? token : undefined;
}

function setSessionCookie(response: Response, token: string): void {
  response.append(
    'Set-Cookie',
    `${SESSION_COOKIE}=${token}; Path=/api/admin; HttpOnly; SameSite=Strict; Max-Age=${SESSION_DURATION_SECONDS}${isProduction ? '; Secure' : ''}`,
  );
}

function clearSessionCookie(response: Response): void {
  response.append(
    'Set-Cookie',
    `${SESSION_COOKIE}=; Path=/api/admin; HttpOnly; SameSite=Strict; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT${isProduction ? '; Secure' : ''}`,
  );
}

function requireAdmin(request: Request, response: Response, next: NextFunction): void {
  const token = readSessionToken(request);
  if (!token) {
    response.status(401).json({ error: 'Authentication required.' });
    return;
  }

  const tokenHash = hashSessionToken(token);
  const session = database.prepare(`
    SELECT users.id, users.username, users.email, users.role, sessions.expires_at
    FROM sessions
    JOIN users ON users.id = sessions.user_id
    WHERE sessions.token_hash = ?
  `).get(tokenHash) as (AdminUser & { expires_at: number }) | undefined;

  if (!session || session.role !== 'admin' || session.expires_at <= Date.now()) {
    database.prepare('DELETE FROM sessions WHERE token_hash = ?').run(tokenHash);
    response.status(401).json({ error: 'Authentication required.' });
    return;
  }

  response.locals.adminUser = {
    id: session.id,
    username: session.username,
    email: session.email,
    role: 'admin',
  } satisfies AdminUser;
  next();
}

database.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(Date.now());

app.post('/api/admin/login', async (request, response, next) => {
  try {
    const body: unknown = request.body;
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      response.status(401).json({ error: 'Invalid email/username or password.' });
      return;
    }

    const { identifier, password } = body as Record<string, unknown>;
    if (
      typeof identifier !== 'string' ||
      typeof password !== 'string' ||
      !identifier.trim() ||
      identifier.trim().length > 254 ||
      password.length < 1 ||
      password.length > 1024
    ) {
      response.status(401).json({ error: 'Invalid email/username or password.' });
      return;
    }

    const normalizedIdentifier = identifier.trim().toLowerCase();
    const user = database.prepare(`
      SELECT id, username, email, role, password_hash
      FROM users
      WHERE (username = ? OR email = ?) AND role = 'admin'
    `).get(normalizedIdentifier, normalizedIdentifier) as StoredAdmin | undefined;

    const passwordIsValid = await verifyPassword(password, user?.password_hash);
    if (!user || !passwordIsValid) {
      response.status(401).json({ error: 'Invalid email/username or password.' });
      return;
    }

    const token = createSessionToken();
    const now = Date.now();
    database.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(now);
    database.prepare('INSERT INTO sessions (token_hash, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)')
      .run(hashSessionToken(token), user.id, now + SESSION_DURATION_MS, now);
    setSessionCookie(response, token);
    response.json({
      user: { id: user.id, username: user.username, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/admin/session', requireAdmin, (_request, response) => {
  response.json({ user: response.locals.adminUser });
});

app.get('/api/admin/dashboard', requireAdmin, (_request, response) => {
  response.json({
    user: response.locals.adminUser,
    sections: ['Manage Users', 'Manage Data', 'View Reports', 'Settings'],
  });
});

app.post('/api/admin/logout', (request, response, next) => {
  try {
    const token = readSessionToken(request);
    if (token) {
      database.prepare('DELETE FROM sessions WHERE token_hash = ?').run(hashSessionToken(token));
    }
    clearSessionCookie(response);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

app.use('/api', (_request, response) => {
  response.status(404).json({ error: 'Not found.' });
});

app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  console.error('Admin API request failed:', error);
  if (response.headersSent) return;
  response.status(500).json({ error: 'The request could not be completed.' });
});

const port = Number(process.env.API_PORT) || 3001;
app.listen(port, '0.0.0.0', () => {
  console.log(`Admin API listening on port ${port}`);
});