import { api } from "./axios";

export const getDependencies = async (
  endpoint: "allergies" | "conditions" | "medications" | "devices" | "emergency-contacts",
  patientId?: number
) => {
  const { data } = await api.get(`/${endpoint}`);
  return patientId ? data.filter((item: any) => item.patient_id === patientId) : data;
};

export const createDependency = async (
  endpoint: "allergies" | "conditions" | "medications" | "devices" | "emergency-contacts",
  payload: any
) => {
  const { data } = await api.post(`/${endpoint}`, payload);
  return data;
};

export const updateDependency = async (
  endpoint: "allergies" | "conditions" | "medications" | "devices" | "emergency-contacts",
  id: number,
  payload: any
) => {
  const { data } = await api.put(`/${endpoint}/${id}`, payload);
  return data;
};

export const deleteDependency = async (
  endpoint: "allergies" | "conditions" | "medications" | "devices" | "emergency-contacts",
  id: number
) => {
  const { data } = await api.delete(`/${endpoint}/${id}`);
  return data;
};
