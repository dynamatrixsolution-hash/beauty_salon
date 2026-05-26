'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Sparkles, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else {
        router.push('/admin');
        router.refresh();
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-charcoal-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-rosegold/[0.04] rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-pink-accent/[0.03] rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-rosegold/[0.02] rounded-full blur-3xl" />
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        {/* Glow effect behind card */}
        <div className="absolute -inset-1 bg-gradient-to-r from-brand-rosegold/20 via-brand-pink-accent/10 to-brand-rosegold/20 rounded-3xl blur-xl opacity-60" />

        <div className="relative glass-card-dark rounded-2xl p-8 sm:p-10">
          {/* Branding */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-brand-pink-accent to-brand-rosegold text-brand-charcoal-dark font-serif text-2xl font-bold shadow-lg mb-4">
              G
              <Sparkles className="absolute -top-1.5 -right-1.5 w-5 h-5 text-brand-gold animate-pulse" />
            </div>
            <h1 className="font-serif text-2xl font-semibold text-white tracking-wide">
              GLOW & GRACE
            </h1>
            <p className="text-[11px] uppercase tracking-[0.25em] text-brand-rosegold/80 font-medium mt-1">
              Admin Portal
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm text-center font-sans">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2 font-sans"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@glowandgrace.com"
                required
                className="w-full bg-white/[0.05] border border-white/[0.08] text-white placeholder-white/25 px-4 py-3 rounded-xl text-sm font-sans focus:outline-none focus:border-brand-rosegold/50 focus:bg-white/[0.08] focus:ring-2 focus:ring-brand-rosegold/20 transition-all duration-300"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2 font-sans"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full bg-white/[0.05] border border-white/[0.08] text-white placeholder-white/25 px-4 py-3 pr-12 rounded-xl text-sm font-sans focus:outline-none focus:border-brand-rosegold/50 focus:bg-white/[0.08] focus:ring-2 focus:ring-brand-rosegold/20 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-brand-rosegold to-brand-rosegold-dark hover:from-brand-rosegold-dark hover:to-brand-rosegold text-white font-semibold py-3.5 rounded-xl text-sm shadow-lg shadow-brand-rosegold/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 font-sans"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-white/20 text-xs mt-8 font-sans">
            Authorized personnel only
          </p>
        </div>
      </div>
    </div>
  );
}
