package com.example.server.model.dto;

import com.example.server.model.entity.ProjectStatus;
import lombok.Getter;
import lombok.Setter;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

@Getter
@Setter
public class ProjectDTO implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;
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
