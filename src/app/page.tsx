'use client';

import { useState } from 'react';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import MetricsRow from '@/components/dashboard/MetricsRow';
import ActivityStream from '@/components/dashboard/ActivityStream';
import TodayAppointments from '@/components/dashboard/TodayAppointments';
import PatientDrawer from '@/components/patients/PatientDrawer';
import AppointmentModal from '@/components/scheduler/AppointmentModal';
import PendingRequestsModal from '@/components/scheduler/PendingRequestsModal';
import { UserPlus, CalendarPlus, Stethoscope, CalendarDays, FlaskConical, Clock, ChevronRight } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useApp } from '@/lib/store';

export default function DashboardPage() {
  const [patientDrawer, setPatientDrawer] = useState(false);
  const [appointmentModal, setAppointmentModal] = useState(false);
  const [requestsModal, setRequestsModal] = useState(false);

  const { user } = useAuth();
  const { getPendingAppointments } = useApp();

  const isDoctor = user?.role === 'Doctor';
  const pendingRequests = getPendingAppointments();

  return (
    <AppShell
      title={`${user?.role === 'Doctor' ? 'Doctor' : 'Reception'} Dashboard`}
      subtitle={`${new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`}
      actions={
        <div className="flex items-center gap-2">
          {isDoctor && pendingRequests.length > 0 && (
            <button
              onClick={() => setRequestsModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs sm:text-[13px] font-medium rounded-lg transition-colors relative"
            >
              <Clock className="w-4 h-4 text-amber-600" />
              <span className="hidden sm:inline">Requests</span>
              <span className="flex items-center justify-center min-w-4 h-4 text-[10px] font-bold rounded-full bg-amber-600 text-white px-1 ml-0.5">
                {pendingRequests.length}
              </span>
            </button>
          )}

          {isDoctor && (
            <button
              onClick={() => setPatientDrawer(true)}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 bg-white border border-slate-200 text-slate-700 text-xs sm:text-[13px] font-medium rounded-lg hover:bg-slate-50 transition-colors"
            >
              <UserPlus className="w-4 h-4 text-sky-600" />
              <span className="hidden sm:inline">Add Patient</span>
              <span className="sm:hidden">+ Patient</span>
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
      <div className="space-y-6">
        
        {/* Doctor Pending Appointment Requests Alert Banner */}
        {isDoctor && pendingRequests.length > 0 && (
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0 font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[13.5px] font-semibold text-amber-950">
                  {pendingRequests.length} Pending Appointment Request{pendingRequests.length !== 1 ? 's' : ''} from Reception
                </p>
                <p className="text-[11.5px] text-amber-800/90 mt-0.5">
                  Reception staff has submitted appointment bookings awaiting Doctor confirmation.
                </p>
              </div>
            </div>

            <button
              onClick={() => setRequestsModal(true)}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition-colors shrink-0 shadow-sm"
            >
              <span>Review &amp; Approve</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Metrics Row */}
        <MetricsRow />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => setAppointmentModal(true)}
            className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-4 hover:border-sky-300 hover:shadow-sm hover:bg-sky-50/40 transition-all text-left group"
          >
            <div className="w-9 h-9 bg-sky-50 rounded-lg flex items-center justify-center group-hover:bg-sky-100 transition-colors shrink-0">
              <CalendarPlus className="w-4.5 h-4.5 text-sky-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-slate-900">+ New Appointment</p>
              <p className="text-[11px] text-slate-500 truncate">Book patient appointment</p>
            </div>
          </button>

          {isDoctor ? (
            <button
              onClick={() => setPatientDrawer(true)}
              className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-4 hover:border-sky-300 hover:shadow-sm hover:bg-sky-50/40 transition-all text-left group"
            >
              <div className="w-9 h-9 bg-sky-50 rounded-lg flex items-center justify-center group-hover:bg-sky-100 transition-colors shrink-0">
                <UserPlus className="w-4.5 h-4.5 text-sky-600" />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-slate-900">+ Add Patient</p>
                <p className="text-[11px] text-slate-500 truncate">Register new patient</p>
              </div>
            </button>
          ) : (
            <Link
              href="/scheduler"
              className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-4 hover:border-sky-300 hover:shadow-sm hover:bg-sky-50/40 transition-all text-left group"
            >
              <div className="w-9 h-9 bg-sky-50 rounded-lg flex items-center justify-center group-hover:bg-sky-100 transition-colors shrink-0">
                <CalendarDays className="w-4.5 h-4.5 text-sky-600" />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-slate-900">Weekly Schedule</p>
                <p className="text-[11px] text-slate-500 truncate">View calendar overview</p>
              </div>
            </Link>
          )}

          {isDoctor ? (
            <Link
              href="/patients"
              className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-4 hover:border-sky-300 hover:shadow-sm hover:bg-sky-50/40 transition-all group"
            >
              <div className="w-9 h-9 bg-sky-50 rounded-lg flex items-center justify-center group-hover:bg-sky-100 transition-colors shrink-0">
                <Stethoscope className="w-4.5 h-4.5 text-sky-600" />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-slate-900">Tooth Chart & EDR</p>
                <p className="text-[11px] text-slate-500 truncate">Open clinical records</p>
              </div>
            </Link>
          ) : (
            <Link
              href="/lab-work"
              className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-4 hover:border-sky-300 hover:shadow-sm hover:bg-sky-50/40 transition-all group"
            >
              <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center group-hover:bg-purple-100 transition-colors shrink-0">
                <FlaskConical className="w-4.5 h-4.5 text-purple-600" />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-slate-900">Lab Work Orders</p>
                <p className="text-[11px] text-slate-500 truncate">Track lab submissions</p>
              </div>
            </Link>
          )}
        </div>

        {/* Main content area */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-3">
            <TodayAppointments />
          </div>
          <div className="lg:col-span-2">
            <ActivityStream />
          </div>
        </div>
      </div>

      <PatientDrawer open={patientDrawer} onClose={() => setPatientDrawer(false)} />
      <AppointmentModal open={appointmentModal} onClose={() => setAppointmentModal(false)} />
      <PendingRequestsModal open={requestsModal} onClose={() => setRequestsModal(false)} />
    </AppShell>
  );
}
