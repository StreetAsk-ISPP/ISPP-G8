package com.streetask.app.report;

import java.time.LocalDateTime;

import com.streetask.app.model.Answer;
import com.streetask.app.model.BaseEntity;
import com.streetask.app.model.enums.AnswerReportReason;
import com.streetask.app.user.RegularUser;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "answer_reports", uniqueConstraints = {
        @UniqueConstraint(name = "uk_answer_report_reporter_answer", columnNames = { "reporter_id", "answer_id" })
})
@Getter
@Setter
public class AnswerReport extends BaseEntity {

    @ManyToOne(optional = false)
    @JoinColumn(name = "reporter_id")
    private RegularUser reporter;

    @ManyToOne(optional = false)
    @JoinColumn(name = "answer_id")
    private Answer answer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AnswerReportReason reason;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private LocalDateTime createdAt;
}
