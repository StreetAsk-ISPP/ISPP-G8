package com.streetask.app.user;

import com.streetask.app.auth.payload.response.MessageResponse;
import com.streetask.app.model.UserLocation;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.annotation.security.PermitAll;
import jakarta.validation.Valid;

import java.time.LocalDateTime;
import java.util.List;

/**
 * REST Controller para gestionar ubicaciones de usuarios
 */
@RestController
@RequestMapping("/api/v1/locations")
@AllArgsConstructor
public class UserLocationRestController {

    private final UserLocationService locationService;
    private final UserService userService;

    /**
     * Publica la ubicación actual del usuario autenticado
     */
    @PostMapping("/publish")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<UserLocation> publishLocation(@RequestBody @Valid UserLocationDTO locationDTO) {
        User currentUser = userService.findCurrentUser();
        UserLocation saved = locationService.saveUserLocation(currentUser, locationDTO);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    /**
     * Obtiene la ubicación más reciente del usuario autenticado
     */
    @GetMapping("/me")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<UserLocation> getMyLocation() {
        User currentUser = userService.findCurrentUser();
        return locationService.getUserLatestLocation(currentUser.getId())
                .map(location -> new ResponseEntity<>(location, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Obtiene todas las ubicaciones públicas (últimas 100)
     */
    @GetMapping("/public")
    @PermitAll
    public ResponseEntity<List<UserLocation>> getPublicLocations() {
        List<UserLocation> locations = locationService.getPublicLocations();
        return new ResponseEntity<>(locations, HttpStatus.OK);
    }

    /**
     * Obtiene ubicaciones públicas desde una fecha específica
     * @param minutesSince número de minutos desde ahora
     */
    @GetMapping("/public/since")
    @PermitAll
    public ResponseEntity<List<UserLocation>> getPublicLocationsSince(
            @RequestParam(required = false, defaultValue = "10") Integer minutesSince) {
        List<UserLocation> locations = locationService.getPublicLocationsSince(minutesSince);
        return new ResponseEntity<>(locations, HttpStatus.OK);
    }

    /**
     * Obtiene la ubicación más reciente de un usuario específico (solo si es pública)
     */
    @GetMapping("/user/{userId}")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<UserLocation> getUserLocation(@PathVariable Integer userId) {
        return locationService.getUserLatestPublicLocation(userId)
                .map(location -> new ResponseEntity<>(location, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Cambia la privacidad de la ubicación actual del usuario
     */
    @PutMapping("/toggle-privacy")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<UserLocation> togglePrivacy() {
        User currentUser = userService.findCurrentUser();
        UserLocation updated = locationService.toggleLocationPrivacy(currentUser.getId());
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    /**
     * Elimina la ubicación del usuario autenticado
     */
    @DeleteMapping("/me")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<MessageResponse> deleteMyLocation() {
        User currentUser = userService.findCurrentUser();
        locationService.deleteUserLocation(currentUser.getId());
        return new ResponseEntity<>(new MessageResponse("Location deleted!"), HttpStatus.OK);
    }
}
