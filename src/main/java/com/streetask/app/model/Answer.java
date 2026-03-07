package com.streetask.app.model;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
@Table(name = "answers")
@Getter
@Setter
public class Answer extends BaseEntity {

    @ManyToOne(optional = false)
    @JoinColumn(name = "question_id")
    @JsonBackReference("question-answers")
    private Question question;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    @JsonBackReference("user-answers")
    private RegularUser user;

    private String content;

    private Boolean isVerified;

    private OffsetDateTime verifiedAt;

    private Integer coinsEarned;

    @Embedded
    private GeoPoint userLocation;

    private OffsetDateTime createdAt;

    private Integer upvotes;

    private Integer downvotes;

    @OneToMany(mappedBy = "answer")
    private List<AnswerVote> votes;
}
