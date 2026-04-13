import { api } from "./axios";
import { InsuranceProvider, PatientInsurance } from "../types";

export const getProviders = async (): Promise<InsuranceProvider[]> => {
  const { data } = await api.get("/insurance-providers");
  return data;
};

export const createProvider = async (payload: Partial<InsuranceProvider>): Promise<InsuranceProvider> => {
  const { data } = await api.post("/insurance-providers", payload);
  return data;
};

export const updateProvider = async (id: number, payload: Partial<InsuranceProvider>): Promise<InsuranceProvider> => {
  const { data } = await api.put(`/insurance-providers/${id}`, payload);
  return data;
};

export const deleteProvider = async (id: number): Promise<void> => {
  await api.delete(`/insurance-providers/${id}`);
};

export const getPatientInsurances = async (patientId?: number): Promise<PatientInsurance[]> => {
  const { data } = await api.get("/patient-insurance");
  return patientId ? data.filter((item: any) => item.patient_id === patientId) : data;
};

export const createPatientInsurance = async (payload: Partial<PatientInsurance>): Promise<PatientInsurance> => {
  const { data } = await api.post("/patient-insurance", payload);
  return data;
};

export const updatePatientInsurance = async (id: number, payload: Partial<PatientInsurance>): Promise<PatientInsurance> => {
  const { data } = await api.put(`/patient-insurance/${id}`, payload);
  return data;
};

export const deletePatientInsurance = async (id: number): Promise<void> => {
  await api.delete(`/patient-insurance/${id}`);
};
