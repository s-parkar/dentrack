'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Stethoscope, Lock, Mail, ArrowRight, Sparkles, UserCheck2, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const { login, loginAs, user } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    const res = login(email, password);
    if (!res.success) {
      setError(res.error || 'Failed to sign in.');
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden">
      {/* Background Decorative Glow Effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-8 sm:p-10 relative z-10">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-sky-400 flex items-center justify-center shadow-lg shadow-sky-500/25 mb-4 ring-4 ring-sky-500/10">
            <Stethoscope className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">DenTrack</h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">Dental Practice Management System</p>
        </div>

        {/* Quick Demo Instant Access */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              Quick Demo Access
            </span>
            <span className="text-[11px] text-slate-500">1-Click Sign In</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => loginAs('Doctor')}
              className="flex items-center justify-between p-3 rounded-2xl bg-sky-950/40 border border-sky-800/40 hover:bg-sky-900/60 hover:border-sky-500/60 transition-all group text-left"
            >
              <div>
                <p className="text-xs font-semibold text-white group-hover:text-sky-300">Doctor</p>
                <p className="text-[10px] text-sky-400/90 truncate">Full Access</p>
              </div>
              <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0 group-hover:scale-110 transition-transform" />
            </button>

            <button
              type="button"
              onClick={() => loginAs('Receptionist')}
              className="flex items-center justify-between p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 hover:bg-emerald-900/60 hover:border-emerald-500/60 transition-all group text-left"
            >
              <div>
                <p className="text-xs font-semibold text-white group-hover:text-emerald-300">Receptionist</p>
                <p className="text-[10px] text-emerald-400/90 truncate">Front Desk</p>
              </div>
              <UserCheck2 className="w-4 h-4 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        <div className="relative flex items-center justify-center my-5">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-slate-900 px-3 text-[11px] font-medium text-slate-500 uppercase tracking-wider shrink-0">
            Or sign in with email
          </span>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@dentrack.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-slate-100 text-sm focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-slate-100 text-sm focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white font-semibold rounded-2xl text-sm transition-all shadow-lg shadow-sky-600/25 hover:shadow-sky-500/35 flex items-center justify-center gap-2 mt-2 group"
          >
            <span>Sign In to Practice</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* Footer Link */}
        <p className="mt-8 text-center text-xs text-slate-400">
          Don&apos;t have an account yet?{' '}
          <Link href="/signup" className="text-sky-400 font-semibold hover:text-sky-300 hover:underline transition-colors">
            Create Account
          </Link>
        </p>

      </div>
    </div>
  );
}
