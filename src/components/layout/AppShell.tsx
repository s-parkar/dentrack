'use client';

import { ReactNode, useState } from 'react';
import Sidebar from './Sidebar';
import AuthGuard from '../auth/AuthGuard';
import { useAuth } from '@/lib/auth';
import { Menu, Stethoscope, LogOut, Shield, UserCheck } from 'lucide-react';
import Link from 'next/link';

interface AppShellProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export default function AppShell({ children, title, subtitle, actions }: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900">
        {/* Sidebar */}
        <Sidebar
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          
          {/* Top Navbar */}
          <header className="shrink-0 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5 bg-white border-b border-slate-200">
            
            {/* Left: Mobile Menu Button & Title */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                aria-label="Open Mobile Menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-[18px] font-semibold text-slate-900 truncate">
                    {title}
                  </h1>
                </div>
                {subtitle && (
                  <p className="text-xs sm:text-[13px] text-slate-500 truncate mt-0.5">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Right: Actions & User Info */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {actions && <div className="flex items-center gap-2">{actions}</div>}

              {/* User badge on tablet/desktop */}
              <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-200">
                <div className="flex items-center gap-2 text-right">
                  <div>
                    <p className="text-xs font-semibold text-slate-800 leading-tight">
                      {user?.name}
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium leading-tight">
                      {user?.role} Access
                    </p>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
                    {user?.role === 'Doctor' ? (
                      <Shield className="w-3.5 h-3.5 text-sky-600" />
                    ) : (
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                  </div>
                </div>

                <button
                  onClick={logout}
                  title="Sign out"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </header>

          {/* Main Scrollable Content */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
