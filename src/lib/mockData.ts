import {
  Patient, Appointment, Invoice, ActivityItem, ClinicalRecord,
  TreatmentPlan, TreatmentPlanItem, Prescription, PrescriptionDrug,
  LabWorkOrder, InventoryItem, ImplantRecord, OrthoCase, OrthoVisit,
  Recall, StockMovement, TreatmentPackage, PatientDocument, ToothState
} from './types';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function makeTeeth(): ToothState[] {
  const ids = [18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28,31,32,33,34,35,36,37,38,41,42,43,44,45,46,47,48];
  return ids.map((id) => ({ id, condition: 'healthy', notes: '' }));
}
function teethWith(overrides: { id: number; condition: ToothState['condition']; notes?: string }[]): ToothState[] {
  const teeth = makeTeeth();
  overrides.forEach(({ id, condition, notes }) => {
    const t = teeth.find((t) => t.id === id);
    if (t) { t.condition = condition; t.notes = notes ?? ''; }
  });
  return teeth;
}

const TODAY = new Date().toISOString().split('T')[0];
const yesterday = (d: number) => { const dt = new Date(); dt.setDate(dt.getDate() - d); return dt.toISOString().split('T')[0]; };
const future = (d: number) => { const dt = new Date(); dt.setDate(dt.getDate() + d); return dt.toISOString().split('T')[0]; };

// ─── Patients ─────────────────────────────────────────────────────────────────
export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'p001', patientNumber: 'P-0001', name: 'Arjun Mehta', age: 38, dob: '1986-04-12',
    gender: 'Male', phone: '+91 98201 34567', email: 'arjun.mehta@email.com',
    address: '14, Bandra West, Mumbai - 400050',
    emergencyContact: '+91 98201 99999', emergencyRelation: 'Wife',
    bloodGroup: 'B+', medicalTags: ['Hypertension', 'Blood Thinner'],
    teeth: teethWith([
      { id: 16, condition: 'crown', notes: 'PFM Crown 2023' },
      { id: 46, condition: 'rct', notes: 'RCT completed Q1 2024' },
      { id: 26, condition: 'cavity', notes: 'Class II — needs filling' },
      { id: 36, condition: 'implant', notes: 'Straumann 4.1×10mm — crown delivered' },
    ]),
    referredBy: 'Dr. Sharma (General Physician)',
    createdAt: '2024-01-15T09:00:00Z', lastVisit: TODAY,
  },
  {
    id: 'p002', patientNumber: 'P-0002', name: 'Priya Nair', age: 27, dob: '1997-09-03',
    gender: 'Female', phone: '+91 97200 12345', email: 'priya.nair@email.com',
    address: '7, Koramangala, Bangalore - 560034',
    emergencyContact: '+91 97200 54321', emergencyRelation: 'Mother',
    bloodGroup: 'A+', medicalTags: ['Drug Allergy'],
    teeth: teethWith([
      { id: 18, condition: 'missing', notes: 'Extracted — impaction' },
      { id: 28, condition: 'missing', notes: 'Extracted — impaction' },
      { id: 36, condition: 'rct', notes: 'RCT + build-up' },
      { id: 37, condition: 'cavity', notes: 'Early caries — monitor' },
    ]),
    createdAt: '2024-03-22T10:30:00Z', lastVisit: yesterday(1),
  },
  {
    id: 'p003', patientNumber: 'P-0003', name: 'Ramesh Iyer', age: 55, dob: '1969-11-20',
    gender: 'Male', phone: '+91 94400 78901', email: 'ramesh.iyer@email.com',
    address: '22, Anna Nagar, Chennai - 600040',
    emergencyContact: '+91 94400 11111', emergencyRelation: 'Son',
    bloodGroup: 'O+', medicalTags: ['Diabetes', 'Hypertension'],
    teeth: teethWith([
      { id: 14, condition: 'cavity', notes: 'Occlusal caries' },
      { id: 24, condition: 'cavity', notes: 'Occlusal caries' },
      { id: 34, condition: 'crown', notes: 'Metal crown 2021' },
      { id: 44, condition: 'crown', notes: 'Metal crown 2021' },
      { id: 48, condition: 'missing', notes: 'Previously extracted' },
      { id: 38, condition: 'missing', notes: 'Previously extracted' },
      { id: 11, condition: 'bridge', notes: 'Maryland bridge' },
    ]),
    createdAt: '2023-11-05T11:00:00Z', lastVisit: yesterday(3),
  },
  {
    id: 'p004', patientNumber: 'P-0004', name: 'Sanya Kapoor', age: 22, dob: '2002-06-15',
    gender: 'Female', phone: '+91 91234 56789', email: 'sanya.kapoor@email.com',
    address: '5, Connaught Place, New Delhi - 110001',
    emergencyContact: '+91 91234 99999', emergencyRelation: 'Father',
    bloodGroup: 'AB+', medicalTags: [],
    teeth: makeTeeth(),
    createdAt: '2025-06-01T08:00:00Z', lastVisit: TODAY,
  },
  {
    id: 'p005', patientNumber: 'P-0005', name: 'Mohammed Rafi', age: 44, dob: '1980-02-28',
    gender: 'Male', phone: '+91 90000 11223', email: 'rafi.md@email.com',
    address: '11, Jubilee Hills, Hyderabad - 500033',
    emergencyContact: '+91 90000 33221', emergencyRelation: 'Brother',
    bloodGroup: 'B-', medicalTags: ['Smoker'],
    teeth: teethWith([
      { id: 17, condition: 'missing', notes: 'Considering implant' },
      { id: 46, condition: 'fracture', notes: 'Vertical root fracture — extraction planned' },
      { id: 35, condition: 'rct', notes: 'RCT 2022, awaiting crown' },
    ]),
    createdAt: '2025-01-10T14:00:00Z', lastVisit: yesterday(7),
  },
];

// ─── Appointments ─────────────────────────────────────────────────────────────
export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: 'a001', patientId: 'p001', chair: 'Chair A', doctorName: 'Dr. Sneha Rao', procedure: 'Root Canal (RCT)', date: TODAY, startTime: '09:00', durationMinutes: 90, status: 'Completed', notes: 'Tooth 46 — final obturation', invoiceId: 'inv001' },
  { id: 'a002', patientId: 'p002', chair: 'Chair B', doctorName: 'Dr. Karan Malhotra', procedure: 'Scaling & Polishing', date: TODAY, startTime: '10:00', durationMinutes: 60, status: 'In-Progress', notes: 'Full mouth scaling' },
  { id: 'a003', patientId: 'p003', chair: 'Chair A', doctorName: 'Dr. Sneha Rao', procedure: 'Filling', date: TODAY, startTime: '11:30', durationMinutes: 45, status: 'Scheduled', notes: 'Composite filling — tooth 14' },
  { id: 'a004', patientId: 'p004', chair: 'Chair C', doctorName: 'Dr. Meera Pillai', procedure: 'Consultation', date: TODAY, startTime: '12:00', durationMinutes: 30, status: 'Scheduled', notes: 'New patient — routine check' },
  { id: 'a005', patientId: 'p002', chair: 'Chair B', doctorName: 'Dr. Karan Malhotra', procedure: 'X-Ray', date: TODAY, startTime: '14:00', durationMinutes: 30, status: 'Scheduled', notes: 'Periapical X-ray tooth 36' },
  { id: 'a006', patientId: 'p005', chair: 'Chair A', doctorName: 'Dr. Sneha Rao', procedure: 'Extraction', date: TODAY, startTime: '15:00', durationMinutes: 60, status: 'Scheduled', notes: 'Extraction tooth 46 — VRF' },
  { id: 'a007', patientId: 'p001', chair: 'Chair C', doctorName: 'Dr. Meera Pillai', procedure: 'Crown Placement', date: yesterday(2), startTime: '10:00', durationMinutes: 60, status: 'Completed', notes: 'PFM crown cementation tooth 16', invoiceId: 'inv002' },
  { id: 'a008', patientId: 'p003', chair: 'Chair B', doctorName: 'Dr. Karan Malhotra', procedure: 'Scaling & Polishing', date: yesterday(5), startTime: '09:00', durationMinutes: 60, status: 'Completed', notes: 'Full mouth scaling', invoiceId: 'inv003' },
];

// ─── Invoices ─────────────────────────────────────────────────────────────────
export const MOCK_INVOICES: Invoice[] = [
  {
    id: 'inv001', invoiceNumber: 'INV-2024-001', appointmentId: 'a001', patientId: 'p001',
    items: [
      { id: 'i1', description: 'Root Canal Treatment — Tooth 46', quantity: 1, unitPrice: 7500 },
      { id: 'i2', description: 'Periapical X-Ray (2 views)', quantity: 2, unitPrice: 250 },
      { id: 'i3', description: 'Rubber Dam Isolation', quantity: 1, unitPrice: 200 },
    ],
    discountPercent: 10, taxPercent: 18, paymentMethod: 'UPI',
    createdAt: new Date().toISOString(), subtotal: 8200, discountAmount: 820, taxAmount: 1324.8, total: 8704.8, paid: true,
  },
  {
    id: 'inv002', invoiceNumber: 'INV-2024-002', appointmentId: 'a007', patientId: 'p001',
    items: [
      { id: 'i4', description: 'PFM Crown — Tooth 16', quantity: 1, unitPrice: 8000 },
      { id: 'i5', description: 'Temporary Crown', quantity: 1, unitPrice: 500 },
    ],
    discountPercent: 0, taxPercent: 18, paymentMethod: 'Card',
    createdAt: new Date(Date.now() - 2*24*60*60*1000).toISOString(), subtotal: 8500, discountAmount: 0, taxAmount: 1530, total: 10030, paid: true,
  },
  {
    id: 'inv003', invoiceNumber: 'INV-2024-003', appointmentId: 'a008', patientId: 'p003',
    items: [{ id: 'i6', description: 'Full Mouth Scaling & Polishing', quantity: 1, unitPrice: 1500 }],
    discountPercent: 0, taxPercent: 18, paymentMethod: 'Cash',
    createdAt: new Date(Date.now() - 5*24*60*60*1000).toISOString(), subtotal: 1500, discountAmount: 0, taxAmount: 270, total: 1770, paid: true,
  },
];

// ─── Clinical Records (EDR) ───────────────────────────────────────────────────
export const MOCK_CLINICAL_RECORDS: ClinicalRecord[] = [
  {
    id: 'cr001', patientId: 'p001', appointmentId: 'a001', date: TODAY,
    doctorId: 'doc1', doctorName: 'Dr. Sneha Rao',
    chiefComplaint: 'Severe pain in lower right back tooth since 3 days',
    historyOfPresentIllness: 'Patient reports continuous throbbing pain, aggravated by hot foods. No swelling. Previously had temporary filling 2 weeks ago.',
    examinationFindings: 'Tooth 46: Tenderness on percussion (+), Negative EPT, No periapical pathology on IOPA. Probing depth normal.',
    diagnosis: 'Pulp Necrosis — Tooth 46 (K04.1)',
    icdCode: 'K04.1',
    vitals: { bp: '138/88', pulse: 82, spo2: 98 },
    treatmentDone: 'Root canal treatment completed — 3 canals (MB, DB, P) obturation with gutta-percha and AH Plus sealer. IOPA post-op taken.',
    nextSteps: 'Crown placement in 2-3 weeks. Avoid chewing on right side.',
    notes: 'Patient on blood thinners — LA given carefully. No significant bleeding.',
    toothNumbers: [46],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cr002', patientId: 'p002', date: yesterday(30),
    doctorId: 'doc2', doctorName: 'Dr. Karan Malhotra',
    chiefComplaint: 'Sensitivity to cold, bleeding gums',
    examinationFindings: 'Generalized supra and subgingival calculus deposits. Bleeding on probing. No mobility. Tooth 37 shows small occlusal cavity.',
    diagnosis: 'Chronic Gingivitis with Supragingival Calculus (K05.1)',
    icdCode: 'K05.1',
    vitals: { pulse: 74, spo2: 99 },
    treatmentDone: 'Full mouth ultrasonic scaling done. OHI given. Chlorhexidine mouthwash prescribed.',
    nextSteps: 'Review in 3 weeks. Filling for tooth 37 planned.',
    toothNumbers: [37],
    createdAt: new Date(Date.now() - 30*24*60*60*1000).toISOString(),
  },
  {
    id: 'cr003', patientId: 'p003', date: yesterday(5),
    doctorId: 'doc2', doctorName: 'Dr. Karan Malhotra',
    chiefComplaint: 'Routine cleaning, check-up',
    examinationFindings: 'Moderate calculus deposits. Tooth 14 and 24: visible occlusal caries (Class I). No pain. Existing metal crowns 34, 44 intact.',
    diagnosis: 'Dental caries — Teeth 14, 24 (K02.1)',
    icdCode: 'K02.1',
    vitals: { bp: '148/92', pulse: 78 },
    treatmentDone: 'Scaling done. OPG taken. Treatment plan discussed.',
    nextSteps: 'Composite fillings for 14, 24. Blood sugar pre-treatment to be checked.',
    toothNumbers: [14, 24],
    createdAt: new Date(Date.now() - 5*24*60*60*1000).toISOString(),
  },
];

// ─── Treatment Plans ──────────────────────────────────────────────────────────
export const MOCK_TREATMENT_PLANS: TreatmentPlan[] = [
  {
    id: 'tp001', patientId: 'p001', title: 'Comprehensive Restorative Plan',
    createdAt: yesterday(10), doctorName: 'Dr. Sneha Rao',
    items: [
      { id: 'tpi1', procedure: 'Root Canal (RCT)', toothNumbers: [46], priority: 'Urgent', estimatedCost: 7500, status: 'Completed', notes: 'Done', completedAt: TODAY },
      { id: 'tpi2', procedure: 'Crown Placement', toothNumbers: [46], priority: 'Recommended', estimatedCost: 8000, status: 'Planned', notes: 'After RCT healing — 2-3 weeks' },
      { id: 'tpi3', procedure: 'Filling', toothNumbers: [26], priority: 'Recommended', estimatedCost: 1200, status: 'Planned', notes: 'Composite filling Class II' },
    ],
    totalEstimate: 16700, notes: 'Patient on blood thinners — pre-op coordination with cardiologist required.', status: 'Active',
  },
  {
    id: 'tp002', patientId: 'p003', title: 'Caries Management & Maintenance',
    createdAt: yesterday(5), doctorName: 'Dr. Karan Malhotra',
    items: [
      { id: 'tpi4', procedure: 'Filling', toothNumbers: [14], priority: 'Urgent', estimatedCost: 1200, status: 'In Progress', notes: 'Occlusal caries' },
      { id: 'tpi5', procedure: 'Filling', toothNumbers: [24], priority: 'Urgent', estimatedCost: 1200, status: 'Planned', notes: 'Occlusal caries' },
      { id: 'tpi6', procedure: 'Scaling & Polishing', toothNumbers: [], priority: 'Recommended', estimatedCost: 1500, status: 'Completed', notes: 'Done', completedAt: yesterday(5) },
    ],
    totalEstimate: 3900, notes: 'Diabetic patient — check HbA1c before major procedures.', status: 'Active',
  },
];

// ─── Prescriptions ────────────────────────────────────────────────────────────
export const MOCK_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx001', rxNumber: 'RX-2024-001', patientId: 'p001', appointmentId: 'a001',
    doctorName: 'Dr. Sneha Rao', doctorReg: 'MCI-98234',
    date: TODAY, diagnosis: 'Post-RCT Tooth 46',
    drugs: [
      { id: 'dr1', name: 'Amoxicillin + Clavulanic Acid', dosage: '625mg', form: 'Tablet', frequency: 'BD (2x daily)', duration: '5 days', instructions: 'After food', quantity: 10 },
      { id: 'dr2', name: 'Ibuprofen + Paracetamol', dosage: '400/325mg', form: 'Tablet', frequency: 'TDS (3x daily)', duration: '3 days', instructions: 'After food, for pain', quantity: 9 },
      { id: 'dr3', name: 'Chlorhexidine Mouthwash 0.2%', dosage: '10ml', form: 'Mouthwash', frequency: 'BD (2x daily)', duration: '7 days', instructions: 'Rinse for 30 sec, do not swallow', quantity: 1 },
    ],
    notes: 'Patient allergic to Penicillin noted — Amoxiclav chosen as per sensitivity. Monitor for GI disturbance.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'rx002', rxNumber: 'RX-2024-002', patientId: 'p002', appointmentId: 'a002',
    doctorName: 'Dr. Karan Malhotra', doctorReg: 'MCI-71234',
    date: yesterday(1), diagnosis: 'Post-Scaling Gingivitis',
    drugs: [
      { id: 'dr4', name: 'Chlorhexidine Mouthwash 0.2%', dosage: '10ml', form: 'Mouthwash', frequency: 'BD (2x daily)', duration: '14 days', instructions: 'Rinse after brushing', quantity: 1 },
      { id: 'dr5', name: 'Metronidazole', dosage: '400mg', form: 'Tablet', frequency: 'TDS (3x daily)', duration: '5 days', instructions: 'After food', quantity: 15 },
    ],
    notes: 'Drug allergy documented — Penicillin group avoided.',
    createdAt: new Date(Date.now() - 24*60*60*1000).toISOString(),
  },
];

// ─── Lab Work Orders ──────────────────────────────────────────────────────────
export const MOCK_LAB_WORK_ORDERS: LabWorkOrder[] = [
  {
    id: 'lw001', workOrderNumber: 'WO-2024-001', patientId: 'p001', appointmentId: 'a007',
    labName: 'SurgiDent Ceramics Pvt Ltd', doctorName: 'Dr. Sneha Rao',
    workType: 'PFM Crown', toothNumbers: [16], shade: 'A2', material: 'Porcelain-Fused-Metal',
    instructions: 'High strength PFM crown for tooth 16. Occlusal clearance 1.5mm. Full anatomic contour.',
    sentDate: yesterday(10), dueDate: yesterday(3), receivedDate: yesterday(2), fittedDate: yesterday(2),
    status: 'Fitted', cost: 2500, createdAt: new Date(Date.now() - 10*24*60*60*1000).toISOString(),
    notes: 'Crown delivered on time, shade matched.',
  },
  {
    id: 'lw002', workOrderNumber: 'WO-2024-002', patientId: 'p001',
    labName: 'SurgiDent Ceramics Pvt Ltd', doctorName: 'Dr. Sneha Rao',
    workType: 'Zirconia Crown', toothNumbers: [46], shade: 'A3',
    instructions: 'Full contour zirconia crown post-RCT. Ensure 1mm occlusal clearance. High-gloss polish.',
    sentDate: TODAY, dueDate: future(7),
    status: 'Sent to Lab', cost: 3500, createdAt: new Date().toISOString(),
  },
  {
    id: 'lw003', workOrderNumber: 'WO-2024-003', patientId: 'p005',
    labName: 'Perfect Smile Labs', doctorName: 'Dr. Meera Pillai',
    workType: 'Partial Denture', toothNumbers: [17, 46], shade: 'A2',
    instructions: 'Chrome-cobalt partial denture. Tooth 17 and 46 missing. Ensure proper occlusion on opposing teeth.',
    sentDate: yesterday(5), dueDate: future(5),
    status: 'In Fabrication', cost: 8000, createdAt: new Date(Date.now() - 5*24*60*60*1000).toISOString(),
  },
];

// ─── Inventory ────────────────────────────────────────────────────────────────
export const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'inv_01', name: 'Lignocaine 2% with Adrenaline', brand: 'Lignocaine HCl', category: 'Anesthetics', unit: 'Cartridge', quantityOnHand: 45, minStockLevel: 20, reorderLevel: 30, unitCost: 25, expiryDate: '2025-12-31', location: 'Shelf A1', createdAt: '2024-01-01T00:00:00Z', lastRestocked: yesterday(15) },
  { id: 'inv_02', name: 'Composite Resin A2 (Herculite)', brand: 'Kerr', category: 'Restorative', unit: 'Tube', quantityOnHand: 4, minStockLevel: 5, reorderLevel: 8, unitCost: 850, expiryDate: '2025-06-30', location: 'Shelf B2', createdAt: '2024-01-01T00:00:00Z', lastRestocked: yesterday(45) },
  { id: 'inv_03', name: 'Gutta Percha Points (ISO 25)', brand: 'Dentsply', category: 'Endodontic', unit: 'Box', quantityOnHand: 12, minStockLevel: 5, reorderLevel: 8, unitCost: 180, expiryDate: '2026-03-31', location: 'Shelf C1', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'inv_04', name: 'Nitrile Gloves M', brand: 'ShieldSafe', category: 'PPE', unit: 'Box', quantityOnHand: 8, minStockLevel: 10, reorderLevel: 15, unitCost: 350, expiryDate: '2026-12-31', location: 'Shelf D1', createdAt: '2024-01-01T00:00:00Z', lastRestocked: yesterday(20) },
  { id: 'inv_05', name: 'Surgical Masks 3-ply', brand: 'CareSafe', category: 'PPE', unit: 'Box', quantityOnHand: 15, minStockLevel: 10, reorderLevel: 20, unitCost: 250, location: 'Shelf D2', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'inv_06', name: 'Alginate Impression Material', brand: 'Cavex', category: 'Impression Materials', unit: 'Bag', quantityOnHand: 3, minStockLevel: 5, reorderLevel: 7, unitCost: 650, expiryDate: '2025-09-30', location: 'Shelf B3', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'inv_07', name: 'Glass Ionomer Cement (GIC)', brand: 'GC Fuji II', category: 'Cements', unit: 'Set', quantityOnHand: 6, minStockLevel: 3, reorderLevel: 5, unitCost: 1200, expiryDate: '2025-08-31', location: 'Shelf B4', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'inv_08', name: 'Endodontic Files NiTi (ProTaper)', brand: 'Dentsply Sirona', category: 'Endodontic', unit: 'Pack', quantityOnHand: 9, minStockLevel: 5, reorderLevel: 8, unitCost: 1800, location: 'Shelf C2', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'inv_09', name: 'Bite Wings X-Ray Films', brand: 'Kodak', category: 'Instruments', unit: 'Pack', quantityOnHand: 2, minStockLevel: 5, reorderLevel: 8, unitCost: 450, expiryDate: '2025-11-30', location: 'Shelf E1', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'inv_10', name: 'Hydrogen Peroxide 3%', brand: 'Rexol', category: 'Sterilization', unit: 'Bottle', quantityOnHand: 7, minStockLevel: 4, reorderLevel: 6, unitCost: 120, location: 'Shelf F1', createdAt: '2024-01-01T00:00:00Z' },
];

// ─── Implants ─────────────────────────────────────────────────────────────────
export const MOCK_IMPLANTS: ImplantRecord[] = [
  {
    id: 'imp001', patientId: 'p001', toothNumber: 36,
    brand: 'Straumann', system: 'Bone Level Tapered',
    diameter: 4.1, length: 10, torque: 35,
    surgeonName: 'Dr. Meera Pillai',
    placementDate: '2023-09-15', healingPeriodWeeks: 16,
    abutmentType: 'Titanium Straight', abutmentDate: '2024-01-10',
    crownType: 'Zirconia', crownDeliveryDate: '2024-01-25',
    status: 'Crown Delivered',
    notes: 'Excellent osseointegration. ISQ 78 at placement, 85 at loading.',
    createdAt: '2023-09-15T00:00:00Z',
  },
  {
    id: 'imp002', patientId: 'p005', toothNumber: 17,
    brand: 'Nobel Biocare', system: 'NobelActive',
    diameter: 3.5, length: 11.5,
    surgeonName: 'Dr. Meera Pillai',
    placementDate: future(14), healingPeriodWeeks: 16,
    status: 'Planned',
    notes: 'CBCT done. Adequate bone width 8mm. No sinus involvement.',
    createdAt: new Date().toISOString(),
  },
];

// ─── Ortho Cases ──────────────────────────────────────────────────────────────
export const MOCK_ORTHO_CASES: OrthoCase[] = [
  {
    id: 'oc001', patientId: 'p004', caseNumber: 'OC-2024-001',
    orthoType: 'Clear Aligners (Generic)',
    startDate: '2024-02-01', estimatedEndDate: '2024-12-01',
    doctorName: 'Dr. Meera Pillai',
    totalAlignerTrays: 28, currentTray: 14,
    status: 'Active',
    visits: [
      { id: 'ov1', date: '2024-02-01', type: 'Initial Records & Aligner Fitting', trayNumber: 1, notes: 'CBCT, photographs, impressions taken. Tray 1 delivered.', nextAppointmentWeeks: 4 },
      { id: 'ov2', date: '2024-03-01', type: 'Review', trayNumber: 5, notes: 'Good tracking. IPR done anterior region 0.2mm.', nextAppointmentWeeks: 4 },
      { id: 'ov3', date: '2024-04-05', type: 'Review', trayNumber: 9, notes: 'Excellent compliance. Patient wearing 22hrs/day.', nextAppointmentWeeks: 4 },
      { id: 'ov4', date: '2024-05-10', type: 'Refinement Check', trayNumber: 14, notes: 'Mid-treatment review — minor refinement planned. Tray 14 current.', nextAppointmentWeeks: 6 },
    ],
    totalCost: 45000, notes: 'Class I malocclusion. Mild crowding upper and lower.', createdAt: '2024-01-25T00:00:00Z',
  },
];

// ─── Recalls ──────────────────────────────────────────────────────────────────
export const MOCK_RECALLS: Recall[] = [
  { id: 'rc001', patientId: 'p002', type: 'Scaling Recall', dueDate: future(7), status: 'Pending', createdAt: yesterday(83) },
  { id: 'rc002', patientId: 'p003', type: 'Routine Check-up', dueDate: yesterday(3), status: 'Pending', createdAt: yesterday(183) },
  { id: 'rc003', patientId: 'p001', type: 'Post-Treatment', dueDate: future(14), status: 'Pending', notes: 'Post-RCT crown review', createdAt: TODAY },
  { id: 'rc004', patientId: 'p005', type: 'Implant Review', dueDate: future(30), status: 'Pending', notes: 'Pre-implant surgery review', createdAt: yesterday(5) },
  { id: 'rc005', patientId: 'p004', type: 'Ortho Review', dueDate: future(2), status: 'Pending', notes: 'Aligner tray 14 review', createdAt: yesterday(42) },
];

// ─── Activity ─────────────────────────────────────────────────────────────────
export const MOCK_ACTIVITY: ActivityItem[] = [
  { id: 'act1', type: 'appointment_completed', message: 'Root Canal (RCT) completed for Arjun Mehta — Tooth 46', timestamp: new Date().toISOString() },
  { id: 'act2', type: 'invoice_created', message: 'Invoice INV-2024-001 · ₹8,704.80 for Arjun Mehta', timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString() },
  { id: 'act3', type: 'lab_order_sent', message: 'Lab order WO-2024-002 sent to SurgiDent Ceramics — Zirconia Crown #46', timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
  { id: 'act4', type: 'prescription_issued', message: 'Prescription RX-2024-001 issued to Arjun Mehta (3 drugs)', timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString() },
  { id: 'act5', type: 'patient_added', message: 'New patient Mohammed Rafi registered (P-0005)', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { id: 'act6', type: 'recall_due', message: 'Recall overdue: Ramesh Iyer — Routine Check-up (3 days ago)', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
  { id: 'act7', type: 'stock_low', message: 'Low stock alert: Composite Resin A2 — 4 tubes remaining (min: 5)', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
  { id: 'act8', type: 'record_added', message: 'EDR record added for Priya Nair — Scaling visit', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
];

// ─── Treatment Packages ───────────────────────────────────────────────────────
export const MOCK_PACKAGES: TreatmentPackage[] = [
  { id: 'pkg1', name: 'Smile Makeover Package', description: 'Complete aesthetic transformation including whitening and veneers', procedures: ['Teeth Whitening', 'Veneer Placement', 'Scaling & Polishing'], originalPrice: 28000, packagePrice: 22000, validityDays: 180, isActive: true },
  { id: 'pkg2', name: 'Implant Premium Package', description: 'Single implant with zirconia crown and 2-year warranty', procedures: ['Implant Surgery', 'Implant Crown', 'X-Ray'], originalPrice: 35000, packagePrice: 29000, validityDays: 365, isActive: true },
  { id: 'pkg3', name: 'Family Scaling Plan', description: 'Bi-annual scaling for up to 4 family members', procedures: ['Scaling & Polishing'], originalPrice: 6000, packagePrice: 4500, validityDays: 365, isActive: true },
  { id: 'pkg4', name: 'Complete Orthodontic Plan', description: 'Full braces or aligner treatment with retainers', procedures: ['Consultation', 'Aligner Fitting', 'Orthodontic Review'], originalPrice: 55000, packagePrice: 45000, validityDays: 730, isActive: true },
];

// ─── Procedure Prices ─────────────────────────────────────────────────────────
export const PROCEDURE_PRICES: Record<string, number> = {
  'Consultation': 500, 'Scaling & Polishing': 1500, 'Filling': 1200,
  'Root Canal (RCT)': 7500, 'Crown Placement': 8000, 'Extraction': 1000,
  'Teeth Whitening': 5000, 'Orthodontic Review': 800, 'X-Ray': 250,
  'Denture Fitting': 12000, 'Implant Surgery': 18000, 'Implant Crown': 8000,
  'Bridge Placement': 16000, 'Veneer Placement': 6000, 'Gum Treatment': 2000,
  'Fluoride Treatment': 500, 'Pit & Fissure Sealant': 600, 'Pulpotomy': 2500,
  'Periodontal Flap Surgery': 8000, 'Bone Grafting': 12000,
  'Aligner Fitting': 3000, 'Wire Change': 500, 'Lab Try-in': 500,
};

// ─── Drug Database (offline) ──────────────────────────────────────────────────
export const DRUG_DATABASE = [
  { name: 'Amoxicillin', dosages: ['250mg', '500mg'], form: 'Capsule', defaultFreq: 'TDS (3x daily)', defaultDuration: '5 days', instructions: 'After food' },
  { name: 'Amoxicillin + Clavulanic Acid', dosages: ['375mg', '625mg', '1000mg'], form: 'Tablet', defaultFreq: 'BD (2x daily)', defaultDuration: '5 days', instructions: 'After food' },
  { name: 'Metronidazole', dosages: ['200mg', '400mg', '500mg'], form: 'Tablet', defaultFreq: 'TDS (3x daily)', defaultDuration: '5 days', instructions: 'After food' },
  { name: 'Clindamycin', dosages: ['150mg', '300mg'], form: 'Capsule', defaultFreq: 'TDS (3x daily)', defaultDuration: '5 days', instructions: 'With food or milk' },
  { name: 'Azithromycin', dosages: ['250mg', '500mg'], form: 'Tablet', defaultFreq: 'OD (once daily)', defaultDuration: '3 days', instructions: 'Empty stomach' },
  { name: 'Ibuprofen', dosages: ['200mg', '400mg', '600mg'], form: 'Tablet', defaultFreq: 'TDS (3x daily)', defaultDuration: '3 days', instructions: 'After food' },
  { name: 'Ibuprofen + Paracetamol', dosages: ['400/325mg'], form: 'Tablet', defaultFreq: 'TDS (3x daily)', defaultDuration: '3 days', instructions: 'After food' },
  { name: 'Paracetamol', dosages: ['325mg', '500mg', '650mg'], form: 'Tablet', defaultFreq: 'TDS-QDS (3-4x daily)', defaultDuration: '3 days', instructions: 'As required for pain/fever' },
  { name: 'Diclofenac Sodium', dosages: ['50mg', '75mg'], form: 'Tablet', defaultFreq: 'BD (2x daily)', defaultDuration: '3 days', instructions: 'After food' },
  { name: 'Aceclofenac + Paracetamol', dosages: ['100/325mg'], form: 'Tablet', defaultFreq: 'BD (2x daily)', defaultDuration: '5 days', instructions: 'After food' },
  { name: 'Chlorhexidine Mouthwash 0.2%', dosages: ['10ml'], form: 'Mouthwash', defaultFreq: 'BD (2x daily)', defaultDuration: '14 days', instructions: 'Rinse 30 sec, do not swallow' },
  { name: 'Povidone Iodine Mouthwash', dosages: ['10ml'], form: 'Mouthwash', defaultFreq: 'TDS (3x daily)', defaultDuration: '7 days', instructions: 'Dilute 1:1 with water. Do not swallow.' },
  { name: 'Benzydamine HCl Spray', dosages: ['1 puff'], form: 'Spray', defaultFreq: 'QDS (4x daily)', defaultDuration: '5 days', instructions: 'Spray on affected area' },
  { name: 'Triamcinolone Acetonide Dental Paste', dosages: ['small amount'], form: 'Paste', defaultFreq: 'BD-TDS', defaultDuration: '7 days', instructions: 'Apply thin layer on ulcer after meals and at bedtime' },
  { name: 'Fluconazole', dosages: ['50mg', '150mg', '200mg'], form: 'Tablet', defaultFreq: 'OD (once daily)', defaultDuration: '7 days', instructions: 'As directed' },
  { name: 'Dexamethasone', dosages: ['0.5mg', '4mg'], form: 'Tablet', defaultFreq: 'OD (once daily)', defaultDuration: '3 days', instructions: 'After breakfast — taper as prescribed' },
  { name: 'Vitamin C (Ascorbic Acid)', dosages: ['500mg', '1000mg'], form: 'Tablet', defaultFreq: 'OD (once daily)', defaultDuration: '30 days', instructions: 'After food' },
  { name: 'Calcium + Vitamin D3', dosages: ['500/250 IU', '1000/500 IU'], form: 'Tablet', defaultFreq: 'OD (once daily)', defaultDuration: '30 days', instructions: 'After meals' },
  { name: 'Lignocaine Gel 2%', dosages: ['small amount'], form: 'Gel', defaultFreq: 'As needed', defaultDuration: '7 days', instructions: 'Apply on gums before procedures or for pain relief' },
  { name: 'Clotrimazole 1% Cream', dosages: ['small amount'], form: 'Cream', defaultFreq: 'BD (2x daily)', defaultDuration: '14 days', instructions: 'Apply on affected area' },
];
