package com.streetask.app.user;

import java.util.UUID;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface AuthoritiesRepository extends  CrudRepository<Authorities, UUID>{
	
	@Query("SELECT DISTINCT auth FROM Authorities auth WHERE auth.authority LIKE :authority%")
	Optional<Authorities> findByName(String authority);
	
}



