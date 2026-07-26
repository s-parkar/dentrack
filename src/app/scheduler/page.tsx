'use client';

import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import CalendarView from '@/components/scheduler/CalendarView';
import AppointmentModal from '@/components/scheduler/AppointmentModal';
import PendingRequestsModal from '@/components/scheduler/PendingRequestsModal';
import { useApp } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import { getTodayString } from '@/lib/utils';
import { CalendarPlus, Clock } from 'lucide-react';

export default function SchedulerPage() {
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [appointmentModal, setAppointmentModal] = useState(false);
  const [requestsModal, setRequestsModal] = useState(false);
  
  const { appointments, getPendingAppointments } = useApp();
  const { user } = useAuth();

  const isDoctor = user?.role === 'Doctor';
  const pendingAppointments = getPendingAppointments();
  const dayCount = appointments.filter((a) => a.date === selectedDate).length;

  return (
    <AppShell
      title="Scheduler"
      subtitle={`${dayCount} appointment${dayCount !== 1 ? 's' : ''} scheduled`}
      actions={
        <div className="flex items-center gap-2">
          {isDoctor && (
            <button
              onClick={() => setRequestsModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs sm:text-[13px] font-medium rounded-lg transition-colors relative"
            >
              <Clock className="w-4 h-4 text-amber-600" />
              <span className="hidden sm:inline">Requests</span>
              {pendingAppointments.length > 0 && (
                <span className="flex items-center justify-center min-w-4 h-4 text-[10px] font-bold rounded-full bg-amber-600 text-white px-1">
                  {pendingAppointments.length}
                </span>
              )}
            </button>
          )}

          <button
            onClick={() => setAppointmentModal(true)}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-[13px] font-medium rounded-lg transition-colors shadow-sm"
          >
            <CalendarPlus className="w-4 h-4" />
            <span>New Appt</span>
          </button>
        </div>
      }
    >
      <div className="h-full" style={{ minHeight: 'calc(100vh - 140px)' }}>
        <CalendarView selectedDate={selectedDate} onDateChange={setSelectedDate} />
      </div>

      <AppointmentModal
        open={appointmentModal}
        onClose={() => setAppointmentModal(false)}
        defaultDate={selectedDate}
        onSaveSuccess={(d) => setSelectedDate(d)}
      />

      <PendingRequestsModal
        open={requestsModal}
        onClose={() => setRequestsModal(false)}
        onSelectDate={(d) => setSelectedDate(d)}
      />
    </AppShell>
  );
}
