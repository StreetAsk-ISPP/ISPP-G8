import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useAuth } from './AuthProvider';
import { APP_CONFIG } from '../config/config';
import {
  createWebSocketClient,
  disconnectWebSocketClient,
} from '../../shared/services/websocket/webSocketClient';

const WebSocketContext = createContext(null);
const TOKEN_STORAGE_KEY = 'auth_token';

export const WebSocketProvider = ({ children }) => {
  const stompClient = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    let cancelled = false;

    const initializeClient = async () => {
      if (!isAuthenticated) {
        if (stompClient.current) {
          await disconnectWebSocketClient(stompClient.current);
          stompClient.current = null;
        }
        if (!cancelled) setIsConnected(false);
        return;
      }

      if (stompClient.current) return;

      const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
      console.log('[websocket] connecting to', APP_CONFIG.websocket.url);
      const client = createWebSocketClient({
        debug: true,
        token,
        onConnect: () => {
          console.log('[websocket] connected');
          if (!cancelled) setIsConnected(true);
        },
        onDisconnect: () => {
          console.log('[websocket] disconnected');
          if (!cancelled) setIsConnected(false);
        },
        onStompError: (frame) => {
          console.error('STOMP error:', frame?.headers?.message, frame?.body);
          if (!cancelled) setIsConnected(false);
        },
        onWebSocketError: (event) => {
          console.error('WebSocket transport error:', event);
          if (!cancelled) setIsConnected(false);
        },
        onWebSocketClose: (event) => {
          console.warn('WebSocket transport close:', event?.code, event?.reason);
          if (!cancelled) setIsConnected(false);
        },
      });

      stompClient.current = client;
      client.activate();
    };

    initializeClient();

    return () => {
      cancelled = true;
      if (stompClient.current && !isAuthenticated) {
        disconnectWebSocketClient(stompClient.current);
        stompClient.current = null;
      }
    };
  }, [isAuthenticated]);

  useEffect(() => {
    return () => {
      disconnectWebSocketClient(stompClient.current);
      stompClient.current = null;
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ stompClient, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
