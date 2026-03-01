package com.streetask.app.configuration;

import java.security.Principal;
import java.util.List;

import org.springframework.lang.NonNull;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.streetask.app.configuration.jwt.JwtUtils;
import com.streetask.app.configuration.services.UserDetailsServiceImpl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketAuthChannelInterceptor implements ChannelInterceptor {

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtUtils jwtUtils;
    private final UserDetailsServiceImpl userDetailsService;

    @Override
    public Message<?> preSend(@NonNull Message<?> message, @NonNull MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        if (accessor == null || !StompCommand.CONNECT.equals(accessor.getCommand())) {
            return message;
        }

        Principal existingUser = accessor.getUser();
        if (existingUser != null) {
            return message;
        }

        String token = extractBearerToken(accessor);
        if (!StringUtils.hasText(token) || !jwtUtils.validateJwtToken(token)) {
            return message;
        }

        try {
            String username = jwtUtils.getUserNameFromJwtToken(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    userDetails,
                    null,
                    userDetails.getAuthorities());
            accessor.setUser(authentication);
        } catch (Exception ex) {
            log.warn("Unable to authenticate STOMP connection from JWT: {}", ex.getMessage());
        }

        return message;
    }

    private String extractBearerToken(StompHeaderAccessor accessor) {
        List<String> headers = accessor.getNativeHeader(AUTHORIZATION_HEADER);
        if (headers == null || headers.isEmpty()) {
            return null;
        }

        String rawHeader = headers.get(0);
        if (!StringUtils.hasText(rawHeader) || !rawHeader.startsWith(BEARER_PREFIX)) {
            return null;
        }

        return rawHeader.substring(BEARER_PREFIX.length()).trim();
    }
}
