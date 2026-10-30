import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { updateUserProfile } from '../services/users.service';
import { Button } from '../components/ui/Button';
import { Sun, Moon, User, Bell, Shield } from 'lucide-react';
import { validateDisplayName } from '../utils/validation';

export function SettingsPage() {
  const { user, theme, toggleTheme } = useAppContext();
  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [nameError, setNameError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault();
    const err = validateDisplayName(displayName);
    if (err) { setNameError(err); return; }
    if (!user) return;
    setSaving(true);
    setSaved(false);
    setSaveError(null);
    try {
      await updateUserProfile(user.uid, { displayName: displayName.trim() });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setSaveError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
          </div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Profile</h2>
        </div>

        <form onSubmit={handleSaveName} className="space-y-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="settings-name" className="text-sm font-medium text-slate-700 dark:text-slate-300">Display Name</label>
            <input
              id="settings-name"
              type="text"
              value={displayName}
              onChange={(e) => { setDisplayName(e.target.value); setNameError(null); }}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
              aria-describedby={nameError ? 'settings-name-error' : undefined}
            />
            {nameError && <p id="settings-name-error" className="text-xs text-red-600 dark:text-red-400" role="alert">{nameError}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
            <input
              type="email"
              value={user?.email ?? ''}
              disabled
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm text-slate-500 dark:text-slate-400 cursor-not-allowed"
            />
            <p className="text-xs text-slate-400 dark:text-slate-500">Email cannot be changed.</p>
          </div>

          {saveError && <p className="text-sm text-red-600 dark:text-red-400" role="alert">{saveError}</p>}
          {saved && <p className="text-sm text-green-600 dark:text-green-400" role="status">✓ Profile updated</p>}

          <Button type="submit" loading={saving} size="sm">Save Changes</Button>
        </form>
      </section>

      {/* Appearance */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <Sun className="w-4 h-4 text-amber-600 dark:text-amber-400" aria-hidden="true" />
          </div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Appearance</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-white">Theme</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Currently using {theme} mode</p>
          </div>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" aria-hidden="true" /> : <Moon className="w-4 h-4" aria-hidden="true" />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </section>

      {/* Security info */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
          </div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Security</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
            <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <p className="text-xs text-emerald-700 dark:text-emerald-400">
              Your account is secured with Firebase Authentication. Passwords are never stored in the database.
              Task data is protected by Firestore Security Rules — only you can access your tasks.
            </p>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            To reset your password,{' '}
            <a href="/forgot-password" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              click here
            </a>
            .
          </p>
        </div>
      </section>

      {/* Notifications info */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <Bell className="w-4 h-4 text-purple-600 dark:text-purple-400" aria-hidden="true" />
          </div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">About TaskFlow</h2>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          TaskFlow v1.0 — Built with React, TypeScript, and Firebase. Your tasks sync in real time across all devices.
        </p>
      </section>
    </div>
  );
}
