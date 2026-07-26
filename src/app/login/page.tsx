'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Stethoscope, UserCheck, Shield, Lock, Mail, ArrowRight, Sparkles, UserCheck2 } from 'lucide-react';

export default function LoginPage() {
  const { login, loginAs, user } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // If already logged in, redirect to home
  if (user) {
    router.push('/');
  }

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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Left Side: Branding & Role info */}
        <div className="lg:col-span-5 p-8 sm:p-10 bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/60 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center shadow-lg shadow-sky-600/30">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">DenTrack</h1>
                <p className="text-xs text-sky-400 font-medium">Dental Practice System</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-3 leading-tight">
              Welcome back to your practice
            </h2>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Sign in to manage appointments, clinical records, inventory, and clinic operations seamlessly.
            </p>

            <div className="space-y-3.5 bg-slate-950/50 p-4 rounded-xl border border-slate-800/80">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-200">Doctor Access</p>
                  <p className="text-[11px] text-slate-400">Full control over clinical records, billing, analytics, and treatments.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-200">Receptionist Access</p>
                  <p className="text-[11px] text-slate-400">Focused front-desk view: Scheduler, Lab Orders, Inventory & Recalls (Revenue hidden).</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-xs text-slate-500 pt-4 border-t border-slate-800/60">
            Powered by DenTrack Cloud &bull; Acting JSON DB for Vercel/Render
          </div>
        </div>

        {/* Right Side: Demo Buttons & Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
          
          {/* Quick Demo Login Buttons */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Instant Demo Access
              </span>
              <span className="text-[11px] text-slate-400">Select a role to test</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => loginAs('Doctor')}
                className="flex items-center justify-between p-3.5 rounded-xl bg-sky-950/40 border border-sky-800/50 hover:bg-sky-900/50 hover:border-sky-500/60 text-left transition-all group"
              >
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors">Dr. Sarah Jenkins</p>
                  <p className="text-[11px] text-sky-400">Doctor (Full Access)</p>
                </div>
                <UserCheck2 className="w-4 h-4 text-sky-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => loginAs('Receptionist')}
                className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50 hover:bg-emerald-900/50 hover:border-emerald-500/60 text-left transition-all group"
              >
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">Alex Rivers</p>
                  <p className="text-[11px] text-emerald-400">Receptionist (Front Desk)</p>
                </div>
                <UserCheck2 className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-[11px] font-medium text-slate-500 uppercase tracking-wider shrink-0">
              Or login with credentials
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@dentrack.com or receptionist@dentrack.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors placeholder:text-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors placeholder:text-slate-600"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-500 text-white font-medium rounded-xl text-sm transition-all shadow-lg shadow-sky-600/20 flex items-center justify-center gap-2 mt-2"
            >
              Sign In to Practice
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            Don&apos;t have an account yet?{' '}
            <Link href="/signup" className="text-sky-400 font-semibold hover:underline">
              Create New Account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
