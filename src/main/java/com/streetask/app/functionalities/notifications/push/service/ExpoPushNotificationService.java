package com.streetask.app.functionalities.notifications.push.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.streetask.app.functionalities.notifications.push.dto.ExpoPushRequest;
import com.streetask.app.functionalities.notifications.push.dto.ExpoPushResponse;
import com.streetask.app.functionalities.notifications.push.dto.ExpoPushTicket;
import com.streetask.app.functionalities.notifications.push.dto.PushMessage;
import com.streetask.app.functionalities.notifications.push.model.PushDevice;
import com.streetask.app.functionalities.notifications.push.repository.PushDeviceRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Primary
@RequiredArgsConstructor
@Slf4j
public class ExpoPushNotificationService implements PushNotificationService {

    private static final String EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

    private final PushDeviceRepository pushDeviceRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public void sendToUser(String email, PushMessage message) {
        List<PushDevice> devices = pushDeviceRepository.findByUserEmailAndNotificationsEnabledTrue(email);

        if (devices.isEmpty()) {
            log.info("No push devices found for user email={}", email);
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
            log.info("No push devices found for zones={}", zoneKeys);
            return;
        }

        for (PushDevice device : devices) {
            sendToDevice(device, message);
        }
    }

    private void sendToDevice(PushDevice device, PushMessage message) {
        String token = device.getPushToken();

        if (!isExpoPushToken(token)) {
            log.warn("Skipping non-Expo token for deviceId={} token={}", device.getId(), token);
            return;
        }

        Map<String, Object> data = new HashMap<>();
        data.put("type", message.getType());
        data.put("referenceId", message.getReferenceId());
        data.put("referenceType", message.getReferenceType());

        ExpoPushRequest requestBody = ExpoPushRequest.builder()
                .to(token)
                .title(message.getTitle())
                .body(message.getBody())
                .sound("default")
                .data(data)
                .build();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));

        HttpEntity<ExpoPushRequest> request = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<ExpoPushResponse> response = restTemplate.postForEntity(EXPO_PUSH_URL, request,
                    ExpoPushResponse.class);

            ExpoPushResponse body = response.getBody();
            if (body == null || body.getData() == null || body.getData().isEmpty()) {
                log.warn("Expo push returned empty response for token={}", token);
                return;
            }

            for (ExpoPushTicket ticket : body.getData()) {
                if ("ok".equalsIgnoreCase(ticket.getStatus())) {
                    log.info("Expo push accepted. token={} ticketId={}", token, ticket.getId());
                } else {
                    log.warn("Expo push rejected. token={} status={} message={} error={}",
                            token,
                            ticket.getStatus(),
                            ticket.getMessage(),
                            ticket.getDetails() != null ? ticket.getDetails().getError() : null);

                    handleTicketError(device, ticket);
                }
            }
        } catch (Exception e) {
            log.error("Error sending Expo push to token={}: {}", token, e.getMessage(), e);
        }
    }

    private void handleTicketError(PushDevice device, ExpoPushTicket ticket) {
        String error = ticket.getDetails() != null ? ticket.getDetails().getError() : null;

        if ("DeviceNotRegistered".equals(error)) {
            device.setNotificationsEnabled(false);
            pushDeviceRepository.save(device);
            log.info("Disabled push device {} because Expo reported DeviceNotRegistered", device.getId());
        }
    }

    private boolean isExpoPushToken(String token) {
        return token != null &&
                (token.startsWith("ExponentPushToken[") || token.startsWith("ExpoPushToken["));
    }
}