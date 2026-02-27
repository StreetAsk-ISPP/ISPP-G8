package com.streetask.app.model;

import java.time.LocalDateTime;
import java.util.List;

import com.streetask.app.user.RegularUser;

import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "questions")
@Getter
@Setter
public class Question extends BaseEntity {

    @ManyToOne(optional = false)
    @JoinColumn(name = "creator_id")
    private RegularUser creator;

    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;

    private String title;

    private String content;

    @Embedded
    private GeoPoint location;

    private Float radiusKm;

    private Boolean active;

    private LocalDateTime expiresAt;

    private LocalDateTime createdAt;

    private Integer answerCount;

    @OneToMany(mappedBy = "question")
    private List<Answer> answers;
}
