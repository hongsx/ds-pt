import axios from 'axios';
import Router from 'next/router';

const api = axios.create({
  baseURL: '/api/proxy',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// A small axios instance used only for refresh calls to avoid interceptors recursion
const refreshClient = axios.create({
  baseURL: '/api/proxy',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
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

let isRefreshing = false;
let refreshSubscribers: Array<(token: string | null) => void> = [];

function subscribeTokenRefresh(cb: (token: string | null) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string | null) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

// Response interceptor to handle 401 globally and attempt refresh
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const originalRequest = error?.config;

    if (status === 401) {
      // If the request is the refresh call itself, redirect to login
      if (originalRequest && originalRequest.url && originalRequest.url.includes('/auth/refresh')) {
        if (typeof window !== 'undefined') Router.push('/login');
        return Promise.reject(error);
      }

      // Avoid retrying infinitely
      if (originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;

        if (!isRefreshing) {
          isRefreshing = true;
          // call refresh endpoint
          refreshClient
            .post('/auth/refresh', null)
            .then((resp) => {
              const newToken = resp?.data?.token;
              if (newToken && typeof window !== 'undefined') {
                localStorage.setItem('token', newToken);
              }
              onRefreshed(newToken ?? null);
            })
            .catch((err) => {
              onRefreshed(null);
              if (typeof window !== 'undefined') Router.push('/login');
            })
            .finally(() => {
              isRefreshing = false;
            });
        }

        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((token) => {
            if (token) {
              // attach new token and retry original request
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              resolve(api(originalRequest));
            } else {
              reject(error);
            }
          });
        });
      }
    }

    // Redirect on 401 if we can't handle it
    if (status === 401) {
      if (typeof window !== 'undefined') Router.push('/login');
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
