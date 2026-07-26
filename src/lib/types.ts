// ============================================================
// CORE PRIMITIVES
// ============================================================
export type ToothCondition = 'healthy' | 'cavity' | 'crown' | 'missing' | 'rct' | 'implant' | 'bridge' | 'veneer' | 'fracture';

export interface ToothState {
  id: number; // FDI notation
  condition: ToothCondition;
  notes: string;
  surfaces?: ToothSurface[]; // MODBL
}

export type ToothSurface = 'mesial' | 'distal' | 'occlusal' | 'buccal' | 'lingual';

export type MedicalTag =
  | 'Diabetes' | 'Hypertension' | 'Drug Allergy' | 'Heart Disease'
  | 'Asthma' | 'Blood Thinner' | 'Pregnant' | 'Latex Allergy'
  | 'Smoker' | 'Alcohol' | 'HIV+' | 'Hepatitis B' | 'Kidney Disease' | 'Thyroid';

export type Gender = 'Male' | 'Female' | 'Other';
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Unknown';

// ============================================================
// PATIENT
// ============================================================
export interface Patient {
  id: string;
  patientNumber: string; // P-0001
  name: string;
  age: number;
  dob?: string; // YYYY-MM-DD
  gender: Gender;
  phone: string;
  email?: string;
  address?: string;
  emergencyContact: string;
  emergencyRelation?: string;
  bloodGroup: BloodGroup;
  medicalTags: MedicalTag[];
  medicalNotes?: string;
  teeth: ToothState[];
  referredBy?: string;
  createdAt: string;
  lastVisit?: string;
  photo?: string; // base64 or URL
}

// ============================================================
// CONSENT FORMS & DIGITAL SIGNATURES
// ============================================================
export type ConsentCategory = 'Primary Consent' | 'Procedure Specific Consent';

export type ProcedureConsentType =
  | 'General Examination & Local Anesthesia'
  | 'Root Canal Treatment (RCT)'
  | 'Tooth Extraction & Oral Surgery'
  | 'Dental Implant Surgery'
  | 'Orthodontic Braces & Aligners'
  | 'Teeth Whitening & Bleaching'
  | 'Crown, Bridge & Veneer Fitting'
  | 'Custom Treatment Consent';

export interface SignedConsentForm {
  id: string;
  patientId: string;
  category: ConsentCategory;
  formType: ProcedureConsentType;
  title: string;
  content: string;
  doctorName: string;
  signatureDataUrl: string; // Base64 canvas drawing
  signedAt: string;
  status: 'Signed' | 'Revoked';
}

// ============================================================
// ELECTRONIC DENTAL RECORDS (EDR)
// ============================================================
export interface Vitals {
  bp?: string;       // e.g. "120/80"
  pulse?: number;    // bpm
  temp?: string;     // e.g. "98.6°F"
  spo2?: number;     // %
  weight?: number;   // kg
}

export interface ClinicalRecord {
  id: string;
  patientId: string;
  appointmentId?: string;
  date: string; // ISO
  doctorId: string;
  doctorName: string;
  chiefComplaint: string;
  historyOfPresentIllness?: string;
  examinationFindings: string;
  diagnosis: string;
  icdCode?: string;
  vitals?: Vitals;
  treatmentDone: string;
  nextSteps?: string;
  notes?: string;
  toothNumbers?: number[];
  createdAt: string;
}

// ============================================================
// TREATMENT PLANNING
// ============================================================
export type TreatmentPriority = 'Urgent' | 'Recommended' | 'Elective';
export type TreatmentItemStatus = 'Planned' | 'In Progress' | 'Completed' | 'Declined';

export interface TreatmentPlanItem {
  id: string;
  procedure: string;
  toothNumbers: number[];
  priority: TreatmentPriority;
  estimatedCost: number;
  status: TreatmentItemStatus;
  notes: string;
  completedAt?: string;
}

export interface TreatmentPlan {
  id: string;
  patientId: string;
  title: string;
  createdAt: string;
  doctorName: string;
  items: TreatmentPlanItem[];
  totalEstimate: number;
  notes: string;
  status: 'Active' | 'Completed' | 'On Hold';
}

// ============================================================
// APPOINTMENT & SCHEDULER
// ============================================================
export type ProcedureType =
  | 'Consultation' | 'Scaling & Polishing' | 'Filling' | 'Root Canal (RCT)'
  | 'Crown Placement' | 'Extraction' | 'Teeth Whitening' | 'Orthodontic Review'
  | 'X-Ray' | 'Denture Fitting' | 'Implant Surgery' | 'Implant Crown'
  | 'Bridge Placement' | 'Veneer Placement' | 'Gum Treatment' | 'Fluoride Treatment'
  | 'Pit & Fissure Sealant' | 'Pulpotomy' | 'Periodontal Flap Surgery'
  | 'Bone Grafting' | 'Aligner Fitting' | 'Wire Change' | 'Lab Try-in';

export type AppointmentStatus = 'Scheduled' | 'In-Progress' | 'Completed' | 'Cancelled' | 'No-Show';
export type Chair = 'Chair A' | 'Chair B' | 'Chair C' | 'Chair D';

export type ApprovalStatus = 'Approved' | 'Pending' | 'Rejected';

export interface Appointment {
  id: string;
  patientId: string;
  chair: Chair;
  doctorName: string;
  procedure: ProcedureType;
  date: string;
  startTime: string;
  durationMinutes: number;
  status: AppointmentStatus;
  notes: string;
  invoiceId?: string;
  treatmentPlanItemId?: string;
  approvalStatus?: ApprovalStatus;
  bookedByRole?: 'Doctor' | 'Receptionist';
  bookedByName?: string;
  rejectionReason?: string;
}

// ============================================================
// BILLING & INVOICING
// ============================================================
export type PaymentMethod = 'Cash' | 'Card' | 'UPI' | 'Insurance' | 'EMI' | 'Cheque';

export interface InvoiceItem {
  id: string;
  description: string;
  toothNumber?: number;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // INV-2024-001
  appointmentId: string;
  patientId: string;
  items: InvoiceItem[];
  discountPercent: number;
  taxPercent: number;
  paymentMethod: PaymentMethod;
  createdAt: string;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
  paid: boolean;
  notes?: string;
}

// ============================================================
// DIGITAL PRESCRIPTION
// ============================================================
export interface PrescriptionDrug {
  id: string;
  name: string;
  dosage: string;       // e.g. "500mg"
  form: string;         // e.g. "Tablet"
  frequency: string;    // e.g. "TDS (3x daily)"
  duration: string;     // e.g. "5 days"
  instructions: string; // e.g. "After food"
  quantity: number;
}

export interface Prescription {
  id: string;
  rxNumber: string;    // RX-2024-001
  patientId: string;
  appointmentId?: string;
  doctorName: string;
  doctorReg?: string;
  date: string;
  drugs: PrescriptionDrug[];
  diagnosis?: string;
  notes?: string;
  createdAt: string;
}

// ============================================================
// LABORATORY WORK ORDERS
// ============================================================
export type LabWorkType =
  | 'Metal Crown' | 'PFM Crown' | 'Zirconia Crown' | 'E-max Crown'
  | 'Metal Bridge' | 'PFM Bridge' | 'Zirconia Bridge'
  | 'Full Denture' | 'Partial Denture' | 'Flexible Denture'
  | 'Implant Crown' | 'Implant Abutment'
  | 'Orthodontic Retainer' | 'Night Guard' | 'Splint'
  | 'Inlay/Onlay' | 'Veneer' | 'Coping';

export type LabWorkStatus = 'Draft' | 'Sent to Lab' | 'In Fabrication' | 'Ready' | 'Received' | 'Fitted' | 'Remake';
export type ToothShade = 'A1' | 'A2' | 'A3' | 'A3.5' | 'A4' | 'B1' | 'B2' | 'B3' | 'C1' | 'C2' | 'D2' | 'BL1' | 'BL2';

export interface LabWorkOrder {
  id: string;
  workOrderNumber: string;
  patientId: string;
  appointmentId?: string;
  labName: string;
  doctorName: string;
  workType: LabWorkType;
  toothNumbers: number[];
  shade?: ToothShade;
  material?: string;
  instructions: string;
  sentDate?: string;
  dueDate?: string;
  receivedDate?: string;
  fittedDate?: string;
  status: LabWorkStatus;
  cost: number;
  notes?: string;
  createdAt: string;
}

// ============================================================
// INVENTORY
// ============================================================
export type InventoryCategory =
  | 'Anesthetics' | 'Restorative' | 'Endodontic' | 'Surgical'
  | 'Orthodontic' | 'Prosthetic' | 'Sterilization' | 'PPE'
  | 'Impression Materials' | 'Cements' | 'Whitening' | 'Instruments' | 'Consumables' | (string & {});

export type InventoryUnit = 'Box' | 'Pack' | 'Bottle' | 'Tube' | 'Piece' | 'Cartridge' | 'Vial' | 'Set' | 'Roll' | 'Bag';

export interface InventoryItem {
  id: string;
  name: string;
  brand: string;
  category: InventoryCategory;
  unit: InventoryUnit;
  quantityOnHand: number;
  minStockLevel: number;
  reorderLevel: number;
  unitCost: number;
  expiryDate?: string;
  location?: string; // e.g. "Shelf A3"
  batchNumber?: string;
  notes?: string;
  lastRestocked?: string;
  createdAt: string;
}

export interface StockMovement {
  id: string;
  itemId: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  reason: string;
  date: string;
  performedBy: string;
}

// ============================================================
// IMPLANT TRACKING
// ============================================================
export type ImplantStatus = 'Planned' | 'Placed' | 'Healing' | 'Abutment Placed' | 'Crown Delivered' | 'Complication';

export interface ImplantRecord {
  id: string;
  patientId: string;
  toothNumber: number;
  brand: string;       // e.g. "Straumann", "Nobel Biocare"
  system: string;      // e.g. "Bone Level Tapered"
  diameter: number;    // mm e.g. 4.1
  length: number;      // mm e.g. 10
  torque?: number;     // Ncm
  surgeonName: string;
  placementDate?: string;
  healingPeriodWeeks: number;
  abutmentType?: string;
  abutmentDate?: string;
  crownType?: string;
  crownDeliveryDate?: string;
  status: ImplantStatus;
  notes: string;
  createdAt: string;
}

// ============================================================
// ORTHODONTIC MODULE
// ============================================================
export type OrthoType = 'Metal Braces' | 'Ceramic Braces' | 'Lingual Braces' | 'Clear Aligners (Invisalign)' | 'Clear Aligners (Generic)';
export type OrthoStatus = 'Planning' | 'Active' | 'Retention' | 'Completed' | 'Discontinued';

export interface OrthoVisit {
  id: string;
  date: string;
  type: string; // e.g. "Wire Change", "Bracket Bonding", "IPR"
  upperWire?: string;
  lowerWire?: string;
  trayNumber?: number;
  notes: string;
  nextAppointmentWeeks?: number;
}

export interface OrthoCase {
  id: string;
  patientId: string;
  caseNumber: string;
  orthoType: OrthoType;
  startDate: string;
  estimatedEndDate?: string;
  endDate?: string;
  doctorName: string;
  totalAlignerTrays?: number;
  currentTray?: number;
  status: OrthoStatus;
  visits: OrthoVisit[];
  totalCost: number;
  notes: string;
  createdAt: string;
}

// ============================================================
// RECALLS & FOLLOW-UP
// ============================================================
export type RecallType = 'Routine Check-up' | 'Post-Treatment' | 'Scaling Recall' | 'Implant Review' | 'Ortho Review' | 'Custom';
export type RecallStatus = 'Pending' | 'Contacted' | 'Scheduled' | 'Completed' | 'Declined' | 'Lost';

export interface Recall {
  id: string;
  patientId: string;
  type: RecallType;
  dueDate: string;
  status: RecallStatus;
  notes?: string;
  contactedAt?: string;
  scheduledAppointmentId?: string;
  createdAt: string;
}

// ============================================================
// ACTIVITY FEED
// ============================================================
export interface ActivityItem {
  id: string;
  type: 'patient_added' | 'appointment_scheduled' | 'appointment_completed'
      | 'invoice_created' | 'prescription_issued' | 'lab_order_sent'
      | 'lab_order_received' | 'recall_due' | 'stock_low' | 'record_added';
  message: string;
  timestamp: string;
  metadata?: Record<string, string>;
}

// ============================================================
// ANALYTICS
// ============================================================
export interface RevenueDataPoint {
  month: string; // "Jan 2024"
  revenue: number;
  appointments: number;
}

// ============================================================
// TREATMENT PACKAGES
// ============================================================
export interface TreatmentPackage {
  id: string;
  name: string;
  description: string;
  procedures: string[];
  originalPrice: number;
  packagePrice: number;
  validityDays: number;
  isActive: boolean;
}

// ============================================================
// DOCUMENT REPOSITORY
// ============================================================
export interface PatientDocument {
  id: string;
  patientId: string;
  name: string;
  type: 'X-Ray' | 'Photo' | 'Consent Form' | 'Report' | 'Insurance' | 'Other';
  uploadedAt: string;
  uploadedBy: string;
  size?: number; // bytes
  notes?: string;
  dataUrl?: string; // base64 for offline storage
}
