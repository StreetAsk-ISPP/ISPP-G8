package com.streetask.app.auth;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.streetask.app.user.User;

public interface PasswordResetTokenRepository extends CrudRepository<PasswordResetToken, java.util.UUID> {

    Optional<PasswordResetToken> findByToken(String token);

    void deleteByUser(User user);
}
