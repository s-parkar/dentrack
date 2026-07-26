'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import { Appointment, AppointmentStatus, Chair, ProcedureType } from '@/lib/types';
import { X, CalendarDays, User, Clock, Shield, UserCheck, AlertCircle } from 'lucide-react';
import { cn, getTodayString } from '@/lib/utils';

const PROCEDURES: ProcedureType[] = [
  'Consultation', 'Scaling & Polishing', 'Filling', 'Root Canal (RCT)',
  'Crown Placement', 'Extraction', 'Teeth Whitening', 'Orthodontic Review', 'X-Ray', 'Denture Fitting',
];

const CHAIRS: Chair[] = ['Chair A', 'Chair B', 'Chair C', 'Chair D'];
const DOCTORS = ['Dr. Sarah Jenkins', 'Dr. Sneha Rao', 'Dr. Karan Malhotra', 'Dr. Meera Pillai'];
const STATUSES: AppointmentStatus[] = ['Scheduled', 'In-Progress', 'Completed', 'Cancelled', 'No-Show'];
const DURATIONS = [15, 30, 45, 60, 90, 120];

interface AppointmentModalProps {
  open: boolean;
  onClose: () => void;
  defaultDate?: string;
  defaultChair?: Chair;
  defaultTime?: string;
  existingAppointment?: Appointment;
  onSaveSuccess?: (date: string) => void;
}

export default function AppointmentModal({
  open,
  onClose,
  defaultDate,
  defaultChair,
  defaultTime,
  existingAppointment,
  onSaveSuccess,
}: AppointmentModalProps) {
  const { patients, addAppointment, updateAppointment } = useApp();
  const { user, usersList } = useAuth();
  const isEdit = !!existingAppointment;
  const isReceptionist = user?.role === 'Receptionist';

  const availableDoctors = Array.from(
    new Set([
      ...(usersList?.filter((u) => u.role === 'Doctor').map((u) => u.name) || []),
      'Dr. Sarah Jenkins',
      'Dr. Sneha Rao',
      'Dr. Karan Malhotra',
      'Dr. Meera Pillai',
    ])
  );

  const defaultDoctor = user?.role === 'Doctor' ? user.name : (availableDoctors[0] || 'Dr. Sarah Jenkins');

  const [form, setForm] = useState({
    patientId: '',
    chair: (defaultChair ?? 'Chair A') as Chair,
    doctorName: defaultDoctor,
    procedure: 'Consultation' as ProcedureType,
    date: defaultDate ?? getTodayString(),
    startTime: defaultTime ?? '09:00',
    durationMinutes: 30,
    status: 'Scheduled' as AppointmentStatus,
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (existingAppointment) {
      setForm({
        patientId: existingAppointment.patientId,
        chair: existingAppointment.chair,
        doctorName: existingAppointment.doctorName,
        procedure: existingAppointment.procedure,
        date: existingAppointment.date,
        startTime: existingAppointment.startTime,
        durationMinutes: existingAppointment.durationMinutes,
        status: existingAppointment.status,
        notes: existingAppointment.notes,
      });
    } else if (user?.role === 'Doctor' && user?.name) {
      setForm((f) => ({ ...f, doctorName: user.name }));
    }
  }, [existingAppointment, user]);

  useEffect(() => {
    if (defaultChair) setForm((f) => ({ ...f, chair: defaultChair }));
    if (defaultDate) setForm((f) => ({ ...f, date: defaultDate }));
    if (defaultTime) setForm((f) => ({ ...f, startTime: defaultTime }));
  }, [defaultChair, defaultDate, defaultTime]);

  const isBookingForSelf = user?.role === 'Doctor' && form.doctorName === user.name;
  const requiresApproval = !isBookingForSelf;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.patientId) e.patientId = 'Select a patient';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    if (isEdit && existingAppointment) {
      updateAppointment(existingAppointment.id, form);
    } else {
      addAppointment({
        ...form,
        bookedByRole: user?.role ?? 'Doctor',
        bookedByName: user?.name ?? 'Staff',
        approvalStatus: requiresApproval ? 'Pending' : 'Approved',
      });
    }
    onSaveSuccess?.(form.date);
    onClose();
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/40 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md pointer-events-auto flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-sky-50 rounded-lg flex items-center justify-center">
                <CalendarDays className="w-4 h-4 text-sky-600" />
              </div>
              <p className="text-[15px] font-semibold text-slate-900">
                {isEdit ? 'Edit Appointment' : 'Book Appointment'}
              </p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            
            {/* Role Approval Info Banner */}
            {!isEdit && (
              <div
                className={cn(
                  'p-3.5 rounded-xl border flex items-start gap-2.5 text-xs',
                  requiresApproval
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                )}
              >
                {requiresApproval ? (
                  <>
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-amber-900">Approval Required</p>
                      <p className="text-[11px] text-amber-700 mt-0.5">
                        {isReceptionist ? (
                          <>Booked by Receptionist. Submitted as <strong>Pending Request</strong> for {form.doctorName}&apos;s approval.</>
                        ) : (
                          <>Booking for <strong>{form.doctorName}</strong>. Since you selected another doctor, a <strong>Pending Request</strong> will be sent to {form.doctorName} for approval.</>
                        )}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-emerald-900">Direct Booking (Auto-Approved)</p>
                      <p className="text-[11px] text-emerald-700 mt-0.5">
                        Booking for yourself ({user?.name}). Directly scheduled on your calendar without permission requirements.
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
            {/* Patient */}
            <div>
              <label className="block text-[12px] font-medium text-slate-700 mb-1.5">
                <User className="w-3 h-3 inline mr-1" />
                Patient <span className="text-rose-500">*</span>
              </label>
              <select
                value={form.patientId}
                onChange={(e) => setForm({ ...form, patientId: e.target.value })}
                className={cn(
                  'w-full text-[13px] border rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 transition-shadow bg-white',
                  errors.patientId
                    ? 'border-rose-300 focus:ring-rose-200'
                    : 'border-slate-200 focus:border-sky-400 focus:ring-sky-100'
                )}
              >
                <option value="">Select patient...</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Age {p.age})
                  </option>
                ))}
              </select>
              {errors.patientId && <p className="text-[11px] text-rose-500 mt-1">{errors.patientId}</p>}
            </div>

            {/* Procedure */}
            <div>
              <label className="block text-[12px] font-medium text-slate-700 mb-1.5">Procedure</label>
              <select
                value={form.procedure}
                onChange={(e) => setForm({ ...form, procedure: e.target.value as ProcedureType })}
                className="w-full text-[13px] border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-shadow bg-white"
              >
                {PROCEDURES.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>

            {/* Date + Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-medium text-slate-700 mb-1.5">Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full text-[13px] border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-shadow"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-slate-700 mb-1.5">
                  <Clock className="w-3 h-3 inline mr-1" />
                  Start Time
                </label>
                <input
                  type="time"
                  value={form.startTime}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                  className="w-full text-[13px] border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-shadow"
                />
              </div>
            </div>

            {/* Duration + Chair */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-medium text-slate-700 mb-1.5">Duration</label>
                <select
                  value={form.durationMinutes}
                  onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })}
                  className="w-full text-[13px] border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 bg-white transition-shadow"
                >
                  {DURATIONS.map((d) => (
                    <option key={d} value={d}>{d} min</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-slate-700 mb-1.5">Chair</label>
                <select
                  value={form.chair}
                  onChange={(e) => setForm({ ...form, chair: e.target.value as Chair })}
                  className="w-full text-[13px] border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 bg-white transition-shadow"
                >
                  {CHAIRS.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Doctor */}
            <div>
              <label className="block text-[12px] font-medium text-slate-700 mb-1.5">Doctor</label>
              <select
                value={form.doctorName}
                onChange={(e) => setForm({ ...form, doctorName: e.target.value })}
                className="w-full text-[13px] border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 bg-white transition-shadow"
              >
                {availableDoctors.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-[12px] font-medium text-slate-700 mb-1.5">Status</label>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setForm({ ...form, status: s })}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-[12px] border font-medium transition-all',
                      form.status === s
                        ? s === 'Scheduled' ? 'bg-sky-600 border-sky-600 text-white'
                          : s === 'In-Progress' ? 'bg-amber-500 border-amber-500 text-white'
                          : s === 'Completed' ? 'bg-green-600 border-green-600 text-white'
                          : s === 'Cancelled' ? 'bg-slate-400 border-slate-400 text-white'
                          : 'bg-rose-500 border-rose-500 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-[12px] font-medium text-slate-700 mb-1.5">Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Clinical notes..."
                rows={2}
                className="w-full text-[13px] border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 placeholder-slate-400 resize-none focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-shadow"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-slate-200 text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-[13px] font-medium transition-colors"
            >
              {isEdit ? 'Save Changes' : 'Book Appointment'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
