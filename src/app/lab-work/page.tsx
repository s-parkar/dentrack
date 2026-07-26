'use client';

import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { useApp } from '@/lib/store';
import { LabWorkOrder, LabWorkStatus, LabWorkType, ToothShade } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { FlaskConical, Plus, X, CheckCircle, Clock, Truck, Package, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const WORK_TYPES: LabWorkType[] = [
  'Metal Crown', 'PFM Crown', 'Zirconia Crown', 'E-max Crown',
  'Metal Bridge', 'PFM Bridge', 'Zirconia Bridge',
  'Full Denture', 'Partial Denture', 'Flexible Denture',
  'Implant Crown', 'Implant Abutment',
  'Orthodontic Retainer', 'Night Guard', 'Splint', 'Inlay/Onlay', 'Veneer', 'Coping'
];
const SHADES: ToothShade[] = ['A1','A2','A3','A3.5','A4','B1','B2','B3','C1','C2','D2','BL1','BL2'];
const LABS = ['SurgiDent Ceramics Pvt Ltd', 'Perfect Smile Labs', 'DentaCraft Solutions', 'ProLab Dental', 'BioMed Dental Labs'];
const STATUSES: LabWorkStatus[] = ['Draft', 'Sent to Lab', 'In Fabrication', 'Ready', 'Received', 'Fitted', 'Remake'];
const DOCTORS = ['Dr. Sneha Rao', 'Dr. Karan Malhotra', 'Dr. Meera Pillai'];

const STATUS_CONFIG: Record<LabWorkStatus, { label: string; color: string; icon: React.FC<{className?: string}> }> = {
  'Draft':         { label: 'Draft',         color: 'bg-slate-100 border-slate-200 text-slate-600', icon: Clock },
  'Sent to Lab':   { label: 'Sent',          color: 'bg-sky-50 border-sky-200 text-sky-700', icon: Truck },
  'In Fabrication':{ label: 'Fabricating',   color: 'bg-amber-50 border-amber-200 text-amber-700', icon: FlaskConical },
  'Ready':         { label: 'Ready',         color: 'bg-green-50 border-green-200 text-green-700', icon: CheckCircle },
  'Received':      { label: 'Received',      color: 'bg-green-50 border-green-200 text-green-700', icon: Package },
  'Fitted':        { label: 'Fitted',        color: 'bg-forest-green-50 border-green-300 text-green-800', icon: CheckCircle },
  'Remake':        { label: 'Remake',        color: 'bg-rose-50 border-rose-200 text-rose-700', icon: AlertTriangle },
};

function NewLabOrderModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { patients, addLabWorkOrder } = useApp();
  const TODAY = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({
    patientId: '', labName: LABS[0], doctorName: DOCTORS[0],
    workType: 'Zirconia Crown' as LabWorkType, shade: 'A2' as ToothShade,
    material: '', toothNumbers: '', instructions: '',
    sentDate: TODAY, dueDate: '', cost: '', notes: '',
  });

  const handleSave = () => {
    if (!form.patientId || !form.toothNumbers) return;
    addLabWorkOrder({
      patientId: form.patientId, labName: form.labName, doctorName: form.doctorName,
      workType: form.workType, shade: form.shade, material: form.material || undefined,
      toothNumbers: form.toothNumbers.split(',').map((s) => Number(s.trim())).filter(Boolean),
      instructions: form.instructions, sentDate: form.sentDate || undefined,
      dueDate: form.dueDate || undefined, cost: Number(form.cost) || 0,
      notes: form.notes || undefined, status: form.sentDate ? 'Sent to Lab' : 'Draft',
    });
    onClose();
  };

  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 bg-slate-900/40 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-2"><div className="w-8 h-8 bg-cyan-50 rounded-lg flex items-center justify-center"><FlaskConical className="w-4 h-4 text-cyan-600" /></div><p className="text-[15px] font-semibold text-slate-900">New Lab Work Order</p></div>
            <button onClick={onClose}><X className="w-5 h-5 text-slate-400" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Patient *</label>
                <select value={form.patientId} onChange={(e) => setForm({...form, patientId: e.target.value})} className="w-full text-[12px] border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-sky-100">
                  <option value="">Select...</option>
                  {patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Lab Name</label>
                <select value={form.labName} onChange={(e) => setForm({...form, labName: e.target.value})} className="w-full text-[12px] border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-sky-100">
                  {LABS.map((l) => <option key={l}>{l}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Work Type</label>
                <select value={form.workType} onChange={(e) => setForm({...form, workType: e.target.value as LabWorkType})} className="w-full text-[12px] border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-sky-100">
                  {WORK_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Doctor</label>
                <select value={form.doctorName} onChange={(e) => setForm({...form, doctorName: e.target.value})} className="w-full text-[12px] border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-sky-100">
                  {DOCTORS.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Shade</label>
                <select value={form.shade} onChange={(e) => setForm({...form, shade: e.target.value as ToothShade})} className="w-full text-[12px] border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-sky-100">
                  {SHADES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Tooth No(s)</label>
                <input type="text" value={form.toothNumbers} onChange={(e) => setForm({...form, toothNumbers: e.target.value})} placeholder="e.g. 16, 26" className="w-full text-[12px] border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-100" />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Cost (₹)</label>
                <input type="number" value={form.cost} onChange={(e) => setForm({...form, cost: e.target.value})} placeholder="0" className="w-full text-[12px] border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-100" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Sent Date</label>
                <input type="date" value={form.sentDate} onChange={(e) => setForm({...form, sentDate: e.target.value})} className="w-full text-[12px] border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-100" />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Due Date</label>
                <input type="date" value={form.dueDate} onChange={(e) => setForm({...form, dueDate: e.target.value})} className="w-full text-[12px] border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-100" />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-600 block mb-1">Instructions</label>
              <textarea value={form.instructions} onChange={(e) => setForm({...form, instructions: e.target.value})} rows={3} placeholder="Shade notes, occlusal clearance, material specs..." className="w-full text-[12px] border border-slate-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-sky-100" />
            </div>
          </div>
          <div className="px-5 py-4 border-t border-slate-100 flex gap-3 shrink-0">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-slate-200 text-[13px] font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
            <button onClick={handleSave} className="flex-1 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-[13px] font-medium">Create Work Order</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function LabWorkPage() {
  const { labWorkOrders, patients, updateLabWorkOrder } = useApp();
  const [filterStatus, setFilterStatus] = useState<LabWorkStatus | ''>('');
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = labWorkOrders.filter((o) => !filterStatus || o.status === filterStatus).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const counts: Record<string, number> = {};
  labWorkOrders.forEach((o) => { counts[o.status] = (counts[o.status] || 0) + 1; });

  return (
    <AppShell
      title="Lab Work Orders"
      subtitle={`${labWorkOrders.length} total orders · ${counts['Sent to Lab'] || 0} in transit · ${counts['In Fabrication'] || 0} fabricating`}
      actions={
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-[13px] font-medium rounded-lg transition-colors">
          <Plus className="w-4 h-4" />New Work Order
        </button>
      }
    >
      <div className="space-y-4">
        {/* Status filter chips */}
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setFilterStatus('')} className={cn('px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-colors', !filterStatus ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50')}>
            All ({labWorkOrders.length})
          </button>
          {STATUSES.map((s) => {
            const cfg = STATUS_CONFIG[s];
            return (
              <button key={s} onClick={() => setFilterStatus(s === filterStatus ? '' : s)}
                className={cn('px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-colors', s === filterStatus ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50')}>
                {cfg.label} {counts[s] ? `(${counts[s]})` : ''}
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-sm">
          <table className="w-full text-[13px] min-w-[750px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['WO No.', 'Patient', 'Work Type', 'Lab', 'Teeth', 'Shade', 'Sent', 'Due', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-3 py-3 text-[11px] text-slate-500 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={10} className="py-12 text-center text-slate-400">No lab orders found</td></tr>
              ) : filtered.map((o) => {
                const cfg = STATUS_CONFIG[o.status];
                const patient = patients.find((p) => p.id === o.patientId);
                const isOverdue = o.dueDate && o.dueDate < new Date().toISOString().split('T')[0] && !['Received', 'Fitted'].includes(o.status);
                return (
                  <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-3 font-mono text-[11px] text-sky-600 font-medium">{o.workOrderNumber}</td>
                    <td className="px-3 py-3 font-medium text-slate-900">{patient?.name ?? '—'}</td>
                    <td className="px-3 py-3 text-slate-700 text-[12px]">{o.workType}</td>
                    <td className="px-3 py-3 text-slate-500 text-[11px] max-w-28 truncate">{o.labName}</td>
                    <td className="px-3 py-3 text-slate-600">#{o.toothNumbers.join(', ')}</td>
                    <td className="px-3 py-3"><span className="badge bg-amber-50 border-amber-200 text-amber-700">{o.shade ?? '—'}</span></td>
                    <td className="px-3 py-3 text-slate-500 text-[11px]">{o.sentDate ? formatDate(o.sentDate) : '—'}</td>
                    <td className={cn('px-3 py-3 text-[11px]', isOverdue ? 'text-rose-600 font-medium' : 'text-slate-500')}>
                      {o.dueDate ? formatDate(o.dueDate) : '—'}{isOverdue && ' ⚠️'}
                    </td>
                    <td className="px-3 py-3">
                      <span className={cn('badge', cfg.color)}>{cfg.label}</span>
                    </td>
                    <td className="px-3 py-3">
                      <select
                        value={o.status}
                        onChange={(e) => updateLabWorkOrder(o.id, {
                          status: e.target.value as LabWorkStatus,
                          receivedDate: e.target.value === 'Received' ? new Date().toISOString().split('T')[0] : o.receivedDate,
                          fittedDate: e.target.value === 'Fitted' ? new Date().toISOString().split('T')[0] : o.fittedDate,
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
      <NewLabOrderModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </AppShell>
  );
}
