package com.streetask.app.user;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

public interface UsuarioAPieRepository extends CrudRepository<UsuarioAPie, Integer> {

    Optional<UsuarioAPie> findById(Integer id);

}
