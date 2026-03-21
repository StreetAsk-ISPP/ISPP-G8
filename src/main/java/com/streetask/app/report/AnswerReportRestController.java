package com.streetask.app.report;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.streetask.app.auth.payload.response.MessageResponse;
import com.streetask.app.report.payload.request.CreateAnswerReportRequest;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/reports")
@SecurityRequirement(name = "bearerAuth")
public class AnswerReportRestController {

    private final AnswerReportService answerReportService;

    @Autowired
    public AnswerReportRestController(AnswerReportService answerReportService) {
        this.answerReportService = answerReportService;
    }

    @PostMapping("/answers")
    public ResponseEntity<?> reportAnswer(@Valid @RequestBody CreateAnswerReportRequest request) {
        try {
            answerReportService.createAnswerReport(request.getAnswerId(), request.getReason(),
                    request.getDescription());
            return new ResponseEntity<>(new MessageResponse("Answer reported successfully."), HttpStatus.CREATED);
        } catch (IllegalStateException ex) {
            return new ResponseEntity<>(new MessageResponse(ex.getMessage()), HttpStatus.CONFLICT);
        }
    }
}
