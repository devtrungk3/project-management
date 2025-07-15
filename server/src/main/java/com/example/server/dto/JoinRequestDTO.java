package com.example.server.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@NoArgsConstructor
public class JoinRequestDTO {
    private int id;
    private String username;
    private int projectId;
    private String projectName;
    private String ownerUsername;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    public JoinRequestDTO(int id, String username, int projectId, String projectName, String status, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.username = username;
        this.projectId = projectId;
        this.projectName = projectName;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public JoinRequestDTO(int id, int projectId, String projectName, String ownerUsername, String status, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.projectId = projectId;
        this.projectName = projectName;
        this.ownerUsername = ownerUsername;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
