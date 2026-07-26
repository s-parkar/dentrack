'use client';

import React from 'react';
import { Patient, SignedConsentForm } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Printer, X, ShieldCheck, CheckCircle2, Stethoscope } from 'lucide-react';

interface PrintConsentsModalProps {
  open: boolean;
  onClose: () => void;
  patient: Patient;
  consentForms: SignedConsentForm[];
}

export default function PrintConsentsModal({
  open,
  onClose,
  patient,
  consentForms,
}: PrintConsentsModalProps) {
  if (!open) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Background Overlay - hidden during print */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 print:hidden" onClick={onClose} />

      {/* Main Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 print:p-0 print:static print:z-auto print:block">
        <div
          className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col print:max-h-none print:h-auto print:w-full print:shadow-none print:border-none print:rounded-none"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Toolbar - Hidden when printing */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0 print:hidden bg-slate-50 rounded-t-2xl">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-sky-50 rounded-xl flex items-center justify-center border border-sky-200">
                <Printer className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Consolidated Patient Consent Record
                </h2>
                <p className="text-xs text-slate-500">
                  Ready to print all {consentForms.length} consent form{consentForms.length !== 1 ? 's' : ''} for <strong>{patient.name}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
              >
                <Printer className="w-4 h-4" />
                Print All Consents
              </button>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Printable Document Body */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 print:overflow-visible print:p-0">
            
            {/* Header Document Banner */}
            <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">DENTRACK DENTAL CLINIC</h1>
                  <p className="text-xs text-slate-600 font-medium">Consolidated Patient Legal Consent &amp; Signature Record</p>
                </div>
              </div>

              <div className="text-left sm:text-right text-xs text-slate-600">
                <p className="font-semibold text-slate-900">Print Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                <p className="text-[11px] text-slate-500">Document Reference: REF-CSNT-{patient.patientNumber}</p>
              </div>
            </div>

            {/* Patient Meta Information Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs print:bg-slate-100/50 print:border-slate-300">
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wide font-medium">Patient Name</p>
                <p className="font-bold text-slate-900 mt-0.5">{patient.name}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wide font-medium">Patient ID</p>
                <p className="font-semibold text-slate-800 mt-0.5">{patient.patientNumber}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wide font-medium">Age / Gender</p>
                <p className="font-semibold text-slate-800 mt-0.5">{patient.age}y &bull; {patient.gender}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wide font-medium">Phone</p>
                <p className="font-semibold text-slate-800 mt-0.5">{patient.phone}</p>
              </div>
            </div>

            {/* Consent Forms Loop */}
            <div className="space-y-6">
              {consentForms.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs italic">
                  No signed consent forms recorded for this patient.
                </div>
              ) : (
                consentForms.map((form, index) => (
                  <div
                    key={form.id}
                    className="border border-slate-300 rounded-xl p-5 space-y-3 bg-white break-inside-avoid print:shadow-none print:border-slate-400"
                  >
                    {/* Form Title & Badge */}
                    <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-white uppercase tracking-wider">
                            Form #{index + 1}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-300">
                            {form.category}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Signed &amp; Verified
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mt-1.5">{form.title}</h3>
                      </div>

                      <div className="text-right text-[11px] text-slate-600 shrink-0">
                        <p>Date Signed: <strong>{formatDate(form.signedAt)}</strong></p>
                        <p>Attending Doctor: <strong>{form.doctorName}</strong></p>
                      </div>
                    </div>

                    {/* Legal Content Clause */}
                    <div className="text-xs text-slate-800 leading-relaxed font-sans bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                      {form.content}
                    </div>

                    {/* Signature Verification Block */}
                    <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <p className="text-[11px] font-semibold text-slate-700">Patient Digital On-Screen Signature:</p>
                        <div className="mt-1 bg-white border border-slate-300 rounded-lg p-2 inline-block">
                          {/* eslint-disable-next-html-link */}
                          <img
                            src={form.signatureDataUrl}
                            alt="Patient Signature"
                            className="h-12 object-contain max-w-[220px]"
                          />
                        </div>
                        <p className="text-[9px] text-slate-400 mt-0.5">Digitally signed &amp; verified on {formatDate(form.signedAt)}</p>
                      </div>

                      <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 w-full sm:w-auto">
                        <div className="w-44 border-b border-slate-400 mb-1 ml-auto" />
                        <p className="text-[11px] font-semibold text-slate-800">{form.doctorName}</p>
                        <p className="text-[10px] text-slate-500">Attending Dental Surgeon</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Document Footer Notice */}
            <div className="pt-4 border-t border-slate-200 text-center text-[10px] text-slate-500">
              <p>DenTrack Practice Management System &bull; Confidential Patient Medical &amp; Legal Consent Record</p>
            </div>

          </div>

          {/* Footer - Hidden when printing */}
          <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0 print:hidden rounded-b-2xl">
            <span className="text-xs text-slate-500">
              Tip: Uses standard browser print dialog (`window.print()`).
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-100"
              >
                Close Window
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                <Printer className="w-4 h-4" />
                Print All Consents
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
