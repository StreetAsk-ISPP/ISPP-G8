package com.streetask.app.functionalities.feedback;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.micrometer.common.lang.NonNull;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/feedback")
@Validated
public class FeedbackMessageController {

    private final FeedbackMessageService feedbackMessageService;

    public FeedbackMessageController(FeedbackMessageService feedbackMessageService) {
        this.feedbackMessageService = feedbackMessageService;
    }

    @PostMapping
    public ResponseEntity<FeedbackMessage> createFeedback(@Valid @RequestBody FeedbackMessageRequest request) {
        FeedbackMessage createdFeedback = feedbackMessageService.createFeedback(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdFeedback);
    }

    @GetMapping
    public ResponseEntity<Iterable<FeedbackMessage>> getFeedbackMessages() {
        Iterable<FeedbackMessage> feedbackMessages = feedbackMessageService.findAllOrderedByCreatedAtDesc();
        return ResponseEntity.ok(feedbackMessages);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FeedbackMessage> getFeedbackMessageById(@PathVariable @NonNull UUID id) {
        FeedbackMessage feedbackMessage = feedbackMessageService.findById(id);
        return ResponseEntity.ok(feedbackMessage);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFeedbackMessage(@PathVariable UUID id) {
        feedbackMessageService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}