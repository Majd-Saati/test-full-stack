import { apiClient } from './client';

export async function fetchUsers() {
  const { data } = await apiClient.get('/users');
  return data;
}
