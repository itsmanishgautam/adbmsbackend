import { api } from "./axios";

export const login = async (username: string, password: string) => {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);
  // OAuth2PasswordRequestForm needs application/x-www-form-urlencoded
  const response = await api.post("/auth/login", formData, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return response.data; // { access_token, token_type }
};

export const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const signup = async (data: any) => {
  const response = await api.post("/auth/signup", data);
  return response.data;
};
