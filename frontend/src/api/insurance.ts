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

export const getPatientInsurances = async (patientId?: number): Promise<PatientInsurance[]> => {
  const { data } = await api.get("/patient-insurance");
  return patientId ? data.filter((item: any) => item.patient_id === patientId) : data;
};

export const createPatientInsurance = async (payload: Partial<PatientInsurance>): Promise<PatientInsurance> => {
  const { data } = await api.post("/patient-insurance", payload);
  return data;
};
