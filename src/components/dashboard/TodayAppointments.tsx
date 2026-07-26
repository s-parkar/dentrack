'use client';

import { useApp } from '@/lib/store';
import { getTodayString, STATUS_DOT, STATUS_STYLES, formatTime } from '@/lib/utils';
import { CalendarDays } from 'lucide-react';

export default function TodayAppointments() {
  const { appointments, patients } = useApp();
  const today = getTodayString();
  const todaysAppts = appointments
    .filter((a) => a.date === today)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
        <CalendarDays className="w-4 h-4 text-slate-400" />
        <h2 className="text-[14px] font-semibold text-slate-900">Today&apos;s Schedule</h2>
        <span className="ml-auto text-[11px] text-slate-400">{todaysAppts.length} appointments</span>
      </div>

      {todaysAppts.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-sm">No appointments today</div>
      ) : (
        <div className="divide-y divide-slate-50">
          {todaysAppts.map((appt) => {
            const patient = patients.find((p) => p.id === appt.patientId);
            return (
              <div key={appt.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                {/* Time */}
                <div className="w-14 text-right shrink-0">
                  <p className="text-[12px] font-semibold text-slate-700">{formatTime(appt.startTime)}</p>
                  <p className="text-[10px] text-slate-400">{appt.durationMinutes}m</p>
                </div>
                {/* Color bar */}
                <div className={`w-1 h-10 rounded-full ${STATUS_DOT[appt.status]} shrink-0`} />
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-slate-900 truncate">
                    {patient?.name ?? 'Unknown Patient'}
                  </p>
                  <p className="text-[11px] text-slate-500">{appt.procedure} · {appt.chair}</p>
                </div>
                {/* Status */}
                <span className={`badge ${STATUS_STYLES[appt.status]}`}>
                  {appt.status}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
