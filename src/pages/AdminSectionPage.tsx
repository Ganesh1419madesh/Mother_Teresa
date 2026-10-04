import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Building2, CheckCircle2, Download, FileDown, RefreshCcw, ShieldCheck, Trash2, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TRUST_CONFIG } from '../config/trustConfig';
import { useDonation } from '../context/DonationContext';

interface AdminUserRecord {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Viewer';
  status: 'Active' | 'Inactive';
  lastUpdated: string;
}

interface AdminSectionPageProps {
  title: string;
  description: string;
  section?: 'data' | 'users' | 'reports' | 'settings' | 'default';
}

const STORAGE_KEY_USERS = 'trust_admin_users';

const defaultUsers: AdminUserRecord[] = [
  { id: 1, name: 'Admin User', email: 'admin@trust.org', role: 'Admin', status: 'Active', lastUpdated: 'Today' },
  { id: 2, name: 'Data Manager', email: 'data@trust.org', role: 'Manager', status: 'Active', lastUpdated: 'Yesterday' },
  { id: 3, name: 'Reports Viewer', email: 'reports@trust.org', role: 'Viewer', status: 'Inactive', lastUpdated: '2 days ago' },
];

export const AdminSectionPage: React.FC<AdminSectionPageProps> = ({ title, description, section = 'default' }) => {
  const { donationHistory, trustConfig, updateTrustConfig, resetTrustConfig } = useDonation();
  const [settingsForm, setSettingsForm] = useState(() => ({ ...TRUST_CONFIG }));
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [users, setUsers] = useState<AdminUserRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USERS);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(defaultUsers));
      return defaultUsers;
    }

    try {
      const parsed = JSON.parse(saved) as AdminUserRecord[];
      return parsed.length ? parsed : defaultUsers;
    } catch {
      return defaultUsers;
    }
  });
  const [form, setForm] = useState({ name: '', email: '', role: 'Viewer' as AdminUserRecord['role'] });
  const [editingId, setEditingId] = useState<number | null>(null);

  const recordsSummary = useMemo(() => {
    const totalAmount = donationHistory.reduce((sum, record) => sum + record.amount, 0);
    return {
      totalRecords: donationHistory.length,
      totalAmount,
      latestRecord: donationHistory[0] ?? null,
    };
  }, [donationHistory]);

  useEffect(() => {
    setSettingsForm({ ...trustConfig });
  }, [trustConfig]);

  const handleSettingsSave = (event: React.FormEvent) => {
    event.preventDefault();
    updateTrustConfig({
      name: settingsForm.name.trim(),
      tagline: settingsForm.tagline.trim(),
      upiId: settingsForm.upiId.trim(),
      payeeName: settingsForm.payeeName.trim(),
      contactEmail: settingsForm.contactEmail.trim(),
      contactPhone: settingsForm.contactPhone.trim(),
      address: settingsForm.address.trim(),
    });
    setSettingsSaved(true);
    window.setTimeout(() => setSettingsSaved(false), 1200);
  };

  const handleSettingsReset = () => {
    resetTrustConfig();
    setSettingsForm({ ...TRUST_CONFIG });
  };

  const saveUsers = (nextUsers: AdminUserRecord[]) => {
    setUsers(nextUsers);
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(nextUsers));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedName = form.name.trim();
    const trimmedEmail = form.email.trim();

    if (!trimmedName || !trimmedEmail) return;

    if (editingId !== null) {
      saveUsers(
        users.map((user) =>
          user.id === editingId ? { ...user, name: trimmedName, email: trimmedEmail, role: form.role, lastUpdated: 'Just now' } : user,
        ),
      );
    } else {
      const newUser: AdminUserRecord = {
        id: Date.now(),
        name: trimmedName,
        email: trimmedEmail,
        role: form.role,
        status: 'Active',
        lastUpdated: 'Just now',
      };
      saveUsers([newUser, ...users]);
    }

    setForm({ name: '', email: '', role: 'Viewer' });
    setEditingId(null);
  };

  const handleEdit = (user: AdminUserRecord) => {
    setEditingId(user.id);
    setForm({ name: user.name, email: user.email, role: user.role });
  };

  const handleDelete = (id: number) => {
    saveUsers(users.filter((user) => user.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setForm({ name: '', email: '', role: 'Viewer' });
    }
  };

  const handleDownload = (format: 'csv' | 'json') => {
    if (!donationHistory.length) return;

    const payload = format === 'csv'
      ? [
          ['date', 'reference', 'donor', 'email', 'phone', 'amount', 'utr', 'status'],
          ...donationHistory.map((record) => [
            new Date(record.timestamp).toISOString(),
            record.transactionRef,
            record.donor.name || 'Unknown donor',
            record.donor.email || '',
            record.donor.phone || '',
            record.amount,
            record.utrNumber || '',
            record.utrNumber ? 'verified' : 'pending',
          ]),
        ].map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n')
      : JSON.stringify(donationHistory, null, 2);

    const blob = new Blob([payload], {
      type: format === 'csv' ? 'text/csv;charset=utf-8;' : 'application/json;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = format === 'csv' ? 'donation-records.csv' : 'donation-records.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const renderDataSection = () => (
    <div className="mt-8 space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Records</p>
          <p className="mt-2 text-3xl font-bold text-white">{recordsSummary.totalRecords}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Total amount</p>
          <p className="mt-2 text-3xl font-bold text-white">₹{recordsSummary.totalAmount.toLocaleString('en-IN')}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Latest</p>
          <p className="mt-2 text-lg font-semibold text-white">
            {recordsSummary.latestRecord ? `₹${recordsSummary.latestRecord.amount}` : 'No records'}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Record download</h2>
            <p className="text-sm text-slate-400">Export donation activity as CSV or JSON.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => handleDownload('csv')}
              disabled={!donationHistory.length}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FileDown className="h-4 w-4" />
              Download CSV
            </button>
            <button
              type="button"
              onClick={() => handleDownload('json')}
              disabled={!donationHistory.length}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:border-emerald-700 hover:text-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              Download JSON
            </button>
          </div>
        </div>

        {!donationHistory.length ? (
          <div className="mt-4 rounded-lg border border-dashed border-slate-700 bg-slate-900/70 p-4 text-sm text-slate-400">
            No donation records have been captured yet. Complete a donation to generate a downloadable data record.
          </div>
        ) : (
          <div className="mt-4 overflow-hidden rounded-lg border border-slate-800">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-900 text-xs uppercase tracking-[0.2em] text-slate-400">
                  <tr>
                    <th className="px-3 py-3">Donor</th>
                    <th className="px-3 py-3">Amount</th>
                    <th className="px-3 py-3">Reference</th>
                    <th className="px-3 py-3">UTR</th>
                  </tr>
                </thead>
                <tbody>
                  {donationHistory.slice(0, 5).map((record) => (
                    <tr key={`${record.transactionRef}-${record.timestamp}`} className="border-t border-slate-800">
                      <td className="px-3 py-3">{record.donor.name || 'Anonymous'}</td>
                      <td className="px-3 py-3">₹{record.amount.toLocaleString('en-IN')}</td>
                      <td className="px-3 py-3 font-mono text-xs text-slate-300">{record.transactionRef}</td>
                      <td className="px-3 py-3">{record.utrNumber || 'Pending'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderUsersSection = () => (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_2fr]">
      <form onSubmit={handleSubmit} className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-900/80 bg-emerald-950/60 text-emerald-400">
            <UserPlus className="h-4 w-4" />
          </div>
          <h2 className="text-xl font-semibold text-white">{editingId !== null ? 'Update user' : 'Add user'}</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Full name</label>
            <input
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500"
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Role</label>
            <select
              value={form.role}
              onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value as AdminUserRecord['role'] }))}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500"
            >
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 rounded-lg bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-300">
              {editingId !== null ? 'Update user' : 'Add user'}
            </button>
            {editingId !== null && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({ name: '', email: '', role: 'Viewer' });
                }}
                className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-200"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Review users</h2>
          <span className="rounded-full border border-emerald-900 bg-emerald-950/60 px-2.5 py-1 text-xs font-medium text-emerald-300">
            {users.length} total
          </span>
        </div>

        <div className="space-y-3">
          {users.map((user) => (
            <div key={user.id} className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-white">{user.name}</p>
                  <p className="text-sm text-slate-400">{user.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-slate-700 px-2 py-1 text-xs text-slate-200">{user.role}</span>
                  <span className={`rounded-full px-2 py-1 text-xs ${user.status === 'Active' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-slate-700 text-slate-300'}`}>
                    {user.status}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between gap-4 text-xs text-slate-400">
                <span>Updated {user.lastUpdated}</span>
                <div className="flex gap-2">
                  <button type="button" onClick={() => handleEdit(user)} className="text-emerald-300 hover:text-emerald-200">
                    Update
                  </button>
                  <button type="button" onClick={() => handleDelete(user.id)} className="inline-flex items-center gap-1 text-red-300 hover:text-red-200">
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReportsSection = () => {
    const recentActivity = donationHistory.slice(0, 5);
    const totalDonations = donationHistory.reduce((sum, record) => sum + record.amount, 0);
    const verifiedDonations = donationHistory.filter((record) => record.utrNumber).length;
    const averageGift = donationHistory.length ? totalDonations / donationHistory.length : 0;

    return (
      <div className="mt-8 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Donations</p>
            <p className="mt-2 text-3xl font-bold text-white">{donationHistory.length}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Total</p>
            <p className="mt-2 text-3xl font-bold text-white">₹{totalDonations.toLocaleString('en-IN')}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Verified</p>
            <p className="mt-2 text-3xl font-bold text-white">{verifiedDonations}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Avg. gift</p>
            <p className="mt-2 text-3xl font-bold text-white">₹{Math.round(averageGift).toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Recent activity</h2>
              <span className="text-xs uppercase tracking-[0.2em] text-emerald-300">live</span>
            </div>

            <div className="space-y-3">
              {recentActivity.length ? (
                recentActivity.map((record) => (
                  <div key={`${record.transactionRef}-${record.timestamp}`} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-white">{record.donor.name || 'Anonymous Donor'}</p>
                        <p className="text-xs text-slate-400">{new Date(record.timestamp).toLocaleDateString()}</p>
                      </div>
                      <span className="text-sm font-semibold text-emerald-300">₹{record.amount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                      <span>{record.transactionRef}</span>
                      <span>{record.utrNumber ? 'Verified' : 'Pending'}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-lg border border-dashed border-slate-700 bg-slate-900/70 p-4 text-sm text-slate-400">
                  No donation reports available yet.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
            <h2 className="text-xl font-semibold text-white">Key insights</h2>
            <div className="mt-4 space-y-4 text-sm text-slate-300">
              <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                <p className="text-slate-400">Verified rate</p>
                <p className="mt-1 text-lg font-semibold text-white">
                  {donationHistory.length
                    ? `${Math.round((verifiedDonations / donationHistory.length) * 100)}%`
                    : 'No data'}
                </p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                <p className="text-slate-400">Average gift</p>
                <p className="mt-1 text-lg font-semibold text-white">
                  {averageGift ? `₹${Math.round(averageGift).toLocaleString('en-IN')}` : 'No data'}
                </p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                <p className="text-slate-400">Total donors</p>
                <p className="mt-1 text-lg font-semibold text-white">
                  {donationHistory.length || 'No data'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSettingsSection = () => (
    <div className="mt-8 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
      <form onSubmit={handleSettingsSave} className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-900/80 bg-emerald-950/60 text-emerald-400">
            <Building2 className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Trust configuration</h2>
            <p className="text-sm text-slate-400">Update the public trust profile and payment destination.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Trust name</label>
            <input
              value={settingsForm.name}
              onChange={(event) => setSettingsForm((prev) => ({ ...prev, name: event.target.value }))}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500"
              placeholder="Your trust name"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Tagline</label>
            <input
              value={settingsForm.tagline}
              onChange={(event) => setSettingsForm((prev) => ({ ...prev, tagline: event.target.value }))}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500"
              placeholder="Mission statement"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-slate-300">UPI ID</label>
              <input
                value={settingsForm.upiId}
                onChange={(event) => setSettingsForm((prev) => ({ ...prev, upiId: event.target.value }))}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500"
                placeholder="trust@upi"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">Payee name</label>
              <input
                value={settingsForm.payeeName}
                onChange={(event) => setSettingsForm((prev) => ({ ...prev, payeeName: event.target.value }))}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500"
                placeholder="Registered beneficiary name"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-slate-300">Contact email</label>
              <input
                type="email"
                value={settingsForm.contactEmail}
                onChange={(event) => setSettingsForm((prev) => ({ ...prev, contactEmail: event.target.value }))}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500"
                placeholder="care@trust.org"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">Contact phone</label>
              <input
                value={settingsForm.contactPhone}
                onChange={(event) => setSettingsForm((prev) => ({ ...prev, contactPhone: event.target.value }))}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500"
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Address</label>
            <textarea
              value={settingsForm.address}
              onChange={(event) => setSettingsForm((prev) => ({ ...prev, address: event.target.value }))}
              className="min-h-24 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500"
              placeholder="Official trust address"
            />
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-300"
            >
              <CheckCircle2 className="h-4 w-4" />
              {settingsSaved ? 'Saved' : 'Save settings'}
            </button>
            <button
              type="button"
              onClick={handleSettingsReset}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:border-emerald-700 hover:text-emerald-300"
            >
              <RefreshCcw className="h-4 w-4" />
              Reset defaults
            </button>
          </div>
        </div>
      </form>

      <aside className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Review</p>
        <h3 className="mt-3 text-2xl font-bold text-white">{trustConfig.name}</h3>
        <p className="mt-2 text-sm text-slate-300">{trustConfig.tagline}</p>

        <div className="mt-5 space-y-3 text-sm text-slate-300">
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <p className="text-slate-400">UPI ID</p>
            <p className="mt-1 font-mono text-white">{trustConfig.upiId}</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <p className="text-slate-400">Payee</p>
            <p className="mt-1 font-medium text-white">{trustConfig.payeeName}</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <p className="text-slate-400">Contact</p>
            <p className="mt-1 text-white">{trustConfig.contactEmail}</p>
            <p className="text-white">{trustConfig.contactPhone}</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <p className="text-slate-400">Address</p>
            <p className="mt-1 text-white">{trustConfig.address}</p>
          </div>
        </div>
      </aside>
    </div>
  );

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-950 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-900/80 bg-emerald-950/60 text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">Administration</p>
              <h1 className="mt-1 font-serif text-3xl font-bold text-white">{title}</h1>
            </div>
          </div>

          <Link
            to="/admin/dashboard"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-emerald-700 hover:text-emerald-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
        </div>

        <p className="text-base text-slate-300">{description}</p>

        {section === 'data' ? renderDataSection() : section === 'users' ? renderUsersSection() : section === 'reports' ? renderReportsSection() : section === 'settings' ? renderSettingsSection() : (
          <div className="mt-8 rounded-xl border border-slate-800 bg-slate-950/70 p-5 text-sm text-slate-300">
            This section is ready for the corresponding admin feature. Use it as the navigable destination for the selected dashboard item.
          </div>
        )}
      </div>
    </main>
  );
};
