import { apiClient } from './client';

export async function loginRequest({ email, password }) {
  const { data } = await apiClient.post('/auth/login', { email, password });
  return data;
}
