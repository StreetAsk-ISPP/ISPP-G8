package com.streetask.app.report;

import java.util.UUID;

import org.springframework.data.repository.CrudRepository;

public interface QuestionReportRepository extends CrudRepository<QuestionReport, UUID> {

    boolean existsByReporterIdAndQuestionId(UUID reporterId, UUID questionId);
}
