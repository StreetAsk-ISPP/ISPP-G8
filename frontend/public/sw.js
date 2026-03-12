/* global self, clients */

self.addEventListener('push', (event) => {
    let data = {};

    try {
        data = event.data ? event.data.json() : {};
    } catch (error) {
        data = {
            title: 'StreetAsk notification',
            body: 'You have a new notification',
        };
    }

    const title = data.title || 'StreetAsk notification';
    const options = {
        body: data.body || '',
        icon: '/favicon.png',
        badge: '/favicon.png',
        data,
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const data = event.notification.data || {};
    let targetUrl = '/';

    if (data.type === 'NEARBY_QUESTION' && data.referenceId) {
        targetUrl = `/questions/${data.referenceId}`;
    }

    if (data.type === 'ANSWER_TO_QUESTION' && data.referenceId) {
        targetUrl = `/questions/${data.referenceId}`;
    }

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if ('focus' in client) {
                    client.focus();
                    client.postMessage({
                        type: 'PUSH_NOTIFICATION_CLICK',
                        payload: data,
                    });
                    return;
                }
            }

            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});