package com.streetask.app.functionalities.notifications.push.service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

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

    @Value("${streetask.web-push.subject:mailto:streetask.notifications@gmail.com}")
    private String subject;

    @Value("${streetask.web-push.public-key:BCzmM4oFvgyIoji531RyMjAMxwSEcgRHivSvGBtDeP93MssCAQdfnZZlZ-24mpUMGlCRselBYpHj1onx9eHwqcQ}")
    private String publicKey;

    @Value("${streetask.web-push.private-key:xS6S6T2vAkW3mr43IsHOeb6J1DzkXA2AxcGn88z7uq8}")
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

        List<PushDevice> filteredDevices = filterDevicesByDistanceIfRequired(devices, message);

        if (filteredDevices.isEmpty()) {
            log.info("No web push devices found for zones={} after distance filtering", zoneKeys);
            return;
        }

        for (PushDevice device : filteredDevices) {
            sendToDevice(device, message);
        }
    }

    private List<PushDevice> filterDevicesByDistanceIfRequired(List<PushDevice> devices, PushMessage message) {
        if (devices == null || devices.isEmpty()) {
            return List.of();
        }

        Double questionLatitude = message.getQuestionLatitude();
        Double questionLongitude = message.getQuestionLongitude();
        Double radiusKm = message.getRadiusKm();

        if (questionLatitude == null || questionLongitude == null || radiusKm == null || radiusKm <= 0d) {
            return devices;
        }

        return devices.stream()
                .filter(device -> device.getLatitude() != null && device.getLongitude() != null)
                .filter(device -> haversineDistanceKm(
                        questionLatitude,
                        questionLongitude,
                        device.getLatitude(),
                        device.getLongitude()) <= radiusKm)
                .collect(Collectors.toList());
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

            if (message.getQuestionLatitude() != null) {
                payloadMap.put("questionLatitude", message.getQuestionLatitude());
            }
            if (message.getQuestionLongitude() != null) {
                payloadMap.put("questionLongitude", message.getQuestionLongitude());
            }
            if (message.getRadiusKm() != null) {
                payloadMap.put("radiusKm", message.getRadiusKm());
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

    private double haversineDistanceKm(double latitude1, double longitude1, double latitude2, double longitude2) {
        double lat1Radians = Math.toRadians(latitude1);
        double lon1Radians = Math.toRadians(longitude1);
        double lat2Radians = Math.toRadians(latitude2);
        double lon2Radians = Math.toRadians(longitude2);

        double latitudeDifference = lat2Radians - lat1Radians;
        double longitudeDifference = lon2Radians - lon1Radians;

        double a = Math.sin(latitudeDifference / 2d) * Math.sin(latitudeDifference / 2d)
                + Math.cos(lat1Radians) * Math.cos(lat2Radians)
                        * Math.sin(longitudeDifference / 2d) * Math.sin(longitudeDifference / 2d);
        double c = 2d * Math.atan2(Math.sqrt(a), Math.sqrt(1d - a));

        return 6371d * c;
    }
}