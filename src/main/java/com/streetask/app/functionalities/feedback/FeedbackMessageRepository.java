package com.streetask.app.functionalities.feedback;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedbackMessageRepository extends JpaRepository<FeedbackMessage, UUID> {

    List<FeedbackMessage> findAllByOrderByCreatedAtDesc();
}
