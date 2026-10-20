const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

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


export const stockIn = async (data) => {
  return await request('/stock/in', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};


export const stockOut = async (data) => {
  return await request('/stock/out', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};


export const getLowStock = async () => {
  return await request('/stock/low-stock', { method: 'GET' });
};
