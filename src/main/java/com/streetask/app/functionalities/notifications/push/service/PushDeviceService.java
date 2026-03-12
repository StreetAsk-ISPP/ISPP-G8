package com.streetask.app.functionalities.notifications.push.service;

import java.time.LocalDateTime;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.streetask.app.functionalities.notifications.push.dto.RegisterPushDeviceRequest;
import com.streetask.app.functionalities.notifications.push.dto.UnregisterPushDeviceRequest;
import com.streetask.app.functionalities.notifications.push.dto.UpdatePushDeviceZoneRequest;
import com.streetask.app.functionalities.notifications.push.model.PushDevice;
import com.streetask.app.functionalities.notifications.push.repository.PushDeviceRepository;
import com.streetask.app.user.RegularUser;
import com.streetask.app.user.RegularUserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PushDeviceService {

    private final PushDeviceRepository pushDeviceRepository;
    private final RegularUserRepository regularUserRepository;

    @Transactional
    public void registerDevice(RegisterPushDeviceRequest request) {
        validateExpoPushToken(request.getPushToken());

        String currentUserEmail = getCurrentUserEmail();
        RegularUser user = regularUserRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found"));

        PushDevice device = pushDeviceRepository.findByPushToken(request.getPushToken())
                .orElseGet(PushDevice::new);

        device.setUser(user);
        device.setPushToken(request.getPushToken());
        device.setPlatform(request.getPlatform());
        device.setNotificationsEnabled(true);
        device.setLastSeenAt(LocalDateTime.now());

        pushDeviceRepository.save(device);
    }

    @Transactional
    public void updateDeviceZone(UpdatePushDeviceZoneRequest request) {
        validateExpoPushToken(request.getPushToken());

        PushDevice device = pushDeviceRepository.findByPushToken(request.getPushToken())
                .orElseThrow(() -> new IllegalArgumentException("Push device not found"));

        String currentUserEmail = getCurrentUserEmail();
        if (device.getUser() == null || device.getUser().getEmail() == null
                || !device.getUser().getEmail().equals(currentUserEmail)) {
            throw new IllegalArgumentException("Device does not belong to authenticated user");
        }

        device.setZoneKey(request.getZoneKey());
        device.setLastSeenAt(LocalDateTime.now());

        pushDeviceRepository.save(device);
    }

    @Transactional
    public void unregisterDevice(UnregisterPushDeviceRequest request) {
        validateExpoPushToken(request.getPushToken());

        PushDevice device = pushDeviceRepository.findByPushToken(request.getPushToken())
                .orElseThrow(() -> new IllegalArgumentException("Push device not found"));

        String currentUserEmail = getCurrentUserEmail();
        if (device.getUser() == null || device.getUser().getEmail() == null
                || !device.getUser().getEmail().equals(currentUserEmail)) {
            throw new IllegalArgumentException("Device does not belong to authenticated user");
        }

        device.setNotificationsEnabled(false);
        device.setLastSeenAt(LocalDateTime.now());

        pushDeviceRepository.save(device);
    }

    private void validateExpoPushToken(String pushToken) {
        if (pushToken == null || pushToken.isBlank()) {
            throw new IllegalArgumentException("Push token is required");
        }

        if (!pushToken.startsWith("ExponentPushToken[") && !pushToken.startsWith("ExpoPushToken[")) {
            throw new IllegalArgumentException("Invalid Expo push token");
        }
    }

    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || authentication.getName() == null || authentication.getName().isBlank()) {
            throw new IllegalArgumentException("No authenticated user found");
        }

        return authentication.getName();
    }
}