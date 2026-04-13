export type Role = "patient" | "doctor" | "admin";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  is_active: boolean;
  created_at: string;
}

export interface Patient {
  patient_id: number;
  user_id: number;
  emergency_identifier: string;
  blood_type?: string;
  emergency_contact_summary?: string;
}

export interface Doctor {
  doctor_id: number;
  user_id: number;
  specialty?: string;
  hospital_id?: number;
  contact_info?: string;
}

export interface Allergy {
  allergy_id: number;
  patient_id: number;
  allergy_name: string;
  severity?: string;
}

export interface Condition {
  condition_id: number;
  patient_id: number;
  condition_name: string;
  critical_flag: boolean;
}

export interface Medication {
  medication_id: number;
  patient_id: number;
  medication_name: string;
  dosage?: string;
}

export interface Device {
  device_id: number;
  patient_id: number;
  device_name: string;
  device_type?: string;
}

export interface EmergencyContact {
  contact_id: number;
  patient_id: number;
  contact_name: string;
  relationship?: string;
  phone_number?: string;
}

export interface InsuranceProvider {
  provider_id: number;
  provider_name: string;
  payer_phone?: string;
}

export interface PatientInsurance {
  patient_insurance_id: number;
  patient_id: number;
  provider_id: number;
  plan_type?: string;
  member_id?: string;
  group_number?: string;
  coverage_status?: string;
}

export interface PatientCard extends Patient {
  name: string;
}
