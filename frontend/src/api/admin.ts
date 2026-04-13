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

export const getLogs = async (): Promise<any[]> => {
  const { data } = await api.get("/admin/logs");
  return data;
};

export const createDoctor = async (data: any): Promise<User> => {
  const response = await api.post("/admin/create_doctor", data);
  return response.data;
};
