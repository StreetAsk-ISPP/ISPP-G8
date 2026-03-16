/* global clients */

const NEARBY_QUESTION_ICON = '/nearby-question-icon.svg';
const NEARBY_QUESTION_BADGE = '/nearby-question-badge.svg';
const ANSWER_ACTIVITY_ICON = '/answer-activity-icon.svg';
const ANSWER_ACTIVITY_BADGE = '/answer-activity-badge.svg';

function buildNotificationOptions(data) {
    const type = data.type || 'GENERIC';

    if (type === 'NEARBY_QUESTION') {
        return {
            body: data.body || '',
            icon: NEARBY_QUESTION_ICON,
            badge: NEARBY_QUESTION_BADGE,
            tag: data.referenceId ? `nearby-question-${data.referenceId}` : 'nearby-question',
            requireInteraction: true,
            data,
        };
    }

    if (type === 'ANSWER_TO_QUESTION') {
        return {
            body: data.body || '',
            icon: ANSWER_ACTIVITY_ICON,
            badge: ANSWER_ACTIVITY_BADGE,
            tag: data.referenceId ? `answer-activity-${data.referenceId}` : 'answer-activity',
            data,
        };
    }

    return {
        body: data.body || '',
        icon: ANSWER_ACTIVITY_ICON,
        badge: ANSWER_ACTIVITY_BADGE,
        data,
    };
}

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
    const options = buildNotificationOptions(data);

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