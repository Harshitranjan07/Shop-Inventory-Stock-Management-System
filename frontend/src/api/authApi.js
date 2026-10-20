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


export const login = async (email, password) => {
  return await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
};


export const register = async (name, email, password) => {
  return await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password })
  });
};


export const getProfile = async () => {
  return await request('/auth/profile', {
    method: 'GET'
  });
};
