import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { APP_CONFIG } from '../../../app/config/config';

function resolveWebSocketUrl() {
  return APP_CONFIG.websocket?.url || APP_CONFIG.apiBaseUrl;
}

export function createWebSocketClient({
  token,
  reconnectDelay = APP_CONFIG.websocket?.reconnectDelayMs ?? 5000,
  debug = false,
  onConnect,
  onDisconnect,
  onStompError,
  onWebSocketError,
  onWebSocketClose,
} = {}) {
  const webSocketUrl = resolveWebSocketUrl();

  return new Client({
    webSocketFactory: () => new SockJS(webSocketUrl),
    reconnectDelay,
    debug: debug ? (message) => console.log('[STOMP]', message) : undefined,
    connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
    onConnect: (frame) => onConnect?.(frame),
    onDisconnect: (frame) => onDisconnect?.(frame),
    onStompError: (frame) => onStompError?.(frame),
    onWebSocketError: (event) => onWebSocketError?.(event),
    onWebSocketClose: (event) => onWebSocketClose?.(event),
  });
}

export async function disconnectWebSocketClient(client) {
  if (!client) return;
  try {
    await client.deactivate();
  } catch (error) {
    console.error('Error while disconnecting STOMP client:', error);
  }
}
