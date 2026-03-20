package com.streetask.app.report;

import java.time.LocalDateTime;

import com.streetask.app.model.BaseEntity;
import com.streetask.app.model.Question;
import com.streetask.app.model.enums.QuestionReportReason;
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
@Table(name = "question_reports", uniqueConstraints = {
        @UniqueConstraint(name = "uk_question_report_reporter_question", columnNames = { "reporter_id", "question_id" })
})
@Getter
@Setter
public class QuestionReport extends BaseEntity {

    @ManyToOne(optional = false)
    @JoinColumn(name = "reporter_id")
    private RegularUser reporter;

    @ManyToOne(optional = false)
    @JoinColumn(name = "question_id")
    private Question question;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestionReportReason reason;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private LocalDateTime createdAt;
}
