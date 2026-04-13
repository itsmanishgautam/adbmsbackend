import { api } from "./axios";
import { User } from "../types";

export const getUsers = async (): Promise<User[]> => {
  const { data } = await api.get("/admin/users");
  return data;
};

export const updateUserStatus = async (id: number, status: boolean): Promise<User> => {
  const { data } = await api.patch(`/admin/users/${id}/status?status=${status}`);
  return data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/admin/users/${id}`);
};

export const getLogs = async (params: any = {}): Promise<any[]> => {
  const { data } = await api.get("/admin/logs", { params });
  return data;
};

export const createDoctor = async (payload: any): Promise<User> => {
  const { data } = await api.post("/admin/create_doctor", payload);
  return data;
};

export const updateDoctor = async (id: number, payload: any): Promise<any> => {
  const { data } = await api.put(`/admin/doctors/${id}`, payload);
  return data;
};

export const deleteDoctor = async (id: number): Promise<void> => {
  await api.delete(`/admin/doctors/${id}`);
};
