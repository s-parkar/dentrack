'use client';

import { useState } from 'react';
import { useApp } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import { Appointment, Chair } from '@/lib/types';
import {
  formatTime,
  formatDate,
  timeToMinutes,
  STATUS_DOT,
  getTodayString,
  addDaysToDateStr,
} from '@/lib/utils';
import AppointmentModal from './AppointmentModal';
import InvoiceModal from '@/components/billing/InvoiceModal';
import PendingRequestsModal from './PendingRequestsModal';
import { ChevronLeft, ChevronRight, Plus, Edit2, Receipt, Clock, CheckCircle2, XCircle } from 'lucide-react';

const CHAIRS: Chair[] = ['Chair A', 'Chair B', 'Chair C', 'Chair D'];
const CHAIR_COLORS: Record<Chair, { bg: string; header: string; text: string }> = {
  'Chair A': { bg: 'bg-sky-50', header: 'bg-sky-600', text: 'text-sky-700' },
  'Chair B': { bg: 'bg-violet-50', header: 'bg-violet-600', text: 'text-violet-700' },
  'Chair C': { bg: 'bg-amber-50', header: 'bg-amber-600', text: 'text-amber-700' },
  'Chair D': { bg: 'bg-emerald-50', header: 'bg-emerald-600', text: 'text-emerald-700' },
};

// Time slots: 8:00 AM - 7:00 PM (30 min each)
const TIME_START = 8 * 60; // 480 mins
const TIME_END = 19 * 60;  // 1140 mins
const SLOT_HEIGHT = 56; // px per 30 min slot
const SLOT_MINUTES = 30;
const TOTAL_SLOTS = (TIME_END - TIME_START) / SLOT_MINUTES;

function makeSlots() {
  const slots: string[] = [];
  for (let i = 0; i < TOTAL_SLOTS; i++) {
    const m = TIME_START + i * SLOT_MINUTES;
    const h = Math.floor(m / 60).toString().padStart(2, '0');
    const min = (m % 60).toString().padStart(2, '0');
    slots.push(`${h}:${min}`);
  }
  return slots;
}
const TIME_SLOTS = makeSlots();

function getApptPosition(appt: Appointment): { top: number; height: number } {
  const startMins = timeToMinutes(appt.startTime);
  const offset = startMins - TIME_START;
  const top = (offset / SLOT_MINUTES) * SLOT_HEIGHT;
  const height = Math.max((appt.durationMinutes / SLOT_MINUTES) * SLOT_HEIGHT - 2, SLOT_HEIGHT - 2);
  return { top, height };
}

interface CalendarViewProps {
  selectedDate: string;
  onDateChange: (d: string) => void;
}

export default function CalendarView({ selectedDate, onDateChange }: CalendarViewProps) {
  const { appointments, patients, updateAppointment, approveAppointment, rejectAppointment, getPendingAppointments } = useApp();
  const { user } = useAuth();

  const [bookingModal, setBookingModal] = useState<{
    open: boolean;
    chair?: Chair;
    time?: string;
    existing?: Appointment;
  }>({ open: false });
  const [invoiceModal, setInvoiceModal] = useState<{ open: boolean; appointment?: Appointment }>({
    open: false,
  });
  const [pendingModalOpen, setPendingModalOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ appt: Appointment; x: number; y: number } | null>(null);

  const dayAppointments = appointments.filter((a) => a.date === selectedDate);
  const pendingAppointments = getPendingAppointments();
  const isDoctor = user?.role === 'Doctor';

  const prevDay = () => onDateChange(addDaysToDateStr(selectedDate, -1));
  const nextDay = () => onDateChange(addDaysToDateStr(selectedDate, 1));
  const goToday = () => onDateChange(getTodayString());

  const handleSlotClick = (chair: Chair, time: string) => {
    setBookingModal({ open: true, chair, time });
  };

  const handleApptClick = (appt: Appointment, e: React.MouseEvent) => {
    e.stopPropagation();
    setContextMenu({ appt, x: e.clientX, y: e.clientY });
  };

  const closeContextMenu = () => setContextMenu(null);

  const getApptForChair = (chair: Chair) =>
    dayAppointments.filter((a) => a.chair === chair);

  const isToday = selectedDate === getTodayString();

  const addDays = (n: number) => onDateChange(addDaysToDateStr(selectedDate, n));

  return (
    <div className="flex flex-col h-full" onClick={closeContextMenu}>
      {/* Date Nav */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={prevDay}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-slate-600"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Interactive Date Picker Button */}
          <div className="relative flex items-center bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm hover:border-sky-400 transition-colors cursor-pointer group">
            <span className="text-[14px] font-semibold text-slate-900 mr-2">
              {formatDate(selectedDate)}
            </span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => e.target.value && onDateChange(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              title="Click to select any future date"
            />
          </div>

          <button
            onClick={nextDay}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-slate-600"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => addDays(7)}
            className="px-2.5 py-1.5 text-[11px] font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            title="Jump +7 Days into future"
          >
            +7 Days
          </button>

          {!isToday ? (
            <button
              onClick={goToday}
              className="px-3 py-1.5 text-[12px] font-medium text-sky-600 hover:text-sky-700 border border-sky-200 rounded-lg hover:bg-sky-50 transition-colors"
            >
              Today
            </button>
          ) : (
            <span className="badge bg-sky-50 border-sky-200 text-sky-700">Today</span>
          )}
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Pending Requests Button for Doctor */}
          {isDoctor && (
            <button
              onClick={() => setPendingModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-[12.5px] font-medium rounded-lg transition-colors relative"
            >
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Requests</span>
              {pendingAppointments.length > 0 && (
                <span className="flex items-center justify-center min-w-4 h-4 text-[10px] font-bold rounded-full bg-amber-600 text-white px-1 ml-0.5">
                  {pendingAppointments.length}
                </span>
              )}
            </button>
          )}

          <button
            onClick={() => setBookingModal({ open: true })}
            className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-[13px] font-medium rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            New Appointment
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-x-auto flex flex-col shadow-sm">
        <div className="min-w-[700px] flex-1 flex flex-col">
          {/* Header row */}
          <div className="flex border-b border-slate-200 shrink-0">
            <div className="w-16 shrink-0 border-r border-slate-200 bg-slate-50" />
            {CHAIRS.map((chair) => {
              const cfg = CHAIR_COLORS[chair];
              const apptCount = getApptForChair(chair).length;
              return (
                <div
                  key={chair}
                  className="flex-1 border-r border-slate-200 last:border-r-0 px-3 py-2 flex items-center justify-between"
                >
                  <div>
                    <p className="text-[13px] font-semibold text-slate-900">{chair}</p>
                    <p className="text-[10px] text-slate-500">{apptCount} appt{apptCount !== 1 ? 's' : ''}</p>
                  </div>
                  <div className={`w-2.5 h-2.5 rounded-full ${cfg.header}`} />
                </div>
              );
            })}
          </div>

          {/* Scrollable body */}
          <div className="overflow-y-auto flex-1">
            <div className="flex" style={{ minHeight: TOTAL_SLOTS * SLOT_HEIGHT }}>
              {/* Time labels */}
              <div className="w-16 shrink-0 border-r border-slate-200 bg-slate-50">
                {TIME_SLOTS.map((slot, i) => {
                  const showLabel = i % 2 === 0;
                  return (
                    <div
                      key={slot}
                      className="calendar-slot border-b border-slate-100 flex items-start justify-end pr-2 pt-1"
                      style={{ height: SLOT_HEIGHT }}
                    >
                      {showLabel && (
                        <span className="text-[10px] text-slate-400 font-medium -mt-1.5">
                          {formatTime(slot)}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Chair columns */}
              {CHAIRS.map((chair) => {
                const chairAppts = getApptForChair(chair);
                return (
                  <div
                    key={chair}
                    className="flex-1 border-r border-slate-200 last:border-r-0 relative"
                  >
                    {/* Slot grid lines */}
                    {TIME_SLOTS.map((slot) => (
                      <div
                        key={slot}
                        className="calendar-slot border-b border-slate-100 transition-colors"
                        style={{ height: SLOT_HEIGHT }}
                        onClick={() => handleSlotClick(chair, slot)}
                      />
                    ))}

                    {/* Appointments */}
                    {chairAppts.map((appt) => {
                      const { top, height } = getApptPosition(appt);
                      const patient = patients.find((p) => p.id === appt.patientId);
                      const isPending = appt.approvalStatus === 'Pending';
                      const dotClass = isPending ? 'bg-amber-500 animate-pulse' : STATUS_DOT[appt.status];

                      return (
                        <div
                          key={appt.id}
                          className="absolute left-1 right-1 rounded-lg border cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
                          style={{
                            top: top + 1,
                            height,
                            background: isPending ? '#FFFBEB'
                              : appt.status === 'Completed' ? '#F0FDF4'
                              : appt.status === 'In-Progress' ? '#FFFBEB'
                              : appt.status === 'Cancelled' ? '#F8FAFC'
                              : '#EFF6FF',
                            borderColor: isPending ? '#F59E0B'
                              : appt.status === 'Completed' ? '#BBF7D0'
                              : appt.status === 'In-Progress' ? '#FDE68A'
                              : appt.status === 'Cancelled' ? '#E2E8F0'
                              : '#BFDBFE',
                          }}
                          onClick={(e) => handleApptClick(appt, e)}
                        >
                          <div className="p-1.5 h-full flex flex-col">
                            <div className="flex items-start justify-between gap-1">
                              <p className="text-[10px] font-semibold text-slate-900 leading-tight line-clamp-1 flex-1">
                                {patient?.name ?? '—'}
                              </p>
                              <div className={`w-2 h-2 rounded-full shrink-0 mt-0.5 ${dotClass}`} />
                            </div>

                            {isPending && (
                              <span className="text-[8px] font-bold text-amber-800 bg-amber-200/80 px-1 py-0.2 rounded w-max mt-0.5">
                                Pending Approval
                              </span>
                            )}

                            {height >= 40 && (
                              <p className="text-[9px] text-slate-500 leading-tight mt-0.5 line-clamp-1">
                                {appt.procedure}
                              </p>
                            )}
                            {height >= 54 && (
                              <p className="text-[9px] text-slate-400 mt-0.5">
                                {formatTime(appt.startTime)} · {appt.durationMinutes}m
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={closeContextMenu} />
          <div
            className="fixed z-50 bg-white rounded-xl border border-slate-200 shadow-xl py-1.5 w-52"
            style={{ left: contextMenu.x, top: contextMenu.y }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-3 py-2 border-b border-slate-100">
              <p className="text-[12px] font-semibold text-slate-900">
                {patients.find((p) => p.id === contextMenu.appt.patientId)?.name}
              </p>
              <p className="text-[11px] text-slate-500">{contextMenu.appt.procedure}</p>
              {contextMenu.appt.approvalStatus === 'Pending' && (
                <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                  Submitted by {contextMenu.appt.bookedByName || 'Receptionist'}
                </span>
              )}
            </div>

            {/* Doctor Accept/Reject Section for Pending Appointments */}
            {contextMenu.appt.approvalStatus === 'Pending' && isDoctor && (
              <div className="p-1.5 border-b border-slate-100 bg-amber-50/50 space-y-1">
                <button
                  onClick={() => {
                    approveAppointment(contextMenu.appt.id);
                    closeContextMenu();
                  }}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-[12px] bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Accept Appointment
                </button>
                <button
                  onClick={() => {
                    rejectAppointment(contextMenu.appt.id, 'Declined by Doctor');
                    closeContextMenu();
                  }}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-[12px] bg-rose-100 text-rose-700 font-medium hover:bg-rose-200 transition-colors"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Reject Appointment
                </button>
              </div>
            )}

            {/* Status quick-set */}
            <div className="px-3 py-1.5">
              <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium mb-1.5">Set Status</p>
              {(['Scheduled', 'In-Progress', 'Completed'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    updateAppointment(contextMenu.appt.id, { status: s });
                    closeContextMenu();
                  }}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-[12px] hover:bg-slate-50 text-left transition-colors ${
                    contextMenu.appt.status === s ? 'text-sky-600 font-medium' : 'text-slate-700'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${STATUS_DOT[s]}`} />
                  {s}
                </button>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-1.5">
              <button
                onClick={() => {
                  setBookingModal({ open: true, existing: contextMenu.appt });
                  closeContextMenu();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit Appointment
              </button>
              <button
                onClick={() => {
                  setInvoiceModal({ open: true, appointment: contextMenu.appt });
                  closeContextMenu();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] text-green-700 hover:bg-green-50 transition-colors font-medium"
              >
                <Receipt className="w-3.5 h-3.5" />
                Complete &amp; Bill
              </button>
            </div>
          </div>
        </>
      )}

      {/* Booking Modal */}
      <AppointmentModal
        open={bookingModal.open}
        onClose={() => setBookingModal({ open: false })}
        defaultDate={selectedDate}
        defaultChair={bookingModal.chair}
        defaultTime={bookingModal.time}
        existingAppointment={bookingModal.existing}
        onSaveSuccess={(d) => onDateChange(d)}
      />

      {/* Invoice Modal */}
      {invoiceModal.open && invoiceModal.appointment && (
        <InvoiceModal
          open={invoiceModal.open}
          onClose={() => setInvoiceModal({ open: false })}
          appointment={invoiceModal.appointment}
        />
      )}

      {/* Pending Requests Modal for Doctor */}
      <PendingRequestsModal
        open={pendingModalOpen}
        onClose={() => setPendingModalOpen(false)}
        onSelectDate={(d) => onDateChange(d)}
      />
    </div>
  );
}
