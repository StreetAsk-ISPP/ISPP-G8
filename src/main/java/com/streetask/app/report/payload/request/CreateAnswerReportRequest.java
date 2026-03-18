package com.streetask.app.report.payload.request;

import java.util.UUID;

import com.streetask.app.model.enums.AnswerReportReason;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateAnswerReportRequest {

    @NotNull(message = "answerId is required")
    private UUID answerId;

    @NotNull(message = "reason is required")
    private AnswerReportReason reason;

    @Size(max = 500, message = "description must be at most 500 characters")
    private String description;
}
