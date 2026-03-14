function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export async function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
        console.warn('Service workers are not supported in this browser');
        return null;
    }

    const registration = await navigator.serviceWorker.register('/sw.js');
    return registration;
}

export async function requestNotificationPermission() {
    if (!('Notification' in window)) {
        console.warn('Notifications are not supported in this browser');
        return 'denied';
    }

    const result = await Notification.requestPermission();
    return result;
}

export async function subscribeToWebPush(registration, vapidPublicKey) {
    if (!registration) {
        return null;
    }

    const existingSubscription = await registration.pushManager.getSubscription();
    if (existingSubscription) {
        return existingSubscription;
    }

    const permission = await requestNotificationPermission();
    if (permission !== 'granted') {
        console.warn('Notification permission not granted');
        return null;
    }

    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });

    return subscription;
}

export async function registerWebPushSubscription(subscription, zoneKey, authToken, apiBaseUrl) {
    const json = subscription.toJSON();

    const response = await fetch(`${apiBaseUrl}/api/push-devices/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
            endpoint: json.endpoint,
            p256dh: json.keys.p256dh,
            auth: json.keys.auth,
            zoneKey,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Register web push failed: ${response.status} ${errorText}`);
    }
}

export async function updateWebPushZone(subscription, zoneKey, authToken, apiBaseUrl) {
    const json = subscription.toJSON();

    const response = await fetch(`${apiBaseUrl}/api/push-devices/zone`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
            endpoint: json.endpoint,
            zoneKey,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Update web push zone failed: ${response.status} ${errorText}`);
    }
}

export async function unregisterWebPushSubscription(subscription, authToken, apiBaseUrl) {
    const json = subscription.toJSON();

    const response = await fetch(`${apiBaseUrl}/api/push-devices/unregister`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
            endpoint: json.endpoint,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Unregister web push failed: ${response.status} ${errorText}`);
    }
}