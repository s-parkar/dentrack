'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, CalendarDays, FileText, Pill,
  FlaskConical, Package, BarChart3, Bell, Stethoscope,
  CreditCard, LogOut, Shield, UserCheck, X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/lib/store';
import { useAuth } from '@/lib/auth';

const NAV_GROUPS = [
  {
    label: 'Clinical',
    items: [
      { href: '/', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/patients', label: 'Patients', icon: Users },
      { href: '/records', label: 'Clinical Records', icon: FileText },
      { href: '/scheduler', label: 'Scheduler', icon: CalendarDays },
    ],
  },
  {
    label: 'Clinical Tools',
    items: [
      { href: '/prescriptions', label: 'Prescriptions', icon: Pill },
      { href: '/lab-work', label: 'Lab Work Orders', icon: FlaskConical },
    ],
  },
  {
    label: 'Operations',
    items: [
      { href: '/inventory', label: 'Inventory', icon: Package },
      { href: '/billing', label: 'Billing', icon: CreditCard },
      { href: '/analytics', label: 'Analytics', icon: BarChart3 },
      { href: '/recalls', label: 'Recalls', icon: Bell },
    ],
  },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({ mobileOpen = false, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { getDueRecalls, getLowStockItems } = useApp();
  const { user, logout, hasAccess } = useAuth();

  const dueRecallCount = getDueRecalls().length;
  const lowStockCount = getLowStockItems().length;

  const content = (
    <aside className="flex flex-col h-full w-[230px] bg-slate-900 border-r border-slate-800 shrink-0 text-slate-300">
      {/* Logo Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-sky-600 shrink-0 shadow-md shadow-sky-600/30">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-[15px] leading-none">DenTrack</p>
            <p className="text-slate-500 text-[10px] mt-0.5 leading-tight">Practice Management</p>
          </div>
        </div>

        {/* Mobile Close Button */}
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav Groups filtered by permission */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {NAV_GROUPS.map((group) => {
          const visibleItems = group.items.filter((item) => hasAccess(item.href));
          if (visibleItems.length === 0) return null;

          return (
            <div key={group.label}>
              <p className="text-slate-500 text-[9px] font-semibold uppercase tracking-widest px-2 py-1 mb-0.5">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {visibleItems.map(({ href, label, icon: Icon }) => {
                  const active = pathname === href;
                  const badge =
                    href === '/recalls' && dueRecallCount > 0
                      ? dueRecallCount
                      : href === '/inventory' && lowStockCount > 0
                      ? lowStockCount
                      : 0;

                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => onCloseMobile?.()}
                      className={cn(
                        'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[12.5px] font-medium transition-colors duration-100',
                        active
                          ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/30'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      )}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="flex-1 truncate">{label}</span>
                      {badge > 0 && (
                        <span
                          className={cn(
                            'flex items-center justify-center min-w-4 h-4 text-[9px] font-bold rounded-full px-1',
                            active ? 'bg-white/20 text-white' : 'bg-rose-500 text-white'
                          )}
                        >
                          {badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* User Profile & Logout Footer */}
      <div className="px-3 py-3 border-t border-slate-800 bg-slate-900/60">
        <div className="flex items-center justify-between px-2 py-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
              {user?.role === 'Doctor' ? (
                <Shield className="w-4 h-4 text-sky-400" />
              ) : (
                <UserCheck className="w-4 h-4 text-emerald-400" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-slate-200 text-[12px] font-medium leading-tight truncate">
                {user?.name || 'Staff User'}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <span
                  className={cn(
                    'text-[9px] font-semibold px-1.5 py-0.2 rounded uppercase tracking-wider',
                    user?.role === 'Doctor'
                      ? 'bg-sky-500/20 text-sky-300'
                      : 'bg-emerald-500/20 text-emerald-300'
                  )}
                >
                  {user?.role || 'Guest'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            title="Sign Out"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar (visible lg and up) */}
      <div className="hidden lg:block h-screen shrink-0">{content}</div>

      {/* Mobile Drawer (overlay on screens below lg) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 h-full">{content}</div>
        </div>
      )}
    </>
  );
}
