package com.example.server.config;

import com.example.server.model.dto.UserDTO;
import com.example.server.repository.ResourceRepository;
import com.example.server.service.security.JWTService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessagingException;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.regex.Pattern;

@Component
@RequiredArgsConstructor
public class SubscriptionInterceptor implements ChannelInterceptor {
    private final JWTService jwtService;
    private final ResourceRepository resourceRepository;
    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            authenticateUser(accessor);
        } else if (StompCommand.SUBSCRIBE.equals(accessor.getCommand())) {
            Authentication authentication = (Authentication) accessor.getSessionAttributes().get("user");
            if (authentication == null) {
                throw new MessagingException("Authentication required for subscription");
            }
            String destination = accessor.getDestination();
            if (!Pattern.compile("^/(topic|app)/chat/(\\d+)$").matcher(destination).matches()) {
                throw new MessagingException("Invalid destination: " + destination);
            }
            int projectId = Integer.parseInt(accessor.getDestination().split("/+")[3]);
            UserDTO user = (UserDTO) authentication.getPrincipal();

            if (!resourceRepository.existsByUserIdAndProjectId(user.getId(), projectId)) {
                throw new MessagingException("User" + user.getId() + " is not authorized to access project " + projectId + " chat room");
            }
        } else  {
            Authentication authentication = (Authentication) accessor.getSessionAttributes().get("user");
            if (authentication != null) {
                accessor.setUser(authentication);
            }
        }
        return MessageBuilder.createMessage(message.getPayload(), accessor.getMessageHeaders());
    }

    private void authenticateUser(StompHeaderAccessor accessor) {
        String token = accessor.getFirstNativeHeader("Authorization");
        if (token == null || !token.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Missing or invalid Authorization header");
        }
        try {
            String jwt = token.substring(7);
            int userId = jwtService.extractUserId(jwt);
            UserDTO user = new UserDTO();
            user.setId(userId);
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(user, null, List.of());
            accessor.getSessionAttributes().put("user", authentication);
        } catch (Exception e) {
            throw new MessagingException(e.getMessage());
        }
    }
}