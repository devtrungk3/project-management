package com.example.server.controller.chat;

import com.example.server.model.document.ChatMessage;
import com.example.server.model.dto.UserDTO;
import com.example.server.repository.ChatRepository;
import com.example.server.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.MessagingException;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.time.Instant;
import java.util.UUID;

@Controller("ChatForWebsocket")
@RequiredArgsConstructor
public class ChatController {
    private final ResourceRepository resourceRepository;
    private final ChatRepository chatRepository;
    @MessageMapping("/chat/{projectId}/send")
    @SendTo("/topic/chat/{projectId}")
    public ChatMessage sendMessage(@DestinationVariable int projectId, @Payload ChatMessage message, Principal principal) {
        UserDTO user = (UserDTO) ((UsernamePasswordAuthenticationToken) principal).getPrincipal();
        if (!resourceRepository.existsByUserIdAndProjectId(user.getId(), projectId)) {
            throw new MessagingException("User" + user.getId() + " is not authorized to access project " + projectId + " chat room");
        }
        message.setId(UUID.randomUUID().toString());
        message.setSentAt(Instant.now());
        message.setProjectId(projectId);
        return chatRepository.save(message);
    }
}
