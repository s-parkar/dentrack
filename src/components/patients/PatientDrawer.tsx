'use client';

import { useState } from 'react';
import { useApp } from '@/lib/store';
import { Patient, Gender, MedicalTag } from '@/lib/types';
import { X, User, Phone, Tag, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const MEDICAL_TAGS: MedicalTag[] = [
  'Diabetes',
  'Hypertension',
  'Drug Allergy',
  'Heart Disease',
  'Asthma',
  'Blood Thinner',
  'Pregnant',
  'Latex Allergy',
];

interface PatientDrawerProps {
  open: boolean;
  onClose: () => void;
  onPatientCreated?: (p: Patient) => void;
}

const EMPTY_FORM = {
  name: '',
  age: '',
  gender: 'Male' as Gender,
  phone: '',
  emergencyContact: '',
  medicalTags: [] as MedicalTag[],
  medicalNotes: '',
};

export default function PatientDrawer({ open, onClose, onPatientCreated }: PatientDrawerProps) {
  const { addPatient } = useApp();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.age || Number(form.age) < 1 || Number(form.age) > 120) e.age = 'Enter valid age';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setSaving(true);
    const p = addPatient({
      name: form.name.trim(),
      age: Number(form.age),
      gender: form.gender,
      phone: form.phone.trim(),
      emergencyContact: form.emergencyContact.trim(),
      bloodGroup: 'Unknown',
      medicalTags: form.medicalTags,
      medicalNotes: form.medicalNotes.trim(),
    });
    setSaving(false);
    setForm(EMPTY_FORM);
    setErrors({});
    onPatientCreated?.(p);
    onClose();
  };

  const toggleTag = (tag: MedicalTag) => {
    setForm((f) => ({
      ...f,
      medicalTags: f.medicalTags.includes(tag)
        ? f.medicalTags.filter((t) => t !== tag)
        : [...f.medicalTags, tag],
    }));
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-[480px] bg-white z-50 shadow-2xl flex flex-col border-l border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-sky-50 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-sky-600" />
            </div>
            <div>
              <p className="text-[15px] font-semibold text-slate-900">New Patient</p>
              <p className="text-[11px] text-slate-500">Patient Intake Form</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-[12px] font-medium text-slate-700 mb-1.5">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Arjun Mehta"
              className={cn(
                'w-full text-[13px] border rounded-lg px-3 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-shadow',
                errors.name
                  ? 'border-rose-300 focus:ring-rose-200'
                  : 'border-slate-200 focus:border-sky-400 focus:ring-sky-100'
              )}
            />
            {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
          </div>

          {/* Age + Gender */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-medium text-slate-700 mb-1.5">
                Age <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                placeholder="e.g. 35"
                min={1}
                max={120}
                className={cn(
                  'w-full text-[13px] border rounded-lg px-3 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-shadow',
                  errors.age
                    ? 'border-rose-300 focus:ring-rose-200'
                    : 'border-slate-200 focus:border-sky-400 focus:ring-sky-100'
                )}
              />
              {errors.age && <p className="text-[11px] text-rose-500 mt-1">{errors.age}</p>}
            </div>
            <div>
              <label className="block text-[12px] font-medium text-slate-700 mb-1.5">Gender</label>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value as Gender })}
                className="w-full text-[13px] border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-shadow bg-white"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-[12px] font-medium text-slate-700 mb-1.5">
              <Phone className="w-3 h-3 inline mr-1" />
              Phone <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+91 98XXX XXXXX"
              className={cn(
                'w-full text-[13px] border rounded-lg px-3 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-shadow',
                errors.phone
                  ? 'border-rose-300 focus:ring-rose-200'
                  : 'border-slate-200 focus:border-sky-400 focus:ring-sky-100'
              )}
            />
            {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
          </div>

          {/* Emergency Contact */}
          <div>
            <label className="block text-[12px] font-medium text-slate-700 mb-1.5">
              Emergency Contact
            </label>
            <input
              type="tel"
              value={form.emergencyContact}
              onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })}
              placeholder="+91 98XXX XXXXX"
              className="w-full text-[13px] border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-shadow"
            />
          </div>

          {/* Medical Tags */}
          <div>
            <label className="block text-[12px] font-medium text-slate-700 mb-2">
              <Tag className="w-3 h-3 inline mr-1" />
              Medical Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {MEDICAL_TAGS.map((tag) => {
                const selected = form.medicalTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] border font-medium transition-all',
                      selected
                        ? 'bg-rose-50 border-rose-300 text-rose-700'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                    )}
                  >
                    {selected && <AlertCircle className="w-3 h-3" />}
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Medical Notes / Additional Details */}
          <div>
            <label className="block text-[12px] font-medium text-slate-700 mb-1.5">
              Medical Notes / Additional Details
            </label>
            <textarea
              rows={3}
              value={form.medicalNotes}
              onChange={(e) => setForm({ ...form, medicalNotes: e.target.value })}
              placeholder="e.g. History of penicillin allergy, previous RCT on Tooth #16, high anxiety during local anesthesia..."
              className="w-full text-[13px] border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-shadow resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-slate-200 text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-[13px] font-medium transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Register Patient'}
          </button>
        </div>
      </div>
    </>
  );
}
