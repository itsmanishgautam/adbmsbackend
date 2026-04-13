import { api } from "./axios";
import { Patient, PatientCard } from "../types";

export const getMe = async (): Promise<Patient> => {
  const { data } = await api.get("/patients/me");
  return data;
};

export const updateMe = async (payload: Partial<Patient>): Promise<Patient> => {
  const { data } = await api.put("/patients/me", payload);
  return data;
};

export const searchPatient = async (identifier: string): Promise<PatientCard> => {
  const { data } = await api.get(`/emergency/search?identifier=${identifier}`);
  return data;
};

export const getPatientCardAdmin = async (id: number): Promise<PatientCard> => {
  const { data } = await api.get(`/patients/${id}/card`); // Admin/Doctor bypass
  return data;
};
