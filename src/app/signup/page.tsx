'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole } from '@/lib/auth';
import { Stethoscope, User, Mail, Lock, Shield, UserCheck, ArrowRight } from 'lucide-react';

export default function SignupPage() {
  const { signup, user } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('Doctor');
  const [error, setError] = useState<string | null>(null);

  if (user) {
    router.push('/');
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    const res = signup({ name, email, password, role });
    if (!res.success) {
      setError(res.error || 'Failed to create account.');
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 sm:p-10">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center shadow-lg shadow-sky-600/30">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">DenTrack</h1>
            <p className="text-xs text-sky-400 font-medium">Create New Staff Account</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">Register User</h2>
        <p className="text-xs text-slate-400 mb-6">
          Choose a role to determine access permissions across the dental platform.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Role Selection */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Account Role</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('Doctor')}
                className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  role === 'Doctor'
                    ? 'bg-sky-950/60 border-sky-500 text-white ring-1 ring-sky-500'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Shield className={`w-4 h-4 ${role === 'Doctor' ? 'text-sky-400' : 'text-slate-500'}`} />
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300">
                    Full Access
                  </span>
                </div>
                <p className="text-xs font-bold">Doctor</p>
                <p className="text-[10px] text-slate-400">Clinical & Financials</p>
              </button>

              <button
                type="button"
                onClick={() => setRole('Receptionist')}
                className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  role === 'Receptionist'
                    ? 'bg-emerald-950/60 border-emerald-500 text-white ring-1 ring-emerald-500'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <UserCheck className={`w-4 h-4 ${role === 'Receptionist' ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    Front Desk
                  </span>
                </div>
                <p className="text-xs font-bold">Receptionist</p>
                <p className="text-[10px] text-slate-400">Schedule & Ops Only</p>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Alex Morgan or Taylor Smith"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors placeholder:text-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@dentrack.com"
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
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors placeholder:text-slate-600"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-500 text-white font-medium rounded-xl text-sm transition-all shadow-lg shadow-sky-600/20 flex items-center justify-center gap-2 mt-2"
          >
            Create Account & Enter Practice
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link href="/login" className="text-sky-400 font-semibold hover:underline">
            Sign In Here
          </Link>
        </p>

      </div>
    </div>
  );
}
