package com.streetask.app.functionalities.notifications.push.repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.streetask.app.functionalities.notifications.push.model.PushDevice;

public interface PushDeviceRepository extends JpaRepository<PushDevice, UUID> {

    Optional<PushDevice> findByPushToken(String pushToken);

    List<PushDevice> findByZoneKeyInAndNotificationsEnabledTrue(Set<String> zoneKeys);

    List<PushDevice> findByUserEmailAndNotificationsEnabledTrue(String email);
}