package com.streetask.app.model;

import java.time.LocalDateTime;
import java.util.List;

import com.streetask.app.model.enums.EventCategory;
import com.streetask.app.user.BusinessAccount;

import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "events")
@Getter
@Setter
public class Event extends BaseEntity {

    @ManyToOne(optional = false)
    @JoinColumn(name = "creator_id")
    private BusinessAccount creator;

    private String title;

    private String description;

    private EventCategory category;

    @Embedded
    private GeoPoint location;

    private String address;

    private LocalDateTime startsAt;

    private LocalDateTime endsAt;

    private Boolean featured;

    private Integer attendeeCount;

    private Boolean active;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "event")
    private List<Question> questions;

    @OneToMany(mappedBy = "event")
    private List<EventAttendance> attendances;
}
