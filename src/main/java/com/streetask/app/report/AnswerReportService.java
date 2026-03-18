package com.streetask.app.report;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.streetask.app.answer.AnswerService;
import com.streetask.app.exceptions.AccessDeniedException;
import com.streetask.app.model.Answer;
import com.streetask.app.model.enums.AnswerReportReason;
import com.streetask.app.user.RegularUser;
import com.streetask.app.user.RegularUserRepository;

@Service
public class AnswerReportService {

    private final AnswerReportRepository answerReportRepository;
    private final AnswerService answerService;
    private final RegularUserRepository regularUserRepository;

    @Autowired
    public AnswerReportService(AnswerReportRepository answerReportRepository, AnswerService answerService,
            RegularUserRepository regularUserRepository) {
        this.answerReportRepository = answerReportRepository;
        this.answerService = answerService;
        this.regularUserRepository = regularUserRepository;
    }

    @Transactional
    public AnswerReport createAnswerReport(UUID answerId, AnswerReportReason reason, String description) {
        RegularUser reporter = getAuthenticatedRegularUser();
        Answer answer = answerService.findAnswer(answerId);

        if (answerReportRepository.existsByReporterIdAndAnswerId(reporter.getId(), answerId)) {
            throw new IllegalStateException("You have already reported this answer.");
        }

        AnswerReport report = new AnswerReport();
        report.setReporter(reporter);
        report.setAnswer(answer);
        report.setReason(reason);
        report.setDescription(normalizeDescription(description));
        report.setCreatedAt(LocalDateTime.now(ZoneOffset.UTC));

        return answerReportRepository.save(report);
    }

    private RegularUser getAuthenticatedRegularUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null || auth.getName().isBlank()) {
            throw new AccessDeniedException("Only authenticated regular users can report answers.");
        }

        String identifier = auth.getName().trim();
        return regularUserRepository.findByEmail(identifier)
                .or(() -> regularUserRepository.findByUserNameIgnoreCase(identifier))
                .orElseThrow(() -> new AccessDeniedException("Only regular users can report answers."));
    }

    private String normalizeDescription(String description) {
        if (description == null) {
            return null;
        }

        String trimmed = description.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
