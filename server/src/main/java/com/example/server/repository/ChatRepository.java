package com.example.server.repository;

import com.example.server.model.document.ChatMessage;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ChatRepository extends MongoRepository<ChatMessage, String> {
    List<ChatMessage> findByProjectIdOrderBySentAtDesc(int projectId);
}