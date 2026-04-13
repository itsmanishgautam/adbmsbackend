import { api } from "./axios";
import { Allergy, Condition, Medication, Device, EmergencyContact } from "../types";

export const getDependencies = async (
  endpoint: "allergies" | "conditions" | "medications" | "devices" | "emergency-contacts",
  patientId?: number
) => {
  const { data } = await api.get(`/${endpoint}`);
  // If backend returns all, we filter by patient inside frontend or pass ?patient_id=X if backend supports it.
  // Our generic CRUD didn't implement patient_id filter directly on get_multi unfortunately, so filtering locally for demonstration or extending backend.
  return patientId ? data.filter((item: any) => item.patient_id === patientId) : data;
};

export const createDependency = async (
  endpoint: "allergies" | "conditions" | "medications" | "devices" | "emergency-contacts",
  payload: any
) => {
  const { data } = await api.post(`/${endpoint}`, payload);
  return data;
};
