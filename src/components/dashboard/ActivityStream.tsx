'use client';

import { useApp } from '@/lib/store';
import { timeAgo } from '@/lib/utils';
import { UserPlus, CalendarCheck, CheckCircle, Receipt, Activity, Pill, FlaskConical, Bell, AlertTriangle, FileText } from 'lucide-react';
import { ActivityItem } from '@/lib/types';

const ACTIVITY_ICONS: Record<ActivityItem['type'], { icon: any; bg: string; color: string }> = {
  patient_added: { icon: UserPlus, bg: 'bg-sky-50', color: 'text-sky-600' },
  appointment_scheduled: { icon: CalendarCheck, bg: 'bg-amber-50', color: 'text-amber-600' },
  appointment_completed: { icon: CheckCircle, bg: 'bg-green-50', color: 'text-green-600' },
  invoice_created: { icon: Receipt, bg: 'bg-slate-100', color: 'text-slate-600' },
  prescription_issued: { icon: Pill, bg: 'bg-violet-50', color: 'text-violet-600' },
  lab_order_sent: { icon: FlaskConical, bg: 'bg-cyan-50', color: 'text-cyan-600' },
  lab_order_received: { icon: FlaskConical, bg: 'bg-emerald-50', color: 'text-emerald-600' },
  recall_due: { icon: Bell, bg: 'bg-rose-50', color: 'text-rose-600' },
  stock_low: { icon: AlertTriangle, bg: 'bg-orange-50', color: 'text-orange-600' },
  record_added: { icon: FileText, bg: 'bg-sky-50', color: 'text-sky-600' },
};

export default function ActivityStream() {
  const { activity } = useApp();
  const recent = activity.slice(0, 10);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
        <Activity className="w-4 h-4 text-slate-400" />
        <h2 className="text-[14px] font-semibold text-slate-900">Activity Stream</h2>
        <span className="ml-auto text-[11px] text-slate-400">Last {recent.length} events</span>
      </div>

      {recent.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-sm">No activity yet</div>
      ) : (
        <div className="divide-y divide-slate-50">
          {recent.map((item) => {
            const cfg = ACTIVITY_ICONS[item.type];
            const Icon = cfg.icon;
            return (
              <div
                key={item.id}
                className="flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors"
              >
                <div className={`w-8 h-8 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                  <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-slate-700 leading-snug">{item.message}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{timeAgo(item.timestamp)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
