'use client';

import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { useApp } from '@/lib/store';
import { Prescription, PrescriptionDrug } from '@/lib/types';
import { DRUG_DATABASE } from '@/lib/mockData';
import { formatDate, generateId } from '@/lib/utils';
import { Pill, Plus, X, Printer, Search, Trash2, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

function PrintableRx({ rx, patientName, onClose }: { rx: Prescription; patientName: string; onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-slate-900/40 z-40 no-print" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="no-print flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <p className="text-[15px] font-semibold text-slate-900">Prescription — {rx.rxNumber}</p>
            <div className="flex gap-2">
              <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 text-white text-[12px] font-medium rounded-lg hover:bg-slate-800">
                <Printer className="w-3.5 h-3.5" />Print Rx
              </button>
              <button onClick={onClose}><X className="w-5 h-5 text-slate-400 hover:text-slate-700" /></button>
            </div>
          </div>
          {/* Rx Content */}
          <div className="p-6 space-y-5">
            {/* Clinic header */}
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
              <div>
                <h2 className="text-[20px] font-bold text-slate-900">DenTrack Dental Clinic</h2>
                <p className="text-[12px] text-slate-500">123 Dental Plaza, Mumbai, MH 400001</p>
                <p className="text-[12px] text-slate-500">Ph: +91 22 4567 8901</p>
              </div>
              <div className="text-right">
                <p className="text-[12px] text-slate-500"><span className="font-medium">Doctor:</span> {rx.doctorName}</p>
                {rx.doctorReg && <p className="text-[12px] text-slate-500"><span className="font-medium">Reg No:</span> {rx.doctorReg}</p>}
                <p className="text-[12px] text-slate-500"><span className="font-medium">Date:</span> {formatDate(rx.date)}</p>
                <p className="text-[11px] font-mono text-slate-400">{rx.rxNumber}</p>
              </div>
            </div>
            {/* Patient info */}
            <div className="bg-slate-50 rounded-xl p-3 grid grid-cols-2 gap-2 text-[12px]">
              <div><span className="text-slate-500">Patient: </span><span className="font-semibold text-slate-900">{patientName}</span></div>
              {rx.diagnosis && <div><span className="text-slate-500">Dx: </span><span className="font-medium text-slate-800">{rx.diagnosis}</span></div>}
            </div>
            {/* Rx symbol */}
            <div className="flex items-center gap-3">
              <span className="text-[28px] font-bold text-slate-300 italic leading-none">℞</span>
              <div className="flex-1 border-t border-dashed border-slate-200" />
            </div>
            {/* Drugs table */}
            <div className="space-y-3">
              {rx.drugs.map((drug, i) => (
                <div key={drug.id} className="flex gap-3 py-2 border-b border-slate-100 last:border-0">
                  <span className="text-[12px] text-slate-400 w-5 shrink-0 pt-0.5">{i + 1}.</span>
                  <div className="flex-1">
                    <p className="text-[13px] font-semibold text-slate-900">{drug.name} <span className="font-normal text-slate-600">{drug.dosage} {drug.form}</span></p>
                    <p className="text-[12px] text-slate-600">Sig: {drug.frequency} × {drug.duration} · Qty: {drug.quantity}</p>
                    <p className="text-[11px] text-slate-400 italic">{drug.instructions}</p>
                  </div>
                </div>
              ))}
            </div>
            {rx.notes && <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-[12px] text-amber-800"><span className="font-medium">Notes: </span>{rx.notes}</div>}
            {/* Signature */}
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <div className="text-right">
                <div className="w-32 h-12 border-b border-slate-300 mb-1" />
                <p className="text-[11px] text-slate-500">{rx.doctorName}</p>
                <p className="text-[10px] text-slate-400">Signature & Stamp</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function NewRxModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { patients, addPrescription } = useApp();
  const [patientId, setPatientId] = useState('');
  const [doctor, setDoctor] = useState('Dr. Sneha Rao');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [drugs, setDrugs] = useState<PrescriptionDrug[]>([]);
  const [drugSearch, setDrugSearch] = useState('');
  const [showDrugDropdown, setShowDrugDropdown] = useState(false);

  const filteredDrugs = DRUG_DATABASE.filter((d) => d.name.toLowerCase().includes(drugSearch.toLowerCase()));

  const addDrug = (drug: typeof DRUG_DATABASE[0]) => {
    setDrugs([...drugs, {
      id: generateId('dr'),
      name: drug.name,
      dosage: drug.dosages[0],
      form: drug.form,
      frequency: drug.defaultFreq,
      duration: drug.defaultDuration,
      instructions: drug.instructions,
      quantity: 1,
    }]);
    setDrugSearch('');
    setShowDrugDropdown(false);
  };

  const updateDrug = (id: string, field: keyof PrescriptionDrug, value: string | number) => {
    setDrugs(drugs.map((d) => d.id === id ? { ...d, [field]: value } : d));
  };

  const handleSave = () => {
    if (!patientId || drugs.length === 0) return;
    addPrescription({ patientId, date, doctorName: doctor, diagnosis: diagnosis || undefined, drugs, notes: notes || undefined });
    onClose();
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/40 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-2"><div className="w-8 h-8 bg-violet-50 rounded-lg flex items-center justify-center"><Pill className="w-4 h-4 text-violet-600" /></div><p className="text-[15px] font-semibold text-slate-900">Write Prescription</p></div>
            <button onClick={onClose}><X className="w-5 h-5 text-slate-400 hover:text-slate-700" /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Patient *</label>
                <select value={patientId} onChange={(e) => setPatientId(e.target.value)} className="w-full text-[12px] border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-sky-100">
                  <option value="">Select...</option>
                  {patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Doctor</label>
                <select value={doctor} onChange={(e) => setDoctor(e.target.value)} className="w-full text-[12px] border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-sky-100">
                  {['Dr. Sneha Rao', 'Dr. Karan Malhotra', 'Dr. Meera Pillai'].map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full text-[12px] border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-100" />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-600 block mb-1">Diagnosis</label>
              <input type="text" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} placeholder="e.g. Post-RCT Tooth 46" className="w-full text-[12px] border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-100" />
            </div>

            {/* Drug search */}
            <div className="relative">
              <label className="text-[11px] font-medium text-slate-600 block mb-1">Add Drug</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input type="text" value={drugSearch} onChange={(e) => { setDrugSearch(e.target.value); setShowDrugDropdown(true); }}
                  onFocus={() => setShowDrugDropdown(true)}
                  placeholder="Search drug name..." className="w-full text-[12px] border border-slate-200 rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-400" />
              </div>
              {showDrugDropdown && drugSearch && (
                <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-xl max-h-44 overflow-y-auto">
                  {filteredDrugs.length === 0 ? (
                    <p className="text-[12px] text-slate-400 px-3 py-2">No drugs found</p>
                  ) : filteredDrugs.map((d) => (
                    <button key={d.name} onClick={() => addDrug(d)} className="w-full flex items-center justify-between px-3 py-2 hover:bg-slate-50 text-left">
                      <span className="text-[12px] font-medium text-slate-800">{d.name}</span>
                      <span className="text-[10px] text-slate-400">{d.dosages[0]} · {d.form}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Drug list */}
            {drugs.length > 0 && (
              <div className="space-y-2">
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Drugs ({drugs.length})</p>
                {drugs.map((drug, i) => (
                  <div key={drug.id} className="bg-slate-50 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-[12px] font-semibold text-slate-900">{i + 1}. {drug.name}</p>
                      <button onClick={() => setDrugs(drugs.filter((d) => d.id !== drug.id))} className="text-slate-300 hover:text-rose-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {[['Dosage', 'dosage'], ['Form', 'form'], ['Frequency', 'frequency'], ['Duration', 'duration']].map(([lbl, key]) => (
                        <div key={key}>
                          <label className="text-[9px] text-slate-400 uppercase font-medium">{lbl}</label>
                          <input type="text" value={drug[key as keyof PrescriptionDrug] as string}
                            onChange={(e) => updateDrug(drug.id, key as keyof PrescriptionDrug, e.target.value)}
                            className="w-full text-[11px] border border-slate-200 rounded px-2 py-1 bg-white focus:outline-none focus:border-sky-400" />
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className="text-[9px] text-slate-400 uppercase font-medium">Instructions</label>
                      <input type="text" value={drug.instructions} onChange={(e) => updateDrug(drug.id, 'instructions', e.target.value)}
                        className="w-full text-[11px] border border-slate-200 rounded px-2 py-1 bg-white focus:outline-none focus:border-sky-400" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div>
              <label className="text-[11px] font-medium text-slate-600 block mb-1">Notes / Allergies / Special Instructions</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full text-[12px] border border-slate-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-sky-100" placeholder="Special instructions, drug allergies noted..." />
            </div>
          </div>

          <div className="px-5 py-4 border-t border-slate-100 flex gap-3 shrink-0">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-slate-200 text-[13px] font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
            <button onClick={handleSave} disabled={!patientId || drugs.length === 0} className="flex-1 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-[13px] font-medium">Issue Prescription</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function PrescriptionsPage() {
  const { prescriptions, patients } = useApp();
  const [filterPatient, setFilterPatient] = useState('');
  const [newRxOpen, setNewRxOpen] = useState(false);
  const [viewRx, setViewRx] = useState<Prescription | null>(null);

  const filtered = prescriptions.filter((r) => !filterPatient || r.patientId === filterPatient).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <AppShell
      title="Prescriptions"
      subtitle={`Digital Prescription Platform · ${prescriptions.length} issued`}
      actions={
        <button onClick={() => setNewRxOpen(true)} className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-[13px] font-medium rounded-lg transition-colors">
          <Plus className="w-4 h-4" />New Prescription
        </button>
      }
    >
      <div className="space-y-4">
        <div className="flex gap-3">
          <select value={filterPatient} onChange={(e) => setFilterPatient(e.target.value)} className="text-[13px] border border-slate-200 rounded-lg px-3 py-2.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-100">
            <option value="">All Patients</option>
            {patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-sm">
          <table className="w-full text-[13px] min-w-[650px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Rx No.', 'Date', 'Patient', 'Doctor', 'Diagnosis', 'Drugs', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] text-slate-500 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="py-12 text-center text-slate-400">No prescriptions found</td></tr>
              ) : filtered.map((rx) => {
                const patient = patients.find((p) => p.id === rx.patientId);
                return (
                  <tr key={rx.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-[12px] text-sky-600 font-medium">{rx.rxNumber}</td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(rx.date)}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{patient?.name ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-600 text-[12px]">{rx.doctorName}</td>
                    <td className="px-4 py-3 text-slate-700 text-[12px] max-w-32 truncate">{rx.diagnosis ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className="badge bg-violet-50 border-violet-200 text-violet-700">{rx.drugs.length} drug{rx.drugs.length !== 1 ? 's' : ''}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setViewRx(rx)} className="flex items-center gap-1 text-[11px] text-sky-600 hover:text-sky-800 font-medium">
                        <Printer className="w-3.5 h-3.5" />View / Print
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <NewRxModal open={newRxOpen} onClose={() => setNewRxOpen(false)} />
      {viewRx && <PrintableRx rx={viewRx} patientName={patients.find((p) => p.id === viewRx.patientId)?.name ?? '—'} onClose={() => setViewRx(null)} />}
    </AppShell>
  );
}
