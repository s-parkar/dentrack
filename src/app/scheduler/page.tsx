'use client';

import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import CalendarView from '@/components/scheduler/CalendarView';
import AppointmentModal from '@/components/scheduler/AppointmentModal';
import { useApp } from '@/lib/store';
import { getTodayString } from '@/lib/utils';
import { CalendarPlus } from 'lucide-react';

export default function SchedulerPage() {
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [appointmentModal, setAppointmentModal] = useState(false);
  const { appointments } = useApp();
  const dayCount = appointments.filter((a) => a.date === selectedDate).length;

  return (
    <AppShell
      title="Scheduler"
      subtitle={`${dayCount} appointment${dayCount !== 1 ? 's' : ''} scheduled`}
      actions={
        <button
          onClick={() => setAppointmentModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-[13px] font-medium rounded-lg transition-colors"
        >
          <CalendarPlus className="w-4 h-4" />
          New Appointment
        </button>
      }
    >
      <div className="h-full" style={{ minHeight: 'calc(100vh - 140px)' }}>
        <CalendarView selectedDate={selectedDate} onDateChange={setSelectedDate} />
      </div>

      <AppointmentModal
        open={appointmentModal}
        onClose={() => setAppointmentModal(false)}
        defaultDate={selectedDate}
      />
    </AppShell>
  );
}
