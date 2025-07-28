package com.example.server.dto;

import com.example.server.models.ProjectStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ProjectDTO {
    private int id;
    private String name;
    private String description;
    private ProjectStatus status;
    private String ownerUsername;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ProjectDTO(int id, String name, ProjectStatus status, String ownerUsername, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.status = status;
        this.ownerUsername = ownerUsername;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public ProjectDTO(int id, String name, String description, ProjectStatus status, String ownerUsername, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.status = status;
        this.ownerUsername = ownerUsername;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
