<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Mother Teresa's Trust Donation Website

The existing React/Vite donation website has a small Express API for administrator sign-in. The API uses Node's built-in SQLite support; it does not require a separate database service. Use Node.js 22.13 or newer (Node.js 24 recommended).

## Run locally

1. Install the project dependencies:

   ```cmd
   npm install
   ```

2. Create the first administrator. The command prompts for a username, email, and password; password input is hidden and the password is stored only as a scrypt hash.

   ```cmd
   npm run admin:create
   ```

3. Start the site and the admin API together:

   ```cmd
   npm run dev
   ```

4. Open the public site at `http://localhost:3000` and sign in at `http://localhost:3000/admin/login`. The Admin Login link is also in the site header. The protected dashboard is at `http://localhost:3000/admin/dashboard`.

Vite proxies `/api` to the API on port 3001. Set `API_PORT` to change the API port, or `ADMIN_DB_PATH` to choose a different SQLite file. The default database is `data/admin.sqlite` and is excluded from Git. In production, serve the frontend and API on the same origin over HTTPS (or configure an equivalent same-origin `/api` reverse proxy); the session cookie is marked `Secure` when `NODE_ENV=production`.

## Database

The API creates these tables on startup. Passwords are never stored in plaintext; the CLI hashes them with Node's scrypt implementation.

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL COLLATE NOCASE UNIQUE,
  email TEXT NOT NULL COLLATE NOCASE UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sessions (
  token_hash TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);
```

The CLI creates the initial administrator with `role = 'admin'`; do not put credentials in source code or environment files.

## Verify the flow

1. Run `npm run admin:create` and create an administrator using a password of at least 12 characters.
2. At `/admin/login`, sign in with the correct email or username and password. The browser should open `/admin/dashboard` and show the four admin placeholders.
3. Submit an incorrect password. The login page should show `Invalid email/username or password.` without opening the dashboard.
4. Open `/admin/dashboard` in a private window or after logging out. It should redirect to `/admin/login`; `GET /api/admin/dashboard` without a session returns HTTP 401.
5. Sign in again and select **Logout**. The browser returns to `/admin/login`; revisiting the dashboard redirects, and the old server-side session has been deleted.

Run the project checks with:

```cmd
npm run lint
npm run build
```
