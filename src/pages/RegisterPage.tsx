import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Zap } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { registerUser, getAuthErrorMessage } from '../services/auth.service';
import {
  validateEmail, validatePassword, validateDisplayName,
} from '../utils/validation';
import type { AuthError } from 'firebase/auth';

export function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    const nameErr = validateDisplayName(form.name);
    const emailErr = validateEmail(form.email);
    const passErr = validatePassword(form.password);
    const confirmErr = form.password !== form.confirm ? 'Passwords do not match.' : null;
    const newErrors = {
      name: nameErr ?? undefined,
      email: emailErr ?? undefined,
      password: passErr ?? undefined,
      confirm: confirmErr ?? undefined,
    };
    setErrors(newErrors);
    return !nameErr && !emailErr && !passErr && !confirmErr;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setGlobalError(null);
    try {
      await registerUser(form.email, form.password, form.name.trim());
      navigate('/dashboard');
    } catch (err) {
      setGlobalError(getAuthErrorMessage(err as AuthError));
    } finally {
      setLoading(false);
    }
  }

  function field(key: keyof typeof form) {
    return {
      value: form[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((f) => ({ ...f, [key]: e.target.value }));
        if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
      },
    };
  }

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-indigo-600 to-indigo-800 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative text-center">
          <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Join TaskFlow</h2>
          <p className="text-indigo-200 text-lg max-w-sm">
            Start managing your tasks in seconds. Free, secure, and always in sync.
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 justify-center mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">TaskFlow</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Create your account</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">Get started with TaskFlow for free</p>

          {globalError && (
            <div className="mb-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800" role="alert">
              <p className="text-sm text-red-700 dark:text-red-400">{globalError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Name */}
            <div className="flex flex-col gap-1">
              <label htmlFor="reg-name" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Full Name <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
                <input
                  id="reg-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Jane Doe"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 ${errors.name ? 'border-red-400' : 'border-slate-300 dark:border-slate-600 focus:border-indigo-500'}`}
                  aria-invalid={errors.name ? 'true' : undefined}
                  aria-describedby={errors.name ? 'reg-name-error' : undefined}
                  {...field('name')}
                />
              </div>
              {errors.name && <p id="reg-name-error" className="text-xs text-red-600 dark:text-red-400" role="alert">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label htmlFor="reg-email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Email <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
                <input
                  id="reg-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 ${errors.email ? 'border-red-400' : 'border-slate-300 dark:border-slate-600 focus:border-indigo-500'}`}
                  aria-invalid={errors.email ? 'true' : undefined}
                  aria-describedby={errors.email ? 'reg-email-error' : undefined}
                  {...field('email')}
                />
              </div>
              {errors.email && <p id="reg-email-error" className="text-xs text-red-600 dark:text-red-400" role="alert">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label htmlFor="reg-password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Password <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 ${errors.password ? 'border-red-400' : 'border-slate-300 dark:border-slate-600 focus:border-indigo-500'}`}
                  aria-invalid={errors.password ? 'true' : undefined}
                  aria-describedby={errors.password ? 'reg-password-error' : undefined}
                  {...field('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p id="reg-password-error" className="text-xs text-red-600 dark:text-red-400" role="alert">{errors.password}</p>}
            </div>

            {/* Confirm password */}
            <div className="flex flex-col gap-1">
              <label htmlFor="reg-confirm" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Confirm Password <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
                <input
                  id="reg-confirm"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 ${errors.confirm ? 'border-red-400' : 'border-slate-300 dark:border-slate-600 focus:border-indigo-500'}`}
                  aria-invalid={errors.confirm ? 'true' : undefined}
                  aria-describedby={errors.confirm ? 'reg-confirm-error' : undefined}
                  {...field('confirm')}
                />
              </div>
              {errors.confirm && <p id="reg-confirm-error" className="text-xs text-red-600 dark:text-red-400" role="alert">{errors.confirm}</p>}
            </div>

            <Button type="submit" loading={loading} className="w-full" size="lg">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
