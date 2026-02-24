package com.streetask.app.user;

import com.streetask.app.model.UserLocation;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Servicio para gestionar ubicaciones de usuarios
 */
@Service
@AllArgsConstructor
public class UserLocationService {

    private final UserLocationRepository locationRepository;

    /**
     * Guarda la ubicación de un usuario
     */
    public UserLocation saveUserLocation(User user, UserLocationDTO locationDTO) {
        UserLocation location = new UserLocation();
        location.setUser(user);
        location.setLatitude(locationDTO.getLatitude());
        location.setLongitude(locationDTO.getLongitude());
        location.setAccuracy(locationDTO.getAccuracy());
        location.setIsPublic(locationDTO.getIsPublic() != null ? locationDTO.getIsPublic() : false);
        location.setTimestamp(LocalDateTime.now());
        return locationRepository.save(location);
    }

    /**
     * Obtiene la ubicación más reciente de un usuario
     */
    public Optional<UserLocation> getUserLatestLocation(Integer userId) {
        return locationRepository.findFirstByUserIdOrderByTimestampDesc(userId);
    }

    /**
     * Obtiene la ubicación más reciente pública de un usuario
     */
    public Optional<UserLocation> getUserLatestPublicLocation(Integer userId) {
        return getUserLatestLocation(userId)
                .filter(location -> location.getIsPublic() != null && location.getIsPublic());
    }

    /**
     * Obtiene todas las ubicaciones públicas
     */
    public List<UserLocation> getPublicLocations() {
        return locationRepository.findPublicLocations();
    }

    /**
     * Obtiene ubicaciones públicas desde un tiempo específico
     */
    public List<UserLocation> getPublicLocationsSince(Integer minutesSince) {
        LocalDateTime since = LocalDateTime.now().minusMinutes(minutesSince);
        return locationRepository.findPublicLocationsSince(since);
    }

    /**
     * Cambia la privacidad de la ubicación más reciente del usuario
     */
    public UserLocation toggleLocationPrivacy(Integer userId) {
        Optional<UserLocation> location = getUserLatestLocation(userId);
        if (location.isPresent()) {
            UserLocation userLocation = location.get();
            userLocation.setIsPublic(userLocation.getIsPublic() == null || !userLocation.getIsPublic());
            return locationRepository.save(userLocation);
        }
        throw new RuntimeException("No location found for user: " + userId);
    }

    /**
     * Elimina la ubicación más reciente del usuario
     */
    public void deleteUserLocation(Integer userId) {
        Optional<UserLocation> location = getUserLatestLocation(userId);
        location.ifPresent(locationRepository::delete);
    }

    /**
     * Obtiene todas las ubicaciones de un usuario
     */
    public List<UserLocation> getUserLocations(Integer userId) {
        return locationRepository.findByUserIdOrderByTimestampDesc(userId);
    }
}
