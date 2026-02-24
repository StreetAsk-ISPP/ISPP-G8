package com.streetask.app.user;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

public interface CuentaEmpresaRepository extends CrudRepository<CuentaEmpresa, Integer> {

    Optional<CuentaEmpresa> findById(Integer id);

    Optional<CuentaEmpresa> findByCif(String cif);

    Boolean existsByCif(String cif);

}
