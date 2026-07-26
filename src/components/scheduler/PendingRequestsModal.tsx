'use client';

import { useState } from 'react';
import { useApp } from '@/lib/store';
import { formatDate, formatTime } from '@/lib/utils';
import { X, CheckCircle2, XCircle, Clock, UserCheck, CalendarDays } from 'lucide-react';

interface PendingRequestsModalProps {
  open: boolean;
  onClose: () => void;
  onSelectDate?: (date: string) => void;
}

export default function PendingRequestsModal({ open, onClose, onSelectDate }: PendingRequestsModalProps) {
  const { getPendingAppointments, patients, approveAppointment, rejectAppointment } = useApp();
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const pendingList = getPendingAppointments();

  if (!open) return null;

  const handleApprove = (id: string, date: string) => {
    approveAppointment(id);
    if (onSelectDate) onSelectDate(date);
  };

  const handleConfirmReject = (id: string) => {
    rejectAppointment(id, rejectReason || 'Declined by Doctor');
    setRejectingId(null);
    setRejectReason('');
  };

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/40 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center border border-amber-200">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-[15px] font-semibold text-slate-900">
                  Pending Appointment Requests ({pendingList.length})
                </p>
                <p className="text-[11px] text-slate-500">
                  Review bookings submitted by Reception staff for Doctor approval
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {pendingList.length === 0 ? (
              <div className="py-12 text-center bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                <div className="w-12 h-12 bg-white rounded-full border border-slate-200 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                </div>
                <p className="text-[14px] font-semibold text-slate-700">All caught up!</p>
                <p className="text-[12px] text-slate-400 mt-1">No pending appointment requests from Reception.</p>
              </div>
            ) : (
              pendingList.map((appt) => {
                const patient = patients.find((p) => p.id === appt.patientId);
                const isRejectingThis = rejectingId === appt.id;

                return (
                  <div
                    key={appt.id}
                    className="bg-white rounded-xl border border-amber-200 shadow-sm p-4 space-y-3 relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-sm">
                          {patient?.name.split(' ').map((n) => n[0]).join('').slice(0, 2) ?? 'PT'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-slate-900">{patient?.name ?? '—'}</h3>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800">
                              Pending Approval
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Procedure: <span className="font-medium text-slate-800">{appt.procedure}</span>
                          </p>
                        </div>
                      </div>

                      <div className="text-right text-xs">
                        <p className="font-semibold text-slate-900">{formatDate(appt.date)}</p>
                        <p className="text-slate-500 mt-0.5">
                          {formatTime(appt.startTime)} &bull; {appt.chair}
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-2.5 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                        <span>Submitted by: <strong>{appt.bookedByName || 'Staff'}</strong> ({appt.bookedByRole || 'Receptionist'})</span>
                      </div>
                      <div className="text-[11px] text-slate-600">
                        Requested Doctor: <strong className="text-slate-900">{appt.doctorName}</strong>
                      </div>
                    </div>

                    {isRejectingThis ? (
                      <div className="pt-2 border-t border-slate-100 space-y-2">
                        <input
                          type="text"
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="Reason for rejection (e.g., Doctor unavailable at this time)..."
                          className="w-full text-xs border border-rose-200 rounded-lg px-3 py-2 bg-rose-50/50 focus:outline-none focus:border-rose-400"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => setRejectingId(null)}
                            className="flex-1 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleConfirmReject(appt.id)}
                            className="flex-1 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium"
                          >
                            Confirm Reject
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => setRejectingId(appt.id)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-medium transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject Request
                        </button>
                        <button
                          onClick={() => handleApprove(appt.id, appt.date)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-colors shadow-sm"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Accept &amp; Schedule
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
