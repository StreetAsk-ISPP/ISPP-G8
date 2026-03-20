package com.streetask.app.report.payload.request;

import java.util.UUID;

import com.streetask.app.model.enums.QuestionReportReason;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateQuestionReportRequest {

    @NotNull(message = "questionId is required")
    private UUID questionId;

    @NotNull(message = "reason is required")
    private QuestionReportReason reason;

    @Size(max = 500, message = "description must be at most 500 characters")
    private String description;
}
