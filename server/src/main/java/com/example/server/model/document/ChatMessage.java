package com.example.server.model.document;

import jakarta.persistence.Id;
import lombok.*;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Document(collection = "chat_messages")
@CompoundIndex(name = "project_sentAt_idx", def = "{'projectId': 1, 'sentAt': 1}")
public class ChatMessage {
    @Id
    private String id;
    private String content;
    private String sender;
    private int projectId;
    private Instant sentAt;
}
