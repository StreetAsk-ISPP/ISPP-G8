const rawApiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim() || 'http://localhost:3000';
const apiBaseUrl = rawApiBaseUrl.replace(/\/+$/, '');
const configuredTimeoutMs = Number(process.env.EXPO_PUBLIC_API_TIMEOUT_MS);

export const APP_CONFIG = {
  appName: 'ISPP Frontend',
  apiBaseUrl,
  requestTimeoutMs: Number.isFinite(configuredTimeoutMs) && configuredTimeoutMs > 0 ? configuredTimeoutMs : 10000,
};
