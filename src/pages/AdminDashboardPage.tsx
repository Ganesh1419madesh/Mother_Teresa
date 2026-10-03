import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart3, Database, LogOut, Settings, ShieldCheck, Users } from 'lucide-react';

interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: 'admin';
}

const sections = [
  { label: 'Manage Users', description: 'User administration', icon: Users, to: '/admin/users' },
  { label: 'Manage Data', description: 'Data administration', icon: Database, to: '/admin/data' },
  { label: 'View Reports', description: 'Reporting workspace', icon: BarChart3, to: '/admin/reports' },
  { label: 'Settings', description: 'Administration settings', icon: Settings, to: '/admin/settings' },
];

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/admin/dashboard', { credentials: 'same-origin', signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          navigate('/admin/login', { replace: true });
          return null;
        }
        return response.json() as Promise<{ user: AdminUser }>;
      })
      .then((result) => {
        if (result) setAdmin(result.user);
      })
      .catch(() => {
        if (!controller.signal.aborted) navigate('/admin/login', { replace: true });
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [navigate]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setLogoutError('');
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'same-origin',
      });
      if (!response.ok) throw new Error('Logout failed.');
      navigate('/admin/login', { replace: true });
    } catch {
      setLogoutError('Unable to log out right now. Please try again.');
      setIsLoggingOut(false);
    }
  };

  if (isLoading || !admin) {
    return (
      <main className="min-h-[calc(100vh-4rem)] px-4 py-12 flex items-center justify-center text-sm text-slate-300" aria-live="polite">
        Checking administrator access...
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-950 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-5 border-b border-slate-800 pb-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase text-emerald-400">
              <ShieldCheck className="h-4 w-4" /> Administrator
            </p>
            <h1 className="mt-2 font-serif text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-slate-400">Signed in as {admin.username}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:border-red-800 hover:text-red-300 disabled:opacity-60"
          >
            <LogOut className="h-4 w-4" />
            {isLoggingOut ? 'Signing out...' : 'Logout'}
          </button>
        </div>

        {logoutError && <p role="alert" className="mt-5 text-sm text-red-300">{logoutError}</p>}

        <section aria-label="Administration areas" className="grid grid-cols-1 gap-4 py-7 sm:grid-cols-2 lg:grid-cols-4">
          {sections.map(({ label, description, icon: Icon, to }) => (
            <Link
              key={label}
              to={to}
              className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 transition-colors hover:border-emerald-700 hover:bg-slate-900"
            >
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-900/80 bg-emerald-950/60 text-emerald-400">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="font-semibold text-white">{label}</h2>
              <p className="mt-1 text-sm text-slate-400">{description}</p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
};