import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LockKeyhole, ShieldCheck } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ identifier, password }),
      });

      if (response.status === 401) {
        setErrorMessage('Invalid email/username or password.');
        return;
      }
      if (!response.ok) {
        throw new Error('The login request could not be completed.');
      }

      navigate('/admin/dashboard', { replace: true });
    } catch {
      setErrorMessage('Unable to reach the login service. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] px-4 py-12 sm:px-6 flex items-center justify-center bg-slate-950">
      <section className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl sm:p-8">
        <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-800/70 bg-emerald-950/70 text-emerald-400">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <p className="text-xs font-semibold uppercase text-emerald-400">Administrator access</p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-white">Admin Login</h1>
        <p className="mt-2 text-sm text-slate-400">Sign in with an authorized administrator account.</p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <div>
            <label htmlFor="admin-identifier" className="mb-2 block text-sm font-medium text-slate-200">
              Email or username
            </label>
            <input
              id="admin-identifier"
              name="username"
              type="text"
              autoComplete="username"
              required
              maxLength={254}
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="mb-2 block text-sm font-medium text-slate-200">
              Password
            </label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                id="admin-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                maxLength={1024}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 py-3 pl-10 pr-12 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {errorMessage && (
            <p role="alert" className="rounded-lg border border-red-900/80 bg-red-950/50 px-3 py-2.5 text-sm text-red-300">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !identifier.trim() || !password}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-400 px-4 py-3 text-sm font-bold text-slate-950 transition-colors hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <Link to="/" className="mt-6 inline-block text-sm text-slate-400 transition-colors hover:text-emerald-400">
          Return to website
        </Link>
      </section>
    </main>
  );
};