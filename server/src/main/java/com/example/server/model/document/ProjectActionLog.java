package com.example.server.model.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Document(collection = "project_action_log")
@CompoundIndex(name = "project_createdAt_idx", def = "{'project_id': 1, 'createdAt': 1}")
public class ProjectActionLog {
    @Id
    private String id;
    private Integer projectId;
    private String actionType;
    private Actor actor;
    private String description;
    private Instant createdAt;
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Actor {
        private Integer userId;
        private String username;
    }
}
