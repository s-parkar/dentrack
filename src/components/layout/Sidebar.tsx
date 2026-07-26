'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, CalendarDays, FileText, Pill,
  FlaskConical, Package, BarChart3, Bell, Stethoscope,
  CreditCard, Layers, Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/lib/store';

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

export default function Sidebar() {
  const pathname = usePathname();
  const { getDueRecalls, getLowStockItems } = useApp();
  const dueRecallCount = getDueRecalls().length;
  const lowStockCount = getLowStockItems().length;

  return (
    <aside className="flex flex-col w-58 min-h-screen bg-slate-900 border-r border-slate-800 shrink-0" style={{ width: 228 }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-sky-600 shrink-0">
          <Stethoscope className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-[15px] leading-none">DenTrack</p>
          <p className="text-slate-500 text-[10px] mt-0.5 leading-tight">Dental Practice Platform</p>
        </div>
      </div>

      {/* Nav Groups */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="text-slate-600 text-[9px] font-semibold uppercase tracking-widest px-2 py-1 mb-0.5">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map(({ href, label, icon: Icon }) => {
                const active = pathname === href;
                const badge = href === '/recalls' && dueRecallCount > 0 ? dueRecallCount
                            : href === '/inventory' && lowStockCount > 0 ? lowStockCount
                            : 0;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[12.5px] font-medium transition-colors duration-100',
                      active
                        ? 'bg-sky-600 text-white'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="flex-1 truncate">{label}</span>
                    {badge > 0 && (
                      <span className={cn(
                        'flex items-center justify-center min-w-4 h-4 text-[9px] font-bold rounded-full px-1',
                        active ? 'bg-white/20 text-white' : 'bg-rose-500 text-white'
                      )}>
                        {badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-slate-800">
        <div className="flex items-center gap-2 px-2">
          <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
            <Activity className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="min-w-0">
            <p className="text-slate-300 text-[11px] font-medium leading-tight truncate">DenTrack Demo Clinic</p>
            <p className="text-slate-600 text-[9px] leading-tight">v2.0 · Full Prototype</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
