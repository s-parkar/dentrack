'use client';

import { useApp } from '@/lib/store';
import { getTodayString, formatCurrency } from '@/lib/utils';
import { CalendarCheck, Users, BanknoteIcon, Clock } from 'lucide-react';

export default function MetricsRow() {
  const { appointments, invoices } = useApp();
  const today = getTodayString();

  const todaysAppts = appointments.filter((a) => a.date === today);
  const inProgressCount = todaysAppts.filter((a) => a.status === 'In-Progress').length;
  const scheduledCount = todaysAppts.filter((a) => a.status === 'Scheduled').length;
  const completedCount = todaysAppts.filter((a) => a.status === 'Completed').length;

  const todaysRevenue = invoices
    .filter((inv) => {
      const apptDate = appointments.find((a) => a.id === inv.appointmentId)?.date;
      return apptDate === today;
    })
    .reduce((sum, inv) => sum + inv.total, 0);

  const cards = [
    {
      label: "Today's Appointments",
      value: todaysAppts.length,
      sub: `${completedCount} completed · ${scheduledCount} upcoming`,
      icon: CalendarCheck,
      iconBg: 'bg-sky-50',
      iconColor: 'text-sky-600',
      valueBg: 'border-sky-100',
    },
    {
      label: 'Waiting Room',
      value: inProgressCount,
      sub: `${scheduledCount} in queue`,
      icon: Clock,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      valueBg: 'border-amber-100',
    },
    {
      label: "Today's Collections",
      value: formatCurrency(todaysRevenue),
      sub: `${invoices.filter((i) => { const d = appointments.find((a) => a.id === i.appointmentId)?.date; return d === today; }).length} invoices`,
      icon: BanknoteIcon,
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
      valueBg: 'border-green-100',
    },
    {
      label: 'Total Patients',
      value: useApp().patients.length,
      sub: 'registered records',
      icon: Users,
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-600',
      valueBg: 'border-slate-200',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-5">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`bg-white rounded-xl border border-slate-200 p-5 flex items-start gap-4`}
        >
          <div className={`w-10 h-10 rounded-lg ${card.iconBg} flex items-center justify-center shrink-0`}>
            <card.icon className={`w-5 h-5 ${card.iconColor}`} />
          </div>
          <div className="min-w-0">
            <p className="text-[12px] text-slate-500 font-medium">{card.label}</p>
            <p className="text-[22px] font-bold text-slate-900 mt-0.5 leading-none">
              {card.value}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">{card.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
