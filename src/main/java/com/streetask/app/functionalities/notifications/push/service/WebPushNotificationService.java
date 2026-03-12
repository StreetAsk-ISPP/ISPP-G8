package com.streetask.app.functionalities.notifications.push.service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.http.HttpResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.streetask.app.functionalities.notifications.push.dto.PushMessage;
import com.streetask.app.functionalities.notifications.push.model.PushDevice;
import com.streetask.app.functionalities.notifications.push.repository.PushDeviceRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;
import nl.martijndwars.webpush.Subscription;
import nl.martijndwars.webpush.Utils;

@Service
@RequiredArgsConstructor
@Slf4j
public class WebPushNotificationService implements PushNotificationService {

    private final PushDeviceRepository pushDeviceRepository;
    private final ObjectMapper objectMapper;

    @Value("${streetask.web-push.subject}")
    private String subject;

    @Value("${streetask.web-push.public-key}")
    private String publicKey;

    @Value("${streetask.web-push.private-key}")
    private String privateKey;

    @Override
    public void sendToUser(String email, PushMessage message) {
        List<PushDevice> devices = pushDeviceRepository.findByUserEmailAndNotificationsEnabledTrue(email);

        if (devices.isEmpty()) {
            log.info("No web push devices found for user email={}", email);
            return;
        }

        for (PushDevice device : devices) {
            sendToDevice(device, message);
        }
    }

    @Override
    public void sendToZones(Set<String> zoneKeys, PushMessage message) {
        if (zoneKeys == null || zoneKeys.isEmpty()) {
            return;
        }

        List<PushDevice> devices = pushDeviceRepository.findByZoneKeyInAndNotificationsEnabledTrue(zoneKeys);

        if (devices.isEmpty()) {
            log.info("No web push devices found for zones={}", zoneKeys);
            return;
        }

        for (PushDevice device : devices) {
            sendToDevice(device, message);
        }
    }

    private void sendToDevice(PushDevice device, PushMessage message) {
        try {
            Map<String, Object> payloadMap = new LinkedHashMap<>();
            payloadMap.put("type", message.getType());
            payloadMap.put("title", message.getTitle());
            payloadMap.put("body", message.getBody());

            if (message.getReferenceId() != null) {
                payloadMap.put("referenceId", message.getReferenceId());
            }

            if (message.getReferenceType() != null) {
                payloadMap.put("referenceType", message.getReferenceType());
            }

            String payload = objectMapper.writeValueAsString(payloadMap);

            Subscription subscription = new Subscription(
                    device.getEndpoint(),
                    new Subscription.Keys(device.getP256dh(), device.getAuth()));

            Notification notification = new Notification(subscription, payload);

            PushService pushService = new PushService()
                    .setSubject(subject)
                    .setPublicKey(Utils.loadPublicKey(publicKey))
                    .setPrivateKey(Utils.loadPrivateKey(privateKey));

            HttpResponse response = pushService.send(notification);
            int statusCode = response.getStatusLine().getStatusCode();

            if (statusCode >= 200 && statusCode < 300) {
                log.info("Web push sent successfully. endpoint={} status={}", device.getEndpoint(), statusCode);
            } else {
                log.warn("Web push failed. endpoint={} status={}", device.getEndpoint(), statusCode);

                if (statusCode == 404 || statusCode == 410) {
                    disableDevice(device);
                }
            }

        } catch (Exception e) {
            log.error("Error sending web push to endpoint={}: {}", device.getEndpoint(), e.getMessage(), e);
        }
    }

    private void disableDevice(PushDevice device) {
        device.setNotificationsEnabled(false);
        pushDeviceRepository.save(device);
        log.info("Disabled web push device for endpoint={}", device.getEndpoint());
    }
}