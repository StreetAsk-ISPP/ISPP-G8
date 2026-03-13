package com.streetask.app.functionalities.notifications.push.service;

import java.util.Set;

import com.streetask.app.functionalities.notifications.push.dto.PushMessage;

public interface PushNotificationService {

    void sendToUser(String email, PushMessage message);

    void sendToZones(Set<String> zoneKeys, PushMessage message);
}