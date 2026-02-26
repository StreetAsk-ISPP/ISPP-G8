package com.streetask.app.user;

import java.util.UUID;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User, UUID> {

	// @Modifying
	// @Query("DELETE FROM Owner o WHERE o.user.email = :email")
	// void deleteOwnerOfUser(String email);
	//
	// @Modifying
	// @Query("DELETE FROM Pet p WHERE p.owner.id = :id")
	// public void deletePetsOfOwner(@Param("id") int id);

	Optional<User> findByEmail(String email);

	Boolean existsByEmail(String email);

	Boolean existsByUserName(String userName);

	Optional<User> findById(UUID id);

	@Query("SELECT u FROM User u WHERE u.authority.authority = :auth")
	Iterable<User> findAllByAuthority(String auth);

}
