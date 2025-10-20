package com.example.server.service.application.user;

import com.example.server.model.document.ChatMessage;
import com.example.server.repository.ChatRepository;
import com.example.server.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {
    private final ChatRepository chatRepository;
    private final ResourceRepository resourceRepository;
    @Override
    public List<ChatMessage> getMessages(int projectId, int userId) {
        if (!resourceRepository.existsByUserIdAndProjectId(userId, projectId)) {
            return List.of();
        }
        return chatRepository.findByProjectIdOrderBySentAtDesc(projectId);
    }
}
