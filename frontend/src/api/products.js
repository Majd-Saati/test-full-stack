import { apiClient } from './client';

export async function fetchProducts() {
  const { data } = await apiClient.get('/products');
  return data;
}
