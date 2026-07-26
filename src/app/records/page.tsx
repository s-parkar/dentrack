'use client';

import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { useApp } from '@/lib/store';
import { ClinicalRecord } from '@/lib/types';
import { formatDate, timeAgo } from '@/lib/utils';
import { FileText, Plus, X, ChevronDown, ChevronUp, Activity, Stethoscope, Pill } from 'lucide-react';
import { cn } from '@/lib/utils';

const DOCTORS = ['Dr. Sneha Rao', 'Dr. Karan Malhotra', 'Dr. Meera Pillai'];

function RecordCard({ record, patientName }: { record: ClinicalRecord; patientName: string }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <button
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="w-9 h-9 bg-sky-50 rounded-lg flex items-center justify-center shrink-0">
          <FileText className="w-4 h-4 text-sky-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[13px] font-semibold text-slate-900 truncate">{record.chiefComplaint}</p>
            {record.icdCode && (
              <span className="badge bg-slate-100 border-slate-200 text-slate-500">{record.icdCode}</span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">{patientName} · {record.doctorName} · {formatDate(record.date)}</p>
        </div>
        <div className="flex items-center gap-2">
          {record.toothNumbers && record.toothNumbers.length > 0 && (
            <span className="badge bg-amber-50 border-amber-200 text-amber-700">
              Tooth {record.toothNumbers.join(', ')}
            </span>
          )}
          {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </button>
      {expanded && (
        <div className="px-5 pb-5 border-t border-slate-100">
          <div className="grid grid-cols-2 gap-4 mt-4">
            {record.vitals && (
              <div className="col-span-2 bg-slate-50 rounded-xl p-3 grid grid-cols-4 gap-3">
                {record.vitals.bp && <div><p className="text-[9px] text-slate-400 uppercase font-medium">BP</p><p className="text-[13px] font-semibold text-slate-800">{record.vitals.bp}</p></div>}
                {record.vitals.pulse && <div><p className="text-[9px] text-slate-400 uppercase font-medium">Pulse</p><p className="text-[13px] font-semibold text-slate-800">{record.vitals.pulse} bpm</p></div>}
                {record.vitals.spo2 && <div><p className="text-[9px] text-slate-400 uppercase font-medium">SpO₂</p><p className="text-[13px] font-semibold text-slate-800">{record.vitals.spo2}%</p></div>}
                {record.vitals.temp && <div><p className="text-[9px] text-slate-400 uppercase font-medium">Temp</p><p className="text-[13px] font-semibold text-slate-800">{record.vitals.temp}</p></div>}
              </div>
            )}
            <div className="space-y-3">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-medium tracking-wide mb-1">History of Present Illness</p>
                <p className="text-[12px] text-slate-700">{record.historyOfPresentIllness || '—'}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-medium tracking-wide mb-1">Examination Findings</p>
                <p className="text-[12px] text-slate-700">{record.examinationFindings}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-medium tracking-wide mb-1">Diagnosis</p>
                <p className="text-[12px] text-slate-800 font-medium">{record.diagnosis}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-medium tracking-wide mb-1">Treatment Done</p>
                <p className="text-[12px] text-slate-700">{record.treatmentDone}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-medium tracking-wide mb-1">Next Steps</p>
                <p className="text-[12px] text-slate-700">{record.nextSteps || '—'}</p>
              </div>
              {record.notes && (
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-medium tracking-wide mb-1">Clinical Notes</p>
                  <p className="text-[12px] text-slate-600 italic">{record.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NewRecordModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { patients, addClinicalRecord } = useApp();
  const [form, setForm] = useState({
    patientId: '', doctorName: 'Dr. Sneha Rao', doctorId: 'doc1',
    date: new Date().toISOString().split('T')[0],
    chiefComplaint: '', historyOfPresentIllness: '',
    examinationFindings: '', diagnosis: '', icdCode: '',
    treatmentDone: '', nextSteps: '', notes: '',
    bpVal: '', pulseVal: '', spo2Val: '',
    toothNumbers: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    const e: Record<string, string> = {};
    if (!form.patientId) e.patientId = 'Select patient';
    if (!form.chiefComplaint) e.chiefComplaint = 'Required';
    if (!form.examinationFindings) e.examinationFindings = 'Required';
    if (!form.diagnosis) e.diagnosis = 'Required';
    if (!form.treatmentDone) e.treatmentDone = 'Required';
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    addClinicalRecord({
      patientId: form.patientId,
      appointmentId: undefined,
      date: form.date,
      doctorId: form.doctorId,
      doctorName: form.doctorName,
      chiefComplaint: form.chiefComplaint,
      historyOfPresentIllness: form.historyOfPresentIllness || undefined,
      examinationFindings: form.examinationFindings,
      diagnosis: form.diagnosis,
      icdCode: form.icdCode || undefined,
      vitals: (form.bpVal || form.pulseVal || form.spo2Val)
        ? { bp: form.bpVal || undefined, pulse: form.pulseVal ? Number(form.pulseVal) : undefined, spo2: form.spo2Val ? Number(form.spo2Val) : undefined }
        : undefined,
      treatmentDone: form.treatmentDone,
      nextSteps: form.nextSteps || undefined,
      notes: form.notes || undefined,
      toothNumbers: form.toothNumbers ? form.toothNumbers.split(',').map((s) => Number(s.trim())).filter(Boolean) : undefined,
    });
    onClose();
  };

  if (!open) return null;

  const field = (label: string, key: keyof typeof form, placeholder = '', multiline = false) => (
    <div>
      <label className="block text-[11px] font-medium text-slate-600 mb-1">{label}</label>
      {multiline ? (
        <textarea value={form[key] as string} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          placeholder={placeholder} rows={3}
          className={cn('w-full text-[12px] border rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-400', errors[key] ? 'border-rose-300' : 'border-slate-200')} />
      ) : (
        <input type="text" value={form[key] as string} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          placeholder={placeholder}
          className={cn('w-full text-[12px] border rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-400', errors[key] ? 'border-rose-300' : 'border-slate-200')} />
      )}
      {errors[key] && <p className="text-[10px] text-rose-500 mt-0.5">{errors[key]}</p>}
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/40 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-start justify-center p-6 overflow-auto">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl mt-4" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-sky-50 rounded-lg flex items-center justify-center"><FileText className="w-4 h-4 text-sky-600" /></div>
              <p className="text-[15px] font-semibold text-slate-900">New Clinical Record (EDR)</p>
            </div>
            <button onClick={onClose}><X className="w-5 h-5 text-slate-400 hover:text-slate-700" /></button>
          </div>

          <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Patient *</label>
                <select value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value })}
                  className={cn('w-full text-[12px] border rounded-lg px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-100', errors.patientId ? 'border-rose-300' : 'border-slate-200')}>
                  <option value="">Select...</option>
                  {patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                {errors.patientId && <p className="text-[10px] text-rose-500 mt-0.5">{errors.patientId}</p>}
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Doctor</label>
                <select value={form.doctorName} onChange={(e) => setForm({ ...form, doctorName: e.target.value })}
                  className="w-full text-[12px] border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-100">
                  {DOCTORS.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Date</label>
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full text-[12px] border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-100" />
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide mb-2">Vitals (optional)</p>
              <div className="grid grid-cols-3 gap-3">
                {[['BP', 'bpVal', '120/80'], ['Pulse (bpm)', 'pulseVal', '72'], ['SpO₂ (%)', 'spo2Val', '98']].map(([lbl, key, ph]) => (
                  <div key={key}>
                    <label className="block text-[10px] text-slate-500 mb-1">{lbl}</label>
                    <input type="text" value={form[key as keyof typeof form] as string} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={ph}
                      className="w-full text-[12px] border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-400" />
                  </div>
                ))}
              </div>
            </div>

            {field('Chief Complaint *', 'chiefComplaint', 'e.g. Severe pain in lower right molar since 3 days')}
            {field('History of Present Illness', 'historyOfPresentIllness', 'Onset, duration, aggravating/relieving factors...', true)}
            {field('Examination Findings *', 'examinationFindings', 'Clinical, radiographic, and special test findings...', true)}
            <div className="grid grid-cols-2 gap-3">
              {field('Diagnosis *', 'diagnosis', 'e.g. Pulp Necrosis Tooth 46')}
              {field('ICD-10 Code', 'icdCode', 'e.g. K04.1')}
            </div>
            {field('Treatment Done *', 'treatmentDone', 'Describe the procedure performed...', true)}
            {field('Next Steps / Instructions', 'nextSteps', 'Follow-up instructions, referrals...', true)}
            {field('Tooth Numbers (comma-sep)', 'toothNumbers', 'e.g. 16, 26, 46')}
            {field('Additional Notes', 'notes', 'Clinical notes, observations...', true)}
          </div>

          <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-slate-200 text-[13px] font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
            <button onClick={handleSubmit} className="flex-1 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-[13px] font-medium">Save Record</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function RecordsPage() {
  const { clinicalRecords, patients } = useApp();
  const [search, setSearch] = useState('');
  const [filterPatient, setFilterPatient] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = clinicalRecords.filter((r) => {
    if (filterPatient && r.patientId !== filterPatient) return false;
    if (search && !r.chiefComplaint.toLowerCase().includes(search.toLowerCase()) &&
        !r.diagnosis.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <AppShell
      title="Clinical Records"
      subtitle={`Electronic Dental Records (EDR) · ${clinicalRecords.length} total entries`}
      actions={
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-[13px] font-medium rounded-lg transition-colors">
          <Plus className="w-4 h-4" />New Record
        </button>
      }
    >
      <div className="space-y-4">
        {/* Filters */}
        <div className="flex gap-3">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by complaint or diagnosis..."
            className="flex-1 text-[13px] border border-slate-200 rounded-lg px-3 py-2.5 bg-white placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100" />
          <select value={filterPatient} onChange={(e) => setFilterPatient(e.target.value)}
            className="text-[13px] border border-slate-200 rounded-lg px-3 py-2.5 bg-white text-slate-700 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100">
            <option value="">All Patients</option>
            {patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Total Records', value: clinicalRecords.length, icon: FileText, color: 'text-sky-600', bg: 'bg-sky-50' },
            { label: 'This Month', value: clinicalRecords.filter((r) => r.date >= new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]).length, icon: Activity, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Active Patients', value: new Set(clinicalRecords.map((r) => r.patientId)).size, icon: Stethoscope, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'With Prescriptions', value: clinicalRecords.filter((r) => r.appointmentId).length, icon: Pill, color: 'text-slate-600', bg: 'bg-slate-100' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <div><p className="text-[10px] text-slate-500">{s.label}</p><p className="text-[18px] font-bold text-slate-900">{s.value}</p></div>
            </div>
          ))}
        </div>

        {/* Records list */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-xl border border-slate-200 border-dashed">
              <p className="text-slate-400 text-sm">No records found</p>
            </div>
          ) : filtered.map((r) => (
            <RecordCard key={r.id} record={r} patientName={patients.find((p) => p.id === r.patientId)?.name ?? '—'} />
          ))}
        </div>
      </div>
      <NewRecordModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </AppShell>
  );
}
