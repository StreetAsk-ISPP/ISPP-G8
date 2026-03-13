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
        validateSubscription(request);

        String currentUserEmail = getCurrentUserEmail();
        RegularUser user = regularUserRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found"));

        PushDevice device = pushDeviceRepository.findByEndpoint(request.getEndpoint())
                .orElseGet(PushDevice::new);

        device.setUser(user);
        device.setEndpoint(request.getEndpoint());
        device.setP256dh(request.getP256dh());
        device.setAuth(request.getAuth());
        device.setZoneKey(request.getZoneKey());
        device.setNotificationsEnabled(true);
        device.setLastSeenAt(LocalDateTime.now());

        pushDeviceRepository.save(device);
    }

    @Transactional
    public void updateDeviceZone(UpdatePushDeviceZoneRequest request) {
        validateEndpoint(request.getEndpoint());

        PushDevice device = pushDeviceRepository.findByEndpoint(request.getEndpoint())
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
        validateEndpoint(request.getEndpoint());

        PushDevice device = pushDeviceRepository.findByEndpoint(request.getEndpoint())
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

    private void validateSubscription(RegisterPushDeviceRequest request) {
        validateEndpoint(request.getEndpoint());

        if (request.getP256dh() == null || request.getP256dh().isBlank()) {
            throw new IllegalArgumentException("p256dh is required");
        }

        if (request.getAuth() == null || request.getAuth().isBlank()) {
            throw new IllegalArgumentException("auth is required");
        }
    }

    private void validateEndpoint(String endpoint) {
        if (endpoint == null || endpoint.isBlank()) {
            throw new IllegalArgumentException("Endpoint is required");
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