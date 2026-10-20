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


export const getSuppliers = async () => {
  return await request('/suppliers', { method: 'GET' });
};


export const getSupplierById = async (id) => {
  return await request(`/suppliers/${id}`, { method: 'GET' });
};


export const createSupplier = async (supplierData) => {
  return await request('/suppliers', {
    method: 'POST',
    body: JSON.stringify(supplierData)
  });
};


export const updateSupplier = async (id, supplierData) => {
  return await request(`/suppliers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(supplierData)
  });
};


export const deleteSupplier = async (id) => {
  return await request(`/suppliers/${id}`, { method: 'DELETE' });
};
