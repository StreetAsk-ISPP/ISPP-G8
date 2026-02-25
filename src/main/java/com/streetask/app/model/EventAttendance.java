package com.streetask.app.model;

import java.time.LocalDateTime;

import com.streetask.app.user.RegularUser;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "event_attendances", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "regular_user_id", "event_id" })
})
@Getter
@Setter
public class EventAttendance extends BaseEntity {

    @ManyToOne(optional = false)
    @JoinColumn(name = "regular_user_id")
    private RegularUser regularUser;

    @ManyToOne(optional = false)
    @JoinColumn(name = "event_id")
    private Event event;

    private Boolean isAttending;

    private LocalDateTime confirmedAt;
}
