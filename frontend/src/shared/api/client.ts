import axios from 'axios';

const DEFAULT_API_PORT = '5080';
const LEGACY_API_PORT = '5060';

function normalizeApiUrl(url: string) {
  return url.trim().replace(/\/+$/, '');
}

export function getApiUrlCandidates() {
  const host = window.location.hostname || 'localhost';
  const configuredUrl = import.meta.env.VITE_API_URL;
  const storedUrl = localStorage.getItem('api_base_url');

  return [
    storedUrl,
    configuredUrl,
    `http://${host}:${DEFAULT_API_PORT}`,
    `http://localhost:${DEFAULT_API_PORT}`,
    `http://127.0.0.1:${DEFAULT_API_PORT}`,
    `http://${host}:${LEGACY_API_PORT}`,
    `http://localhost:${LEGACY_API_PORT}`,
    `http://127.0.0.1:${LEGACY_API_PORT}`,
  ]
    .filter((url): url is string => Boolean(url?.trim()))
    .map(normalizeApiUrl)
    .filter((url, index, all) => all.indexOf(url) === index);
}

export function setApiBaseUrl(url: string) {
  const normalizedUrl = normalizeApiUrl(url);
  api.defaults.baseURL = normalizedUrl;
  localStorage.setItem('api_base_url', normalizedUrl);
}

const API_URL = getApiUrlCandidates()[0] || `http://localhost:${DEFAULT_API_PORT}`;

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

let mockEnabled = import.meta.env.VITE_MOCK_MODE === 'true';

export function setMockMode(on: boolean) {
  mockEnabled = on;
}

export function isMockMode() {
  return mockEnabled;
}
