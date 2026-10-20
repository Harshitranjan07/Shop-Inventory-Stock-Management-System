const API_BASE = import.meta.env.VITE_API_URL || '/api';

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('shop_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = (data && data.message) || `Error ${response.status}: Request failed`;
    throw new Error(errorMsg);
  }

  return data;
};


export const getProducts = async (search = '') => {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  return await request(`/products${query}`, { method: 'GET' });
};


export const getProductById = async (id) => {
  return await request(`/products/${id}`, { method: 'GET' });
};


export const createProduct = async (productData) => {
  return await request('/products', {
    method: 'POST',
    body: JSON.stringify(productData)
  });
};


export const updateProduct = async (id, productData) => {
  return await request(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData)
  });
};


export const deleteProduct = async (id) => {
  return await request(`/products/${id}`, { method: 'DELETE' });
};


export const getProductMovements = async (id) => {
  return await request(`/products/${id}/movements`, { method: 'GET' });
};
