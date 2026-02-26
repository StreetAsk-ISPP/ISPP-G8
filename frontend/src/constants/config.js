const rawApiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim() || 'http://localhost:8080';
const apiBaseUrl = rawApiBaseUrl.replace(/\/+$/, '');
const configuredTimeoutMs = Number(process.env.EXPO_PUBLIC_API_TIMEOUT_MS);

export const APP_CONFIG = {
  appName: 'ISPP Frontend',
  apiBaseUrl,
  requestTimeoutMs: Number.isFinite(configuredTimeoutMs) && configuredTimeoutMs > 0 ? configuredTimeoutMs : 10000,
};

// Exportar también de forma individual para compatibilidad
export const API_BASE_URL = apiBaseUrl;
export const API_TIMEOUT_MS = APP_CONFIG.requestTimeoutMs;
