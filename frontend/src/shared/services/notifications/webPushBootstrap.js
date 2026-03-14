import {
    registerServiceWorker,
    subscribeToWebPush,
    registerWebPushSubscription,
    updateWebPushZone,
} from './webPushService';
import { resolveZoneKey } from './zoneService';
import { notificationCenter } from './notificationCenter';

const VAPID_PUBLIC_KEY = process.env.EXPO_PUBLIC_VAPID_PUBLIC_KEY;

export async function bootstrapWebPushNotifications({
    authToken,
    apiBaseUrl,
    latitude,
    longitude,
    onNotificationClick,
}) {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
        return { registration: null, subscription: null };
    }

    if (!VAPID_PUBLIC_KEY) {
        console.warn('Web push disabled: missing EXPO_PUBLIC_VAPID_PUBLIC_KEY');
        return { registration: null, subscription: null };
    }

    const registration = await registerServiceWorker();
    if (!registration) {
        return { registration: null, subscription: null };
    }

    const subscription = await subscribeToWebPush(registration, VAPID_PUBLIC_KEY);
    if (!subscription) {
        return { registration, subscription: null };
    }

    const zoneKey = resolveZoneKey(latitude, longitude);

    await registerWebPushSubscription(subscription, zoneKey, authToken, apiBaseUrl);

    if (zoneKey) {
        await updateWebPushZone(subscription, zoneKey, authToken, apiBaseUrl);
    }

    if (navigator.serviceWorker) {
        navigator.serviceWorker.addEventListener('message', (event) => {
            const data = event.data || {};

            if (data.type === 'PUSH_NOTIFICATION_CLICK') {
                const payload = data.payload || {};

                notificationCenter.publish({
                    type: payload.type || 'PUSH_NOTIFICATION',
                    title: payload.title || 'Notification',
                    message: payload.body || '',
                    referenceId: payload.referenceId || null,
                    referenceType: payload.referenceType || null,
                });

                if (typeof onNotificationClick === 'function') {
                    onNotificationClick(payload);
                }
            }
        });
    }

    return { registration, subscription };
}