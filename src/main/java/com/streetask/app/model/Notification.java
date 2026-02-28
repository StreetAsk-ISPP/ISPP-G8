package com.streetask.app.model;

import java.time.LocalDateTime;
import java.util.UUID;

import com.streetask.app.model.enums.NotificationType;
import com.streetask.app.user.RegularUser;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "notifications")
@Getter
@Setter
public class Notification extends BaseEntity {

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private RegularUser user;

    @Enumerated(EnumType.STRING)
    private NotificationType type;

    private String content;

    private UUID referenceId;

    private String referenceType;

    private LocalDateTime sentAt;
}
