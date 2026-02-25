package com.streetask.app.user;

import java.util.UUID;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

public interface RegularUserRepository extends CrudRepository<RegularUser, UUID> {

    Optional<RegularUser> findById(UUID id);

}
