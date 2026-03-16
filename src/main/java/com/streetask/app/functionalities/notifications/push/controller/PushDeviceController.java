package com.streetask.app.functionalities.notifications.push.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.streetask.app.functionalities.notifications.push.dto.RegisterPushDeviceRequest;
import com.streetask.app.functionalities.notifications.push.dto.UnregisterPushDeviceRequest;
import com.streetask.app.functionalities.notifications.push.dto.UpdatePushDeviceZoneRequest;
import com.streetask.app.functionalities.notifications.push.service.PushDeviceService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/push-devices")
@RequiredArgsConstructor
public class PushDeviceController {

    private final PushDeviceService pushDeviceService;

    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody RegisterPushDeviceRequest request) {
        pushDeviceService.registerDevice(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/zone")
    public ResponseEntity<Void> updateZone(@RequestBody UpdatePushDeviceZoneRequest request) {
        pushDeviceService.updateDeviceZone(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/unregister")
    public ResponseEntity<Void> unregister(@RequestBody UnregisterPushDeviceRequest request) {
        pushDeviceService.unregisterDevice(request);
        return ResponseEntity.ok().build();
    }
}