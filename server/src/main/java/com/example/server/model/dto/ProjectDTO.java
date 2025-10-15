package com.example.server.model.dto;

import com.example.server.model.entity.Currency;
import com.example.server.model.entity.ProjectStatus;
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
    private float plannedBudget;
    private Currency currency;
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

    public ProjectDTO(int id, String name, String description, ProjectStatus status, String ownerUsername, float plannedBudget, Currency currency, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.status = status;
        this.ownerUsername = ownerUsername;
        this.plannedBudget = plannedBudget;
        this.currency = currency;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
