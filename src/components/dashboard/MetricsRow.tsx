'use client';

import { useApp } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import { getTodayString, formatCurrency } from '@/lib/utils';
import { CalendarCheck, Users, BanknoteIcon, Clock, FlaskConical } from 'lucide-react';

export default function MetricsRow() {
  const { appointments, invoices, labWorkOrders, patients } = useApp();
  const { user } = useAuth();
  const today = getTodayString();

  const isDoctor = user?.role === 'Doctor';

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

  const pendingLabOrdersCount = labWorkOrders.filter((o) => o.status !== 'Received' && o.status !== 'Fitted').length;

  const cards = [
    {
      label: "Today's Appointments",
      value: todaysAppts.length,
      sub: `${completedCount} completed · ${scheduledCount} upcoming`,
      icon: CalendarCheck,
      iconBg: 'bg-sky-50',
      iconColor: 'text-sky-600',
    },
    {
      label: 'Waiting Room',
      value: inProgressCount,
      sub: `${scheduledCount} in queue`,
      icon: Clock,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
    isDoctor
      ? {
          label: "Today's Collections",
          value: formatCurrency(todaysRevenue),
          sub: `${invoices.filter((i) => { const d = appointments.find((a) => a.id === i.appointmentId)?.date; return d === today; }).length} invoices`,
          icon: BanknoteIcon,
          iconBg: 'bg-green-50',
          iconColor: 'text-green-600',
        }
      : {
          label: 'Pending Lab Orders',
          value: pendingLabOrdersCount,
          sub: 'active lab orders in process',
          icon: FlaskConical,
          iconBg: 'bg-purple-50',
          iconColor: 'text-purple-600',
        },
    {
      label: 'Total Patients',
      value: patients.length,
      sub: 'registered clinic records',
      icon: Users,
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 flex items-start gap-4 shadow-sm"
        >
          <div className={`w-10 h-10 rounded-lg ${card.iconBg} flex items-center justify-center shrink-0`}>
            <card.icon className={`w-5 h-5 ${card.iconColor}`} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] text-slate-500 font-medium truncate">{card.label}</p>
            <p className="text-xl sm:text-[22px] font-bold text-slate-900 mt-0.5 leading-none truncate">
              {card.value}
            </p>
            <p className="text-[11px] text-slate-400 mt-1 truncate">{card.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
