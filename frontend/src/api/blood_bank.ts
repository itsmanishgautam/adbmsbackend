import { api } from "./axios";

export const getBloodBank = async (): Promise<any[]> => {
  const { data } = await api.get("/blood-bank");
  return data;
};

export const updateBloodBank = async (bloodType: string, payload: { units_available: number }): Promise<any> => {
  const { data } = await api.put(`/blood-bank/${encodeURIComponent(bloodType)}`, payload);
  return data;
};
