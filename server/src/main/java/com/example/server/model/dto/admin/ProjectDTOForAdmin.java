package com.example.server.model.dto.admin;

import com.example.server.model.enums.ProjectStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ProjectDTOForAdmin {
    private int id;
    private String owner;
    private ProjectStatus status;
    private String currency;
    private long taskCount;
    private long resourceCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ProjectDTOForAdmin(int id, String owner, ProjectStatus status, String currency, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.owner = owner;
        this.status = status;
        this.currency = currency;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
