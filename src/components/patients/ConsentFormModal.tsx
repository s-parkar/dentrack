'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import { ConsentCategory, ProcedureConsentType, SignedConsentForm } from '@/lib/types';
import SignaturePad from './SignaturePad';
import { X, FileText, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

interface ConsentFormModalProps {
  open: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
  onSignedSuccess?: (form: SignedConsentForm) => void;
}

const CONSENT_TEMPLATES: Record<ProcedureConsentType, { category: ConsentCategory; title: string; text: string }> = {
  'General Examination & Local Anesthesia': {
    category: 'Primary Consent',
    title: 'Primary General Dental & Anesthesia Consent',
    text: `I hereby authorize the attending dentist and clinical staff to perform a diagnostic dental examination, necessary dental radiographs (X-rays), and administer local anesthesia as required. I understand that local anesthesia carries minor risks such as temporary numbness, tingling, or localized soreness. I confirm that I have disclosed my complete medical history, current medications, and known allergies.`
  },
  'Root Canal Treatment (RCT)': {
    category: 'Procedure Specific Consent',
    title: 'Root Canal Treatment (RCT) Informed Consent',
    text: `I consent to Root Canal Treatment (endodontic therapy) on the affected tooth/teeth. I understand that RCT involves removing infected nerve tissue, cleaning, shaping, and sealing the root canals. Risks explained include post-treatment tenderness, instrument fracture in calcified canals, perforation, or failure requiring retreatment or apicoectomy. I understand a permanent post and crown are required following RCT to restore tooth strength.`
  },
  'Tooth Extraction & Oral Surgery': {
    category: 'Procedure Specific Consent',
    title: 'Tooth Extraction & Minor Oral Surgery Consent',
    text: `I consent to the surgical or simple extraction of the designated tooth/teeth. Possible risks explained include postoperative pain, swelling, bleeding, dry socket (alveolitis), temporary or permanent nerve numbness of lower lip/tongue, and sinus involvement for upper molars. I agree to adhere strictly to post-operative instructions.`
  },
  'Dental Implant Surgery': {
    category: 'Procedure Specific Consent',
    title: 'Dental Implant Surgery Informed Consent',
    text: `I authorize the surgical placement of titanium dental implant(s) into the jawbone. I understand that implant integration depends on bone density, systemic health, and oral hygiene. Risks include surgical swelling, implant failure (non-integration), nerve paresthesia, infection, or need for bone grafting.`
  },
  'Orthodontic Braces & Aligners': {
    category: 'Procedure Specific Consent',
    title: 'Orthodontic Braces & Clear Aligner Treatment Consent',
    text: `I consent to orthodontic treatment using fixed braces or clear aligners to align teeth and improve occlusal bite. Risks explained include mild discomfort, root resorption, decalcification if oral hygiene is inadequate, and relapse if retainers are not worn consistently post-treatment.`
  },
  'Teeth Whitening & Bleaching': {
    category: 'Procedure Specific Consent',
    title: 'In-Office Teeth Whitening & Bleaching Consent',
    text: `I consent to professional dental bleaching treatment. I understand that results vary depending on natural enamel shade. Temporary teeth sensitivity and transient gingival irritation may occur post-treatment.`
  },
  'Crown, Bridge & Veneer Fitting': {
    category: 'Procedure Specific Consent',
    title: 'Prosthodontic Crown, Bridge & Veneer Consent',
    text: `I consent to tooth preparation and fitting of fixed crowns, bridges, or porcelain veneers. I understand teeth require reduction, temporary crowns will be placed, and final shade matching is verified prior to permanent cementation.`
  },
  'Custom Treatment Consent': {
    category: 'Procedure Specific Consent',
    title: 'Custom Specialized Treatment Consent',
    text: `I hereby give my informed consent for the specialized dental treatment discussed with my attending dentist. The procedures, expected benefits, alternative treatments, and potential complications have been thoroughly explained to my full understanding.`
  }
};

export default function ConsentFormModal({
  open,
  onClose,
  patientId,
  patientName,
  onSignedSuccess,
}: ConsentFormModalProps) {
  const { addSignedConsentForm } = useApp();
  const { user } = useAuth();

  const [selectedType, setSelectedType] = useState<ProcedureConsentType>('General Examination & Local Anesthesia');
  const [customText, setCustomText] = useState(CONSENT_TEMPLATES['General Examination & Local Anesthesia'].text);
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const currentTemplate = CONSENT_TEMPLATES[selectedType];

  const handleTypeChange = (type: ProcedureConsentType) => {
    setSelectedType(type);
    setCustomText(CONSENT_TEMPLATES[type].text);
    setSignatureUrl(null);
    setError(null);
  };

  const handleSave = () => {
    if (!signatureUrl) {
      setError('Please draw and confirm the patient digital signature on screen before saving.');
      return;
    }

    const newForm = addSignedConsentForm({
      patientId,
      category: currentTemplate.category,
      formType: selectedType,
      title: currentTemplate.title,
      content: customText,
      doctorName: user?.name ?? 'Dr. Sarah Jenkins',
      signatureDataUrl: signatureUrl,
      status: 'Signed',
    });

    onSignedSuccess?.(newForm);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-sky-50 rounded-xl flex items-center justify-center border border-sky-200">
                <FileText className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Dental Consent Form & Digital Signature
                </h2>
                <p className="text-xs text-slate-500">
                  Patient: <strong className="text-slate-800">{patientName}</strong>
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Select Consent Category & Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Select Consent Form Type (Doctor Decision)
              </label>
              <select
                value={selectedType}
                onChange={(e) => handleTypeChange(e.target.value as ProcedureConsentType)}
                className="w-full text-xs sm:text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:border-sky-400 focus:bg-white transition-all"
              >
                <optgroup label="Primary Form">
                  <option value="General Examination & Local Anesthesia">Form 1: Primary General Dental & Anesthesia Consent</option>
                </optgroup>
                <optgroup label="Form 2: Procedure Specific Consents (Decided by Doctor)">
                  <option value="Root Canal Treatment (RCT)">Root Canal Treatment (RCT) Consent</option>
                  <option value="Tooth Extraction & Oral Surgery">Tooth Extraction & Minor Surgery Consent</option>
                  <option value="Dental Implant Surgery">Dental Implant Surgery Consent</option>
                  <option value="Orthodontic Braces & Aligners">Orthodontic Braces & Aligners Consent</option>
                  <option value="Teeth Whitening & Bleaching">Teeth Whitening Consent</option>
                  <option value="Crown, Bridge & Veneer Fitting">Crown, Bridge & Veneer Consent</option>
                  <option value="Custom Treatment Consent">Custom Specific Consent</option>
                </optgroup>
              </select>
            </div>

            {/* Consent Form Content Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wider bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  {currentTemplate.category}
                </span>
                <span className="text-[11px] text-slate-500">
                  Doctor: <strong>{user?.name ?? 'Dr. Sarah Jenkins'}</strong>
                </span>
              </div>

              <p className="text-sm font-bold text-slate-900">{currentTemplate.title}</p>

              <textarea
                rows={4}
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded-lg p-3 leading-relaxed focus:outline-none focus:border-sky-400"
              />
            </div>

            {/* Signature Pad */}
            <div className="pt-2 border-t border-slate-100">
              <SignaturePad
                onSave={(dataUrl) => {
                  setSignatureUrl(dataUrl);
                  setError(null);
                }}
                onClear={() => setSignatureUrl(null)}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 shrink-0">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              Save Signed Consent Form
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
