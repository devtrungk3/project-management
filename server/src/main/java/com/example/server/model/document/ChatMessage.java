package com.example.server.model.document;

import jakarta.persistence.Id;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Document(collection = "chat_messages")
public class ChatMessage {
    @Id
    private String id;
    private String content;
    private String sender;
    private int projectId;
    private Instant sentAt;
}
