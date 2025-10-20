package com.example.server.controller.user;

import com.example.server.model.document.ChatMessage;
import com.example.server.service.application.user.ChatService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController("ChatForREST")
@RequestMapping("api/v1/user/projects/{id}/chat")
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;
    @GetMapping("/messages")
    public ResponseEntity<List<ChatMessage>> getMessages(
            @PathVariable(name = "id") int projectId,
            HttpServletRequest request
            ) {
        int userIdExtractedFromJWT = (int) request.getAttribute("userId");
        List<ChatMessage> messages = chatService.getMessages(projectId, userIdExtractedFromJWT);
        return ResponseEntity.ok(messages);
    }
}
