package com.streetask.app.report;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.streetask.app.exceptions.AccessDeniedException;
import com.streetask.app.model.Question;
import com.streetask.app.model.enums.QuestionReportReason;
import com.streetask.app.question.QuestionService;
import com.streetask.app.user.RegularUser;
import com.streetask.app.user.RegularUserRepository;

@Service
public class QuestionReportService {

    private final QuestionReportRepository questionReportRepository;
    private final QuestionService questionService;
    private final RegularUserRepository regularUserRepository;

    @Autowired
    public QuestionReportService(QuestionReportRepository questionReportRepository, QuestionService questionService,
            RegularUserRepository regularUserRepository) {
        this.questionReportRepository = questionReportRepository;
        this.questionService = questionService;
        this.regularUserRepository = regularUserRepository;
    }

    @Transactional
    public QuestionReport createQuestionReport(UUID questionId, QuestionReportReason reason, String description) {
        RegularUser reporter = getAuthenticatedRegularUser();
        Question question = questionService.findQuestion(questionId);

        // Validar duplicados antes de verificar el creador
        if (questionReportRepository.existsByReporterIdAndQuestionId(reporter.getId(), questionId)) {
            throw new IllegalStateException("You have already reported this question.");
        }

        if (question.getCreator() != null && reporter.getId() != null
                && reporter.getId().equals(question.getCreator().getId())) {
            throw new AccessDeniedException("You cannot report your own question.");
        }

        QuestionReport report = new QuestionReport();
        report.setReporter(reporter);
        report.setQuestion(question);
        report.setReason(reason);
        report.setDescription(normalizeDescription(description));
        report.setCreatedAt(LocalDateTime.now(ZoneOffset.UTC));

        return questionReportRepository.save(report);
    }

    private RegularUser getAuthenticatedRegularUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null || auth.getName().isBlank()) {
            throw new AccessDeniedException("Only authenticated regular users can report questions.");
        }

        String identifier = auth.getName().trim();
        return regularUserRepository.findByEmail(identifier)
                .or(() -> regularUserRepository.findByUserNameIgnoreCase(identifier))
                .orElseThrow(() -> new AccessDeniedException("Only regular users can report questions."));
    }

    private String normalizeDescription(String description) {
        if (description == null) {
            return null;
        }

        String trimmed = description.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
