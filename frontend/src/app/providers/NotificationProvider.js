import * as Location from 'expo-location';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';

import { APP_CONFIG } from '../config/config';
import { useAuth } from './AuthProvider';
import { useWebSocket } from './WebSocketProvider';
import { notificationCenter } from '../../shared/services/notifications/notificationCenter';
import { buildZoneTopic, resolveZoneKey } from '../../shared/services/notifications/zoneService';

const MAX_NOTIFICATIONS = 50;
const EPHEMERAL_NOTIFICATION_MS = 6000;
const NotificationContext = createContext(null);

function parseMessage(frame, source) {
  try {
    const parsed = JSON.parse(frame.body);
    return {
      ...parsed,
      source,
      receivedAt: new Date().toISOString(),
    };
  } catch {
    return {
      type: 'GENERIC',
      title: 'New notification',
      message: frame.body,
      source,
      receivedAt: new Date().toISOString(),
    };
  }
}

export function NotificationProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const { stompClient, isConnected } = useWebSocket();

  const [notifications, setNotifications] = useState([]);
  const [currentZoneKey, setCurrentZoneKey] = useState(null);
  const [ephemeralNotification, setEphemeralNotification] = useState(null);

  const userSubscriptionRef = useRef(null);
  const zoneSubscriptionRef = useRef(null);
  const zoneTopicRef = useRef(null);
  const ephemeralTimeoutRef = useRef(null);

  const unsubscribeUser = useCallback(() => {
    if (userSubscriptionRef.current) {
      userSubscriptionRef.current.unsubscribe();
      userSubscriptionRef.current = null;
    }
  }, []);

  const unsubscribeZone = useCallback(() => {
    if (zoneSubscriptionRef.current) {
      zoneSubscriptionRef.current.unsubscribe();
      zoneSubscriptionRef.current = null;
      zoneTopicRef.current = null;
    }
  }, []);

  const pushNotification = useCallback((notification) => {
    const normalized = {
      ...notification,
      clientId: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    };

    setNotifications((previous) => [normalized, ...previous].slice(0, MAX_NOTIFICATIONS));
    setEphemeralNotification(normalized);

    if (ephemeralTimeoutRef.current) {
      clearTimeout(ephemeralTimeoutRef.current);
    }
    ephemeralTimeoutRef.current = setTimeout(() => {
      setEphemeralNotification((current) => (current?.clientId === normalized.clientId ? null : current));
    }, EPHEMERAL_NOTIFICATION_MS);

    notificationCenter.publish(normalized);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      unsubscribeUser();
      unsubscribeZone();
      setCurrentZoneKey(null);
      return;
    }

    let mobileWatcher = null;
    let webWatcherId = null;
    let cancelled = false;

    const onPosition = (latitude, longitude) => {
      const zoneKey = resolveZoneKey(latitude, longitude);
      if (!cancelled) {
        setCurrentZoneKey(zoneKey);
      }
    };

    const startTracking = async () => {
      if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.geolocation) {
        webWatcherId = navigator.geolocation.watchPosition(
          (position) => onPosition(position.coords.latitude, position.coords.longitude),
          () => {},
          { enableHighAccuracy: true, maximumAge: 15000, timeout: 10000 }
        );
        console.log('[notifications] zone tracking started (web)');
        return;
      }

      try {
        const permission = await Location.requestForegroundPermissionsAsync();
        if (permission.status !== 'granted') return;

        const current = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        onPosition(current.coords.latitude, current.coords.longitude);

        mobileWatcher = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 8000,
            distanceInterval: 150,
          },
          (position) => onPosition(position.coords.latitude, position.coords.longitude)
        );
        console.log('[notifications] zone tracking started (mobile)');
      } catch (error) {
        console.warn('Unable to watch location for notification zones:', error);
      }
    };

    startTracking();

    return () => {
      cancelled = true;
      if (mobileWatcher && typeof mobileWatcher.remove === 'function') {
        mobileWatcher.remove();
      }
      if (webWatcherId !== null && typeof navigator !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.clearWatch(webWatcherId);
      }
    };
  }, [isAuthenticated, unsubscribeUser, unsubscribeZone]);

  useEffect(() => {
    const client = stompClient.current;

    if (!isAuthenticated || !isConnected || !client) {
      unsubscribeUser();
      unsubscribeZone();
      return;
    }

    if (!userSubscriptionRef.current) {
      console.log('[notifications] subscribing user topic', APP_CONFIG.websocket.topics.userNotifications);
      userSubscriptionRef.current = client.subscribe(
        APP_CONFIG.websocket.topics.userNotifications,
        (frame) => {
          console.log('[notifications] message received from user topic');
          pushNotification(parseMessage(frame, 'user'));
        }
      );
    }

    if (currentZoneKey) {
      const zoneTopic = buildZoneTopic(currentZoneKey);
      if (zoneTopic && zoneTopicRef.current !== zoneTopic) {
        unsubscribeZone();
        console.log('[notifications] subscribing zone topic', zoneTopic);
        zoneSubscriptionRef.current = client.subscribe(zoneTopic, (frame) => {
          console.log('[notifications] message received from zone topic', zoneTopic);
          pushNotification(parseMessage(frame, 'zone'));
        });
        zoneTopicRef.current = zoneTopic;
      }
    }
  }, [
    currentZoneKey,
    isAuthenticated,
    isConnected,
    pushNotification,
    stompClient,
    unsubscribeUser,
    unsubscribeZone,
  ]);

  useEffect(() => {
    return () => {
      unsubscribeUser();
      unsubscribeZone();
      if (ephemeralTimeoutRef.current) {
        clearTimeout(ephemeralTimeoutRef.current);
      }
    };
  }, [unsubscribeUser, unsubscribeZone]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const observeNotifications = useCallback((observer) => {
    return notificationCenter.subscribe(observer);
  }, []);

  const value = useMemo(
    () => ({
      notifications,
      currentZoneKey,
      ephemeralNotification,
      clearNotifications,
      observeNotifications,
    }),
    [clearNotifications, currentZoneKey, ephemeralNotification, notifications, observeNotifications]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used inside NotificationProvider');
  }
  return context;
}
