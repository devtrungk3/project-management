package com.example.server.service.application.user;

import com.example.server.model.document.ChatMessage;

import java.util.List;

public interface ChatService {
    List<ChatMessage> getMessages(int projectId, int userId);
}
