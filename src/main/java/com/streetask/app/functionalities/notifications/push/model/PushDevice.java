package com.streetask.app.functionalities.notifications.push.model;

import java.time.LocalDateTime;

import com.streetask.app.model.BaseEntity;
import com.streetask.app.user.RegularUser;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "push_devices")
@Getter
@Setter
public class PushDevice extends BaseEntity {

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private RegularUser user;

    @Column(nullable = false, unique = true, length = 500)
    private String pushToken;

    @Column(length = 30)
    private String platform;

    @Column(length = 100)
    private String zoneKey;

    @Column(nullable = false)
    private Boolean notificationsEnabled = true;

    private LocalDateTime lastSeenAt;
}