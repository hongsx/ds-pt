import axios from 'axios';
import Router from 'next/router';

const api = axios.create({
  baseURL: '/api/proxy',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add Authorization header if token exists
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor to handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      // Redirect to login page
      if (typeof window !== 'undefined') {
        Router.push('/login');
      }
    }
    return Promise.reject(error);
  }
);

export async function apiGet(path: string, params?: any) {
  const resp = await api.get(path, { params });
  return resp.data;
}

export async function apiPost(path: string, body?: any) {
  const resp = await api.post(path, body);
  return resp.data;
}

export async function apiPut(path: string, body?: any) {
  const resp = await api.put(path, body);
  return resp.data;
}

export async function apiDelete(path: string) {
  const resp = await api.delete(path);
  return resp.data;
}

export default api;
