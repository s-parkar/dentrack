'use client';

import { useState } from 'react';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import MetricsRow from '@/components/dashboard/MetricsRow';
import ActivityStream from '@/components/dashboard/ActivityStream';
import TodayAppointments from '@/components/dashboard/TodayAppointments';
import PatientDrawer from '@/components/patients/PatientDrawer';
import AppointmentModal from '@/components/scheduler/AppointmentModal';
import { UserPlus, CalendarPlus, Stethoscope } from 'lucide-react';

export default function DashboardPage() {
  const [patientDrawer, setPatientDrawer] = useState(false);
  const [appointmentModal, setAppointmentModal] = useState(false);

  return (
    <AppShell
      title="Dashboard"
      subtitle={`${new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`}
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPatientDrawer(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 text-[13px] font-medium rounded-lg hover:bg-slate-50 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Add Patient
          </button>
          <button
            onClick={() => setAppointmentModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-[13px] font-medium rounded-lg transition-colors"
          >
            <CalendarPlus className="w-4 h-4" />
            New Appointment
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Metrics */}
        <MetricsRow />

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => setPatientDrawer(true)}
            className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-4 hover:border-sky-200 hover:bg-sky-50/30 transition-all text-left group"
          >
            <div className="w-9 h-9 bg-sky-50 rounded-lg flex items-center justify-center group-hover:bg-sky-100 transition-colors">
              <UserPlus className="w-4.5 h-4.5 text-sky-600" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-slate-900">+ Add Patient</p>
              <p className="text-[11px] text-slate-500">Register new patient</p>
            </div>
          </button>

          <button
            onClick={() => setAppointmentModal(true)}
            className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-4 hover:border-sky-200 hover:bg-sky-50/30 transition-all text-left group"
          >
            <div className="w-9 h-9 bg-sky-50 rounded-lg flex items-center justify-center group-hover:bg-sky-100 transition-colors">
              <CalendarPlus className="w-4.5 h-4.5 text-sky-600" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-slate-900">+ New Appointment</p>
              <p className="text-[11px] text-slate-500">Schedule quickly</p>
            </div>
          </button>

          <Link
            href="/patients"
            className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-4 hover:border-sky-200 hover:bg-sky-50/30 transition-all group"
          >
            <div className="w-9 h-9 bg-sky-50 rounded-lg flex items-center justify-center group-hover:bg-sky-100 transition-colors">
              <Stethoscope className="w-4.5 h-4.5 text-sky-600" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-slate-900">Quick Tooth Chart</p>
              <p className="text-[11px] text-slate-500">Open odontogram</p>
            </div>
          </Link>
        </div>

        {/* Main content area */}
        <div className="grid grid-cols-5 gap-5">
          <div className="col-span-3">
            <TodayAppointments />
          </div>
          <div className="col-span-2">
            <ActivityStream />
          </div>
        </div>
      </div>

      <PatientDrawer open={patientDrawer} onClose={() => setPatientDrawer(false)} />
      <AppointmentModal open={appointmentModal} onClose={() => setAppointmentModal(false)} />
    </AppShell>
  );
}
