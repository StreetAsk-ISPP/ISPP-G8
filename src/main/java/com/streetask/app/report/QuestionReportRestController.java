package com.streetask.app.report;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.streetask.app.auth.payload.response.MessageResponse;
import com.streetask.app.report.payload.request.CreateQuestionReportRequest;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/reports")
@SecurityRequirement(name = "bearerAuth")
public class QuestionReportRestController {

    private final QuestionReportService questionReportService;

    @Autowired
    public QuestionReportRestController(QuestionReportService questionReportService) {
        this.questionReportService = questionReportService;
    }

    @PostMapping("/questions")
    public ResponseEntity<?> reportQuestion(@Valid @RequestBody CreateQuestionReportRequest request) {
        try {
            questionReportService.createQuestionReport(request.getQuestionId(), request.getReason(),
                    request.getDescription());
            return new ResponseEntity<>(new MessageResponse("Question reported successfully."), HttpStatus.CREATED);
        } catch (IllegalStateException ex) {
            return new ResponseEntity<>(new MessageResponse(ex.getMessage()), HttpStatus.CONFLICT);
        }
    }
}
