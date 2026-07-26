'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  Patient, Appointment, Invoice, ActivityItem, ClinicalRecord,
  TreatmentPlan, TreatmentPlanItem, Prescription, LabWorkOrder,
  InventoryItem, StockMovement, ImplantRecord, OrthoCase,
  Recall, ToothState, TreatmentPackage, PatientDocument,
} from './types';
import {
  MOCK_PATIENTS, MOCK_APPOINTMENTS, MOCK_INVOICES, MOCK_ACTIVITY,
  MOCK_CLINICAL_RECORDS, MOCK_TREATMENT_PLANS, MOCK_PRESCRIPTIONS,
  MOCK_LAB_WORK_ORDERS, MOCK_INVENTORY, MOCK_IMPLANTS, MOCK_ORTHO_CASES,
  MOCK_RECALLS, MOCK_PACKAGES,
} from './mockData';
import { generateId } from './utils';

interface AppState {
  patients: Patient[];
  appointments: Appointment[];
  invoices: Invoice[];
  activity: ActivityItem[];
  clinicalRecords: ClinicalRecord[];
  treatmentPlans: TreatmentPlan[];
  prescriptions: Prescription[];
  labWorkOrders: LabWorkOrder[];
  inventory: InventoryItem[];
  stockMovements: StockMovement[];
  implants: ImplantRecord[];
  orthoCases: OrthoCase[];
  recalls: Recall[];
  packages: TreatmentPackage[];
  documents: PatientDocument[];
}

interface AppContextValue extends AppState {
  // Patients
  addPatient: (p: Omit<Patient, 'id' | 'createdAt' | 'teeth' | 'patientNumber'>) => Patient;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  updatePatientTeeth: (patientId: string, teeth: ToothState[]) => void;
  getPatient: (id: string) => Patient | undefined;
  deletePatient: (id: string) => void;

  // Appointments
  addAppointment: (a: Omit<Appointment, 'id'>) => Appointment;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  getAppointmentsForDate: (date: string) => Appointment[];
  getPatientAppointments: (patientId: string) => Appointment[];

  // Invoices
  addInvoice: (inv: Omit<Invoice, 'id' | 'invoiceNumber'>) => Invoice;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  getInvoice: (id: string) => Invoice | undefined;
  getPatientInvoices: (patientId: string) => Invoice[];

  // Clinical Records
  addClinicalRecord: (r: Omit<ClinicalRecord, 'id' | 'createdAt'>) => ClinicalRecord;
  updateClinicalRecord: (id: string, updates: Partial<ClinicalRecord>) => void;
  getPatientRecords: (patientId: string) => ClinicalRecord[];

  // Treatment Plans
  addTreatmentPlan: (p: Omit<TreatmentPlan, 'id' | 'createdAt'>) => TreatmentPlan;
  updateTreatmentPlan: (id: string, updates: Partial<TreatmentPlan>) => void;
  updateTreatmentPlanItem: (planId: string, itemId: string, updates: Partial<TreatmentPlanItem>) => void;
  getPatientTreatmentPlans: (patientId: string) => TreatmentPlan[];

  // Prescriptions
  addPrescription: (p: Omit<Prescription, 'id' | 'rxNumber' | 'createdAt'>) => Prescription;
  getPatientPrescriptions: (patientId: string) => Prescription[];

  // Lab Work Orders
  addLabWorkOrder: (o: Omit<LabWorkOrder, 'id' | 'workOrderNumber' | 'createdAt'>) => LabWorkOrder;
  updateLabWorkOrder: (id: string, updates: Partial<LabWorkOrder>) => void;
  getPatientLabOrders: (patientId: string) => LabWorkOrder[];

  // Inventory
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'createdAt'>) => InventoryItem;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void;
  addStockMovement: (mv: Omit<StockMovement, 'id'>) => void;
  getLowStockItems: () => InventoryItem[];

  // Implants
  addImplant: (imp: Omit<ImplantRecord, 'id' | 'createdAt'>) => ImplantRecord;
  updateImplant: (id: string, updates: Partial<ImplantRecord>) => void;
  getPatientImplants: (patientId: string) => ImplantRecord[];

  // Ortho
  addOrthoCase: (c: Omit<OrthoCase, 'id' | 'createdAt' | 'caseNumber'>) => OrthoCase;
  updateOrthoCase: (id: string, updates: Partial<OrthoCase>) => void;
  getPatientOrthoCase: (patientId: string) => OrthoCase | undefined;

  // Recalls
  addRecall: (r: Omit<Recall, 'id' | 'createdAt'>) => Recall;
  updateRecall: (id: string, updates: Partial<Recall>) => void;
  getDueRecalls: () => Recall[];

  // Documents
  addDocument: (doc: Omit<PatientDocument, 'id' | 'uploadedAt'>) => PatientDocument;
  getPatientDocuments: (patientId: string) => PatientDocument[];

  // Activity
  addActivity: (item: Omit<ActivityItem, 'id' | 'timestamp'>) => void;
}

const AppContext = createContext<AppContextValue | null>(null);
const STORAGE_KEY = 'dentrack_state_v2';

const INITIAL_STATE: AppState = {
  patients: MOCK_PATIENTS,
  appointments: MOCK_APPOINTMENTS,
  invoices: MOCK_INVOICES,
  activity: MOCK_ACTIVITY,
  clinicalRecords: MOCK_CLINICAL_RECORDS,
  treatmentPlans: MOCK_TREATMENT_PLANS,
  prescriptions: MOCK_PRESCRIPTIONS,
  labWorkOrders: MOCK_LAB_WORK_ORDERS,
  inventory: MOCK_INVENTORY,
  stockMovements: [],
  implants: MOCK_IMPLANTS,
  orthoCases: MOCK_ORTHO_CASES,
  recalls: MOCK_RECALLS,
  packages: MOCK_PACKAGES,
  documents: [],
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState(JSON.parse(raw) as AppState);
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
  }, [state, hydrated]);

  const addActivity = useCallback((item: Omit<ActivityItem, 'id' | 'timestamp'>) => {
    setState((s) => ({
      ...s,
      activity: [{ ...item, id: generateId('act'), timestamp: new Date().toISOString() }, ...s.activity].slice(0, 100),
    }));
  }, []);

  // ── Patients ──────────────────────────────────────────────────────────────
  const addPatient = useCallback((p: Omit<Patient, 'id' | 'createdAt' | 'teeth' | 'patientNumber'>): Patient => {
    const ids = [18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28,31,32,33,34,35,36,37,38,41,42,43,44,45,46,47,48];
    let pNum = 'P-0001';
    setState((s) => {
      const num = s.patients.length + 1;
      pNum = `P-${num.toString().padStart(4, '0')}`;
      const newPatient: Patient = { ...p, id: generateId('p'), patientNumber: pNum, createdAt: new Date().toISOString(), teeth: ids.map((id) => ({ id, condition: 'healthy', notes: '' })) };
      addActivity({ type: 'patient_added', message: `New patient ${p.name} registered (${pNum})` });
      return { ...s, patients: [...s.patients, newPatient] };
    });
    const newP: Patient = { ...p, id: '', patientNumber: pNum, createdAt: new Date().toISOString(), teeth: [] };
    return newP;
  }, [addActivity]);

  const updatePatient = useCallback((id: string, updates: Partial<Patient>) => {
    setState((s) => ({ ...s, patients: s.patients.map((p) => p.id === id ? { ...p, ...updates } : p) }));
  }, []);

  const updatePatientTeeth = useCallback((patientId: string, teeth: ToothState[]) => {
    setState((s) => ({ ...s, patients: s.patients.map((p) => p.id === patientId ? { ...p, teeth } : p) }));
  }, []);

  const getPatient = useCallback((id: string) => state.patients.find((p) => p.id === id), [state.patients]);
  const deletePatient = useCallback((id: string) => setState((s) => ({ ...s, patients: s.patients.filter((p) => p.id !== id) })), []);

  // ── Appointments ──────────────────────────────────────────────────────────
  const addAppointment = useCallback((a: Omit<Appointment, 'id'>): Appointment => {
    const newAppt: Appointment = { ...a, id: generateId('a') };
    setState((s) => ({ ...s, appointments: [...s.appointments, newAppt] }));
    const patient = state.patients.find((p) => p.id === a.patientId);
    addActivity({ type: 'appointment_scheduled', message: `Appointment booked: ${patient?.name ?? '—'} — ${a.procedure}` });
    return newAppt;
  }, [state.patients, addActivity]);

  const updateAppointment = useCallback((id: string, updates: Partial<Appointment>) => {
    setState((s) => ({ ...s, appointments: s.appointments.map((a) => a.id === id ? { ...a, ...updates } : a) }));
    if (updates.status === 'Completed') {
      const appt = state.appointments.find((a) => a.id === id);
      const patient = state.patients.find((p) => p.id === appt?.patientId);
      if (appt && patient) addActivity({ type: 'appointment_completed', message: `${appt.procedure} completed for ${patient.name}` });
    }
  }, [state.appointments, state.patients, addActivity]);

  const deleteAppointment = useCallback((id: string) => setState((s) => ({ ...s, appointments: s.appointments.filter((a) => a.id !== id) })), []);
  const getAppointmentsForDate = useCallback((date: string) => state.appointments.filter((a) => a.date === date), [state.appointments]);
  const getPatientAppointments = useCallback((patientId: string) => state.appointments.filter((a) => a.patientId === patientId), [state.appointments]);

  // ── Invoices ──────────────────────────────────────────────────────────────
  const addInvoice = useCallback((inv: Omit<Invoice, 'id' | 'invoiceNumber'>): Invoice => {
    const num = state.invoices.length + 1;
    const invoiceNumber = `INV-${new Date().getFullYear()}-${num.toString().padStart(3, '0')}`;
    const newInv: Invoice = { ...inv, id: generateId('inv'), invoiceNumber };
    setState((s) => ({
      ...s,
      invoices: [...s.invoices, newInv],
      appointments: s.appointments.map((a) => a.id === inv.appointmentId ? { ...a, invoiceId: newInv.id, status: 'Completed' } : a),
    }));
    const patient = state.patients.find((p) => p.id === inv.patientId);
    addActivity({ type: 'invoice_created', message: `Invoice ${invoiceNumber} · ₹${inv.total.toFixed(2)} for ${patient?.name ?? '—'}` });
    return newInv;
  }, [state.invoices, state.patients, addActivity]);

  const updateInvoice = useCallback((id: string, updates: Partial<Invoice>) => setState((s) => ({ ...s, invoices: s.invoices.map((i) => i.id === id ? { ...i, ...updates } : i) })), []);
  const getInvoice = useCallback((id: string) => state.invoices.find((i) => i.id === id), [state.invoices]);
  const getPatientInvoices = useCallback((patientId: string) => state.invoices.filter((i) => i.patientId === patientId), [state.invoices]);

  // ── Clinical Records ──────────────────────────────────────────────────────
  const addClinicalRecord = useCallback((r: Omit<ClinicalRecord, 'id' | 'createdAt'>): ClinicalRecord => {
    const rec: ClinicalRecord = { ...r, id: generateId('cr'), createdAt: new Date().toISOString() };
    setState((s) => ({ ...s, clinicalRecords: [...s.clinicalRecords, rec] }));
    const patient = state.patients.find((p) => p.id === r.patientId);
    addActivity({ type: 'record_added', message: `EDR added for ${patient?.name ?? '—'} — ${r.diagnosis}` });
    return rec;
  }, [state.patients, addActivity]);

  const updateClinicalRecord = useCallback((id: string, updates: Partial<ClinicalRecord>) => setState((s) => ({ ...s, clinicalRecords: s.clinicalRecords.map((r) => r.id === id ? { ...r, ...updates } : r) })), []);
  const getPatientRecords = useCallback((patientId: string) => state.clinicalRecords.filter((r) => r.patientId === patientId).sort((a, b) => b.date.localeCompare(a.date)), [state.clinicalRecords]);

  // ── Treatment Plans ───────────────────────────────────────────────────────
  const addTreatmentPlan = useCallback((p: Omit<TreatmentPlan, 'id' | 'createdAt'>): TreatmentPlan => {
    const plan: TreatmentPlan = { ...p, id: generateId('tp'), createdAt: new Date().toISOString() };
    setState((s) => ({ ...s, treatmentPlans: [...s.treatmentPlans, plan] }));
    return plan;
  }, []);

  const updateTreatmentPlan = useCallback((id: string, updates: Partial<TreatmentPlan>) => setState((s) => ({ ...s, treatmentPlans: s.treatmentPlans.map((p) => p.id === id ? { ...p, ...updates } : p) })), []);

  const updateTreatmentPlanItem = useCallback((planId: string, itemId: string, updates: Partial<TreatmentPlanItem>) => {
    setState((s) => ({
      ...s,
      treatmentPlans: s.treatmentPlans.map((p) =>
        p.id === planId ? { ...p, items: p.items.map((i) => i.id === itemId ? { ...i, ...updates } : i) } : p
      ),
    }));
  }, []);

  const getPatientTreatmentPlans = useCallback((patientId: string) => state.treatmentPlans.filter((p) => p.patientId === patientId), [state.treatmentPlans]);

  // ── Prescriptions ─────────────────────────────────────────────────────────
  const addPrescription = useCallback((p: Omit<Prescription, 'id' | 'rxNumber' | 'createdAt'>): Prescription => {
    const num = state.prescriptions.length + 1;
    const rxNumber = `RX-${new Date().getFullYear()}-${num.toString().padStart(3, '0')}`;
    const rx: Prescription = { ...p, id: generateId('rx'), rxNumber, createdAt: new Date().toISOString() };
    setState((s) => ({ ...s, prescriptions: [...s.prescriptions, rx] }));
    const patient = state.patients.find((pt) => pt.id === p.patientId);
    addActivity({ type: 'prescription_issued', message: `Prescription ${rxNumber} issued to ${patient?.name ?? '—'} (${p.drugs.length} drugs)` });
    return rx;
  }, [state.prescriptions, state.patients, addActivity]);

  const getPatientPrescriptions = useCallback((patientId: string) => state.prescriptions.filter((p) => p.patientId === patientId).sort((a, b) => b.date.localeCompare(a.date)), [state.prescriptions]);

  // ── Lab Work Orders ───────────────────────────────────────────────────────
  const addLabWorkOrder = useCallback((o: Omit<LabWorkOrder, 'id' | 'workOrderNumber' | 'createdAt'>): LabWorkOrder => {
    const num = state.labWorkOrders.length + 1;
    const workOrderNumber = `WO-${new Date().getFullYear()}-${num.toString().padStart(3, '0')}`;
    const order: LabWorkOrder = { ...o, id: generateId('lw'), workOrderNumber, createdAt: new Date().toISOString() };
    setState((s) => ({ ...s, labWorkOrders: [...s.labWorkOrders, order] }));
    addActivity({ type: 'lab_order_sent', message: `Lab order ${workOrderNumber} sent to ${o.labName} — ${o.workType}` });
    return order;
  }, [state.labWorkOrders, addActivity]);

  const updateLabWorkOrder = useCallback((id: string, updates: Partial<LabWorkOrder>) => {
    setState((s) => ({ ...s, labWorkOrders: s.labWorkOrders.map((o) => o.id === id ? { ...o, ...updates } : o) }));
    if (updates.status === 'Received') addActivity({ type: 'lab_order_received', message: `Lab order received — ${updates.workType ?? ''}` });
  }, [addActivity]);

  const getPatientLabOrders = useCallback((patientId: string) => state.labWorkOrders.filter((o) => o.patientId === patientId), [state.labWorkOrders]);

  // ── Inventory ─────────────────────────────────────────────────────────────
  const addInventoryItem = useCallback((item: Omit<InventoryItem, 'id' | 'createdAt'>): InventoryItem => {
    const newItem: InventoryItem = { ...item, id: generateId('inv_item'), createdAt: new Date().toISOString() };
    setState((s) => ({ ...s, inventory: [...s.inventory, newItem] }));
    return newItem;
  }, []);

  const updateInventoryItem = useCallback((id: string, updates: Partial<InventoryItem>) => setState((s) => ({ ...s, inventory: s.inventory.map((i) => i.id === id ? { ...i, ...updates } : i) })), []);

  const addStockMovement = useCallback((mv: Omit<StockMovement, 'id'>) => {
    const movement: StockMovement = { ...mv, id: generateId('sm') };
    setState((s) => ({
      ...s,
      stockMovements: [...s.stockMovements, movement],
      inventory: s.inventory.map((item) => {
        if (item.id !== mv.itemId) return item;
        const delta = mv.type === 'IN' ? mv.quantity : mv.type === 'OUT' ? -mv.quantity : mv.quantity;
        return { ...item, quantityOnHand: Math.max(0, item.quantityOnHand + delta) };
      }),
    }));
  }, []);

  const getLowStockItems = useCallback(() => state.inventory.filter((i) => i.quantityOnHand <= i.minStockLevel), [state.inventory]);

  // ── Implants ──────────────────────────────────────────────────────────────
  const addImplant = useCallback((imp: Omit<ImplantRecord, 'id' | 'createdAt'>): ImplantRecord => {
    const newImp: ImplantRecord = { ...imp, id: generateId('imp'), createdAt: new Date().toISOString() };
    setState((s) => ({ ...s, implants: [...s.implants, newImp] }));
    return newImp;
  }, []);

  const updateImplant = useCallback((id: string, updates: Partial<ImplantRecord>) => setState((s) => ({ ...s, implants: s.implants.map((i) => i.id === id ? { ...i, ...updates } : i) })), []);
  const getPatientImplants = useCallback((patientId: string) => state.implants.filter((i) => i.patientId === patientId), [state.implants]);

  // ── Ortho ─────────────────────────────────────────────────────────────────
  const addOrthoCase = useCallback((c: Omit<OrthoCase, 'id' | 'createdAt' | 'caseNumber'>): OrthoCase => {
    const num = state.orthoCases.length + 1;
    const newCase: OrthoCase = { ...c, id: generateId('oc'), caseNumber: `OC-${new Date().getFullYear()}-${num.toString().padStart(3, '0')}`, createdAt: new Date().toISOString() };
    setState((s) => ({ ...s, orthoCases: [...s.orthoCases, newCase] }));
    return newCase;
  }, [state.orthoCases]);

  const updateOrthoCase = useCallback((id: string, updates: Partial<OrthoCase>) => setState((s) => ({ ...s, orthoCases: s.orthoCases.map((c) => c.id === id ? { ...c, ...updates } : c) })), []);
  const getPatientOrthoCase = useCallback((patientId: string) => state.orthoCases.find((c) => c.patientId === patientId), [state.orthoCases]);

  // ── Recalls ───────────────────────────────────────────────────────────────
  const addRecall = useCallback((r: Omit<Recall, 'id' | 'createdAt'>): Recall => {
    const newRecall: Recall = { ...r, id: generateId('rc'), createdAt: new Date().toISOString() };
    setState((s) => ({ ...s, recalls: [...s.recalls, newRecall] }));
    return newRecall;
  }, []);

  const updateRecall = useCallback((id: string, updates: Partial<Recall>) => setState((s) => ({ ...s, recalls: s.recalls.map((r) => r.id === id ? { ...r, ...updates } : r) })), []);
  const getDueRecalls = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return state.recalls.filter((r) => r.status === 'Pending' && r.dueDate <= today);
  }, [state.recalls]);

  // ── Documents ─────────────────────────────────────────────────────────────
  const addDocument = useCallback((doc: Omit<PatientDocument, 'id' | 'uploadedAt'>): PatientDocument => {
    const newDoc: PatientDocument = { ...doc, id: generateId('doc'), uploadedAt: new Date().toISOString() };
    setState((s) => ({ ...s, documents: [...s.documents, newDoc] }));
    return newDoc;
  }, []);

  const getPatientDocuments = useCallback((patientId: string) => state.documents.filter((d) => d.patientId === patientId), [state.documents]);

  const value: AppContextValue = {
    ...state,
    addPatient, updatePatient, updatePatientTeeth, getPatient, deletePatient,
    addAppointment, updateAppointment, deleteAppointment, getAppointmentsForDate, getPatientAppointments,
    addInvoice, updateInvoice, getInvoice, getPatientInvoices,
    addClinicalRecord, updateClinicalRecord, getPatientRecords,
    addTreatmentPlan, updateTreatmentPlan, updateTreatmentPlanItem, getPatientTreatmentPlans,
    addPrescription, getPatientPrescriptions,
    addLabWorkOrder, updateLabWorkOrder, getPatientLabOrders,
    addInventoryItem, updateInventoryItem, addStockMovement, getLowStockItems,
    addImplant, updateImplant, getPatientImplants,
    addOrthoCase, updateOrthoCase, getPatientOrthoCase,
    addRecall, updateRecall, getDueRecalls,
    addDocument, getPatientDocuments,
    addActivity,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
