package com.streetask.app.report;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import com.streetask.app.exceptions.AccessDeniedException;
import com.streetask.app.model.Question;
import com.streetask.app.model.enums.QuestionReportReason;
import com.streetask.app.question.QuestionService;
import com.streetask.app.user.RegularUser;
import com.streetask.app.user.RegularUserRepository;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class QuestionReportServiceTest {

    @Mock
    private QuestionReportRepository questionReportRepository;

    @Mock
    private QuestionService questionService;

    @Mock
    private RegularUserRepository regularUserRepository;

    @InjectMocks
    private QuestionReportService questionReportService;

    private RegularUser reporter;
    private Question question;
    private UUID questionId;

    @BeforeEach
    void setUp() {
        questionId = UUID.randomUUID();

        reporter = new RegularUser();
        reporter.setId(UUID.randomUUID());
        reporter.setEmail("reporter@example.com");
        reporter.setUserName("reporter");

        question = new Question();
        question.setId(questionId);
        question.setTitle("Test question");
        question.setContent("Test content");

        // Configurar contexto de seguridad con usuario autenticado
        Authentication authentication = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(authentication.getName()).thenReturn(reporter.getEmail());
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        // Configurar repositorio para devolver el usuario reportante
        when(regularUserRepository.findByEmail(reporter.getEmail())).thenReturn(Optional.of(reporter));
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void createQuestionReport_shouldPersistReport() {
        RegularUser creator = new RegularUser();
        creator.setId(UUID.randomUUID());
        question.setCreator(creator);

        when(questionService.findQuestion(questionId)).thenReturn(question);
        when(questionReportRepository.existsByReporterIdAndQuestionId(reporter.getId(), questionId)).thenReturn(false);
        when(questionReportRepository.save(any(QuestionReport.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        QuestionReport result = questionReportService.createQuestionReport(questionId, QuestionReportReason.SPAM,
                "  details  ");

        ArgumentCaptor<QuestionReport> captor = ArgumentCaptor.forClass(QuestionReport.class);
        verify(questionReportRepository).save(captor.capture());

        QuestionReport saved = captor.getValue();
        assertEquals(reporter, saved.getReporter());
        assertEquals(question, saved.getQuestion());
        assertEquals(QuestionReportReason.SPAM, saved.getReason());
        assertEquals("details", saved.getDescription());
        assertNotNull(saved.getCreatedAt());
        assertTrue(saved.getCreatedAt().isBefore(LocalDateTime.now().plusSeconds(1)));
        assertEquals(saved, result);
    }

    @Test
    void createQuestionReport_shouldThrowOnDuplicate() {
        when(questionService.findQuestion(questionId)).thenReturn(question);
        when(questionReportRepository.existsByReporterIdAndQuestionId(reporter.getId(), questionId)).thenReturn(true);

        IllegalStateException ex = assertThrows(IllegalStateException.class,
                () -> questionReportService.createQuestionReport(questionId, QuestionReportReason.OFFENSIVE, "dup"));

        assertEquals("You have already reported this question.", ex.getMessage());
        verify(questionReportRepository, never()).save(any(QuestionReport.class));
    }

    @Test
    void createQuestionReport_shouldRejectOwnQuestion() {
        question.setCreator(reporter);
        when(questionService.findQuestion(questionId)).thenReturn(question);

        AccessDeniedException ex = assertThrows(AccessDeniedException.class,
                () -> questionReportService.createQuestionReport(questionId, QuestionReportReason.SPAM, "reason"));

        assertEquals("You cannot report your own question.", ex.getMessage());
        verify(questionReportRepository, never()).save(any(QuestionReport.class));
    }

    @Test
    void createQuestionReport_shouldRejectUnauthenticatedUser() {
        SecurityContextHolder.clearContext();

        assertThrows(AccessDeniedException.class,
                () -> questionReportService.createQuestionReport(questionId, QuestionReportReason.OTHER, null));

        verify(questionReportRepository, never()).save(any(QuestionReport.class));
    }
}
