package com.streetask.app.report;

import java.util.UUID;

import org.springframework.data.repository.CrudRepository;

public interface AnswerReportRepository extends CrudRepository<AnswerReport, UUID> {

    boolean existsByReporterIdAndAnswerId(UUID reporterId, UUID answerId);
}
