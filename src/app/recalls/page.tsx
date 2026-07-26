'use client';

import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { useApp } from '@/lib/store';
import { Recall, RecallStatus, RecallType } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Bell, Plus, Phone, Calendar, CheckCircle, X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const RECALL_TYPES: RecallType[] = ['Routine Check-up', 'Post-Treatment', 'Scaling Recall', 'Implant Review', 'Ortho Review', 'Custom'];
const STATUSES: RecallStatus[] = ['Pending', 'Contacted', 'Scheduled', 'Completed', 'Declined', 'Lost'];

function NewRecallModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { patients, addRecall } = useApp();
  const [patientId, setPatientId] = useState('');
  const [type, setType] = useState<RecallType>('Routine Check-up');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (!patientId || !dueDate) return;
    addRecall({ patientId, type, dueDate, status: 'Pending', notes: notes || undefined });
    onClose();
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/40 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-5 space-y-4" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-sky-50 rounded-lg flex items-center justify-center">
                <Bell className="w-4 h-4 text-sky-600" />
              </div>
              <p className="text-[15px] font-semibold text-slate-900">Schedule Patient Recall</p>
            </div>
            <button onClick={onClose}><X className="w-5 h-5 text-slate-400" /></button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-medium text-slate-600 block mb-1">Patient *</label>
              <select value={patientId} onChange={(e) => setPatientId(e.target.value)} className="w-full text-[12px] border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-sky-100">
                <option value="">Select...</option>
                {patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-600 block mb-1">Recall Type</label>
              <select value={type} onChange={(e) => setType(e.target.value as RecallType)} className="w-full text-[12px] border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-sky-100">
                {RECALL_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-600 block mb-1">Due Date *</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full text-[12px] border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-100" />
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-600 block mb-1">Notes</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Reason for follow-up..." className="w-full text-[12px] border border-slate-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-sky-100" />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-slate-200 text-[12px] font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
            <button onClick={handleSave} className="flex-1 py-2.5 rounded-lg bg-sky-600 text-white text-[12px] font-medium hover:bg-sky-700">Save Recall</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function RecallsPage() {
  const { recalls, patients, updateRecall } = useApp();
  const [statusFilter, setStatusFilter] = useState<RecallStatus | ''>('');
  const [modalOpen, setModalOpen] = useState(false);

  const TODAY = new Date().toISOString().split('T')[0];

  const filtered = recalls.filter((r) => !statusFilter || r.status === statusFilter).sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const dueCount = recalls.filter((r) => r.status === 'Pending' && r.dueDate <= TODAY).length;

  return (
    <AppShell
      title="Proactive Recalls & Follow-ups"
      subtitle={`Automated Patient Recall Engine · ${recalls.length} Total · ${dueCount} Due / Overdue`}
      actions={
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-[13px] font-medium rounded-lg transition-colors">
          <Plus className="w-4 h-4" />Schedule Recall
        </button>
      }
    >
      <div className="space-y-4">
        {/* Status filter chips */}
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setStatusFilter('')} className={cn('px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-colors', !statusFilter ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50')}>
            All Recalls ({recalls.length})
          </button>
          {STATUSES.map((s) => (
            <button key={s} onClick={() => setStatusFilter(s === statusFilter ? '' : s)} className={cn('px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-colors', s === statusFilter ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50')}>
              {s} ({recalls.filter((r) => r.status === s).length})
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-sm">
          <table className="w-full text-[13px] min-w-[700px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Patient', 'Phone', 'Recall Type', 'Due Date', 'Notes', 'Status', 'Update Status'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] text-slate-500 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="py-12 text-center text-slate-400">No recalls found</td></tr>
              ) : filtered.map((r) => {
                const patient = patients.find((p) => p.id === r.patientId);
                const isOverdue = r.status === 'Pending' && r.dueDate <= TODAY;
                return (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900">{patient?.name ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-600 flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-slate-400" /> {patient?.phone ?? '—'}
                    </td>
                    <td className="px-4 py-3"><span className="badge bg-sky-50 border-sky-200 text-sky-700">{r.type}</span></td>
                    <td className={cn('px-4 py-3 text-[12px]', isOverdue ? 'text-rose-600 font-bold' : 'text-slate-600')}>
                      {formatDate(r.dueDate)}{isOverdue && ' ⚠️ Overdue'}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-[12px] max-w-48 truncate">{r.notes || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={cn('badge', r.status === 'Completed' ? 'bg-green-50 border-green-200 text-green-700' : r.status === 'Contacted' ? 'bg-sky-50 border-sky-200 text-sky-700' : isOverdue ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-slate-100 border-slate-200 text-slate-700')}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={r.status}
                        onChange={(e) => updateRecall(r.id, {
                          status: e.target.value as RecallStatus,
                          contactedAt: e.target.value === 'Contacted' ? new Date().toISOString() : r.contactedAt,
                        })}
                        className="text-[11px] border border-slate-200 rounded-lg px-2 py-1 bg-white focus:outline-none"
                      >
                        {STATUSES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <NewRecallModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </AppShell>
  );
}
