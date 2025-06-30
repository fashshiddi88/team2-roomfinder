import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function loginUser(email: string, password: string) {
  const response = await api.post('/api/auth/login', { email, password });
  return response.data.data;
}

export async function registerUser(email: string) {
  const response = await api.post('/api/register-user', { email });
  return response.data;
}

interface CreateTenantPayload {
  email: string;
  companyName: string;
}

export async function registerTenant(data: CreateTenantPayload) {
  const res = await api.post('/api/register-tenant', data);
  return res.data;
}

export async function registerSetPassword(token: string, password: string) {
  const response = await api.post('/api/users/verify', { token, password });
  return response.data;
}

export async function forgotPassword(email: string) {
  const response = await api.post(`/api/auth/forgot-password`, { email });
  return response.data;
}

export async function resetPassword(token: string, newPassword: string) {
  console.log(token, newPassword);
  const response = await api.post(`/api/auth/reset-password`, {
    token,
    newPassword,
  });

  return response.data;
}
