'use client';

import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import PatientDrawer from '@/components/patients/PatientDrawer';
import ConsentFormModal from '@/components/patients/ConsentFormModal';
import PrintConsentsModal from '@/components/patients/PrintConsentsModal';
import Odontogram from '@/components/odontogram/Odontogram';
import { useApp } from '@/lib/store';
import { Patient, TreatmentItemStatus } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import {
  UserPlus, Search, ChevronRight, AlertCircle, Stethoscope, Phone, X, User,
  ArrowLeft, FileText, Plus, ShieldCheck, CheckCircle2, PenTool, Printer
} from 'lucide-react';
import { cn } from '@/lib/utils';

const TAG_COLORS: Record<string, string> = {
  Diabetes: 'bg-rose-50 text-rose-700 border-rose-200',
  Hypertension: 'bg-orange-50 text-orange-700 border-orange-200',
  'Drug Allergy': 'bg-red-50 text-red-700 border-red-200',
  'Heart Disease': 'bg-rose-50 text-rose-700 border-rose-200',
  Asthma: 'bg-sky-50 text-sky-700 border-sky-200',
  'Blood Thinner': 'bg-amber-50 text-amber-700 border-amber-200',
  Pregnant: 'bg-pink-50 text-pink-700 border-pink-200',
  'Latex Allergy': 'bg-yellow-50 text-yellow-700 border-yellow-200',
};

type PatientTab = 'info' | 'odontogram' | 'edr' | 'treatment' | 'consents';

export default function PatientsPage() {
  const { patients, appointments, clinicalRecords, treatmentPlans, updatePatientTeeth, updateTreatmentPlanItem, getPatientConsentForms } = useApp();
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [consentModal, setConsentModal] = useState(false);
  const [printConsentsOpen, setPrintConsentsOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState<PatientTab>('info');

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search)
  );

  const patientAppointments = selectedPatient
    ? appointments.filter((a) => a.patientId === selectedPatient.id)
    : [];

  const patientRecords = selectedPatient
    ? clinicalRecords.filter((r) => r.patientId === selectedPatient.id)
    : [];

  const patientPlans = selectedPatient
    ? treatmentPlans.filter((tp) => tp.patientId === selectedPatient.id)
    : [];

  return (
    <AppShell
      title="Patients & EDR"
      subtitle={`${patients.length} registered patients`}
      actions={
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-[13px] font-medium rounded-lg transition-colors shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Patient</span>
          <span className="sm:hidden">Add</span>
        </button>
      }
    >
      <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-140px)]">
        
        {/* Patient Master List */}
        <div className={cn(
          "w-full lg:w-80 shrink-0 flex flex-col gap-3",
          selectedPatient && "hidden lg:flex"
        )}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patients by name or phone..."
              className="w-full text-[13px] border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-shadow bg-white"
            />
          </div>

          <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-hidden min-h-[400px]">
            {filtered.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">No patients found</div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-[calc(100vh-230px)] overflow-y-auto">
                {filtered.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { setSelectedPatient(p); setActiveTab('info'); }}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-slate-50 transition-colors',
                      selectedPatient?.id === p.id && 'bg-sky-50 border-l-2 border-sky-500'
                    )}
                  >
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                      <span className="text-[13px] font-semibold text-slate-600">
                        {p.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-[13px] font-medium text-slate-900 truncate">{p.name}</p>
                        {p.medicalTags.length > 0 && (
                          <AlertCircle className="w-3 h-3 text-rose-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {p.age}y · {p.gender}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Patient Detail Panel */}
        <div className={cn(
          "flex-1 min-w-0",
          !selectedPatient && "hidden lg:block"
        )}>
          {!selectedPatient ? (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center bg-white rounded-xl border border-slate-200 border-dashed p-6">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-3">
                <Stethoscope className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-[14px] font-medium text-slate-600">Select a patient</p>
              <p className="text-[12px] text-slate-400 mt-1">
                Click a patient from the list to view their clinical chart
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden shadow-sm">
              
              {/* Patient Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 px-4 sm:px-6 py-4 border-b border-slate-100">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => setSelectedPatient(null)}
                    className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors mt-0.5"
                    title="Back to patient list"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 font-bold text-sm">
                    {selectedPatient.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base sm:text-[17px] font-semibold text-slate-900">{selectedPatient.name}</h2>
                      {selectedPatient.medicalTags.map((tag) => (
                        <span
                          key={tag}
                          className={cn('inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded border', TAG_COLORS[tag] ?? 'bg-slate-100 text-slate-600 border-slate-200')}
                        >
                          <AlertCircle className="w-2.5 h-2.5" />
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 mt-1 flex-wrap text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {selectedPatient.age}y · {selectedPatient.gender} · {selectedPatient.bloodGroup}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" />
                        {selectedPatient.phone}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedPatient(null)}
                  className="hidden lg:block text-slate-400 hover:text-slate-700 transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-slate-100 px-4 sm:px-6 gap-1 overflow-x-auto">
                {[
                  { id: 'info', label: 'Patient Info' },
                  { id: 'odontogram', label: 'Tooth Chart' },
                  { id: 'edr', label: 'EDR Notes' },
                  { id: 'treatment', label: 'Treatment Plan' },
                  { id: 'consents', label: 'Consent Forms' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as PatientTab)}
                    className={cn(
                      'px-3 sm:px-4 py-3 text-xs sm:text-[13px] font-medium border-b-2 transition-colors shrink-0 flex items-center gap-1.5',
                      activeTab === tab.id
                        ? 'border-sky-500 text-sky-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    )}
                  >
                    {tab.id === 'consents' && <FileText className="w-3.5 h-3.5" />}
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {activeTab === 'info' && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {[
                        { label: 'Phone', value: selectedPatient.phone },
                        { label: 'Emergency Contact', value: selectedPatient.emergencyContact || '—' },
                        { label: 'Age & Gender', value: `${selectedPatient.age}y · ${selectedPatient.gender}` },
                        { label: 'Blood Group', value: selectedPatient.bloodGroup },
                        { label: 'Patient ID', value: selectedPatient.patientNumber },
                        { label: 'Address', value: selectedPatient.address || '—' },
                      ].map(({ label, value }) => (
                        <div key={label} className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                          <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">{label}</p>
                          <p className="text-[13px] font-medium text-slate-900 mt-0.5">{value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Medical Notes Text Box */}
                    {selectedPatient.medicalNotes && (
                      <div className="bg-amber-50/60 rounded-xl p-4 border border-amber-200/80 space-y-1">
                        <p className="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                          Medical Notes &amp; Clinical Details
                        </p>
                        <p className="text-xs text-amber-950 leading-relaxed font-medium">
                          {selectedPatient.medicalNotes}
                        </p>
                      </div>
                    )}

                    <div>
                      <h3 className="text-[13px] font-semibold text-slate-700 mb-2">Appointment History</h3>
                      {patientAppointments.length === 0 ? (
                        <p className="text-[12px] text-slate-400">No appointments recorded</p>
                      ) : (
                        <div className="space-y-2">
                          {patientAppointments.map((a) => (
                            <div key={a.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                              <div>
                                <p className="text-[12px] font-medium text-slate-900">{a.procedure}</p>
                                <p className="text-[11px] text-slate-500">{formatDate(a.date)} · {a.chair}</p>
                              </div>
                              <span className="inline-flex self-start sm:self-auto text-[10px] font-semibold px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
                                {a.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'odontogram' && (
                  <div className="overflow-x-auto">
                    <Odontogram
                      teeth={selectedPatient.teeth}
                      onUpdate={(teeth) => {
                        updatePatientTeeth(selectedPatient.id, teeth);
                        setSelectedPatient({ ...selectedPatient, teeth });
                      }}
                    />
                  </div>
                )}

                {activeTab === 'edr' && (
                  <div className="space-y-4">
                    {patientRecords.length === 0 ? (
                      <p className="text-[12px] text-slate-400">No clinical notes recorded for this patient.</p>
                    ) : (
                      patientRecords.map((r) => (
                        <div key={r.id} className="bg-slate-50 rounded-xl p-4 space-y-2 border border-slate-100">
                          <div className="flex justify-between items-center">
                            <p className="text-[13px] font-semibold text-slate-900">{r.chiefComplaint}</p>
                            <span className="text-[11px] text-slate-400">{formatDate(r.date)}</span>
                          </div>
                          <p className="text-[12px] text-slate-700"><span className="font-medium">Diagnosis:</span> {r.diagnosis}</p>
                          <p className="text-[12px] text-slate-600"><span className="font-medium">Treatment Done:</span> {r.treatmentDone}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'treatment' && (
                  <div className="space-y-4">
                    {patientPlans.length === 0 ? (
                      <p className="text-[12px] text-slate-400">No active treatment plans for this patient.</p>
                    ) : (
                      patientPlans.map((plan) => (
                        <div key={plan.id} className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-100">
                          <div className="flex justify-between items-center">
                            <p className="text-[14px] font-semibold text-slate-900">{plan.title}</p>
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
                              ₹{plan.totalEstimate.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div className="space-y-2">
                            {plan.items.map((item) => (
                              <div key={item.id} className="bg-white rounded-lg p-3 border border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                                <div>
                                  <p className="text-[12px] font-medium text-slate-900">{item.procedure} {item.toothNumbers.length ? `(Tooth ${item.toothNumbers.join(',')})` : ''}</p>
                                  <p className="text-[11px] text-slate-500">Cost: ₹{item.estimatedCost.toLocaleString('en-IN')}</p>
                                </div>
                                <select
                                  value={item.status}
                                  onChange={(e) => updateTreatmentPlanItem(plan.id, item.id, { status: e.target.value as TreatmentItemStatus })}
                                  className="text-[11px] border border-slate-200 rounded px-2 py-1 bg-white self-start sm:self-auto"
                                >
                                  {(['Planned', 'In Progress', 'Completed', 'Declined'] as const).map((s) => (
                                    <option key={s}>{s}</option>
                                  ))}
                                </select>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
                {activeTab === 'consents' && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          Signed Digital Consent Forms ({getPatientConsentForms(selectedPatient.id).length})
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Primary consents and procedure-specific consents signed on-screen by patient.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        {getPatientConsentForms(selectedPatient.id).length > 0 && (
                          <button
                            onClick={() => setPrintConsentsOpen(true)}
                            className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg transition-colors shadow-xs shrink-0"
                          >
                            <Printer className="w-4 h-4 text-slate-600" />
                            <span>Print All Consents</span>
                          </button>
                        )}

                        <button
                          onClick={() => setConsentModal(true)}
                          className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm shrink-0"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Sign New Consent</span>
                        </button>
                      </div>
                    </div>

                    {getPatientConsentForms(selectedPatient.id).length === 0 ? (
                      <div className="py-12 text-center bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                        <PenTool className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-xs font-semibold text-slate-700">No Signed Consents Record</p>
                        <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
                          Click &quot;Sign New Consent&quot; above to capture a Primary Consent or Procedure-Specific Consent with digital patient signature.
                        </p>
                      </div>
                    ) : (
                      getPatientConsentForms(selectedPatient.id).map((form) => (
                        <div
                          key={form.id}
                          className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className={cn(
                                    'text-[10px] font-bold px-2 py-0.5 rounded border',
                                    form.category === 'Primary Consent'
                                      ? 'bg-sky-50 border-sky-200 text-sky-700'
                                      : 'bg-purple-50 border-purple-200 text-purple-700'
                                  )}
                                >
                                  {form.category}
                                </span>
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Digitally Signed
                                </span>
                              </div>
                              <h4 className="text-sm font-semibold text-slate-900 mt-1">{form.title}</h4>
                            </div>

                            <div className="text-left sm:text-right text-[11px] text-slate-500">
                              <p>Signed: <strong>{formatDate(form.signedAt)}</strong></p>
                              <p>Attending: <strong>{form.doctorName}</strong></p>
                            </div>
                          </div>

                          <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600 leading-relaxed font-mono">
                            {form.content}
                          </div>

                          {/* Digital Signature Image Display */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-medium text-slate-500">Patient Digital Signature:</span>
                              <div className="bg-white border border-slate-200 rounded-lg px-3 py-1 shadow-xs inline-block">
                                {/* eslint-disable-next-html-link */}
                                <img
                                  src={form.signatureDataUrl}
                                  alt="Patient Digital Signature"
                                  className="h-9 object-contain max-w-[200px]"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>

      <PatientDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onPatientCreated={(p) => setSelectedPatient(p)}
      />

      {selectedPatient && (
        <>
          <ConsentFormModal
            open={consentModal}
            onClose={() => setConsentModal(false)}
            patientId={selectedPatient.id}
            patientName={selectedPatient.name}
          />
          <PrintConsentsModal
            open={printConsentsOpen}
            onClose={() => setPrintConsentsOpen(false)}
            patient={selectedPatient}
            consentForms={getPatientConsentForms(selectedPatient.id)}
          />
        </>
      )}
    </AppShell>
  );
}
