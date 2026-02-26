package com.streetask.app.user;

import com.streetask.app.model.UserLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repositorio para gestionar ubicaciones de usuarios.
 */
@Repository
public interface UserLocationRepository extends JpaRepository<UserLocation, UUID> {

    /**
     * Obtiene la ubicación más reciente de un usuario específico
     */
    Optional<UserLocation> findFirstByUserIdOrderByTimestampDesc(UUID userId);

    /**
     * Obtiene todas las ubicaciones públicas más recientes (últimas 100)
     */
    @Query("SELECT ul FROM UserLocation ul WHERE ul.isPublic = true ORDER BY ul.timestamp DESC LIMIT 100")
    List<UserLocation> findPublicLocations();

    /**
     * Obtiene ubicaciones públicas dentro de un rango de tiempo
     */
    @Query("SELECT ul FROM UserLocation ul WHERE ul.isPublic = true AND ul.timestamp >= :since ORDER BY ul.timestamp DESC")
    List<UserLocation> findPublicLocationsSince(@Param("since") LocalDateTime since);

    /**
     * Obtiene todas las ubicaciones de un usuario (ordenadas por fecha descendente)
     */
    List<UserLocation> findByUserIdOrderByTimestampDesc(UUID userId);
}
