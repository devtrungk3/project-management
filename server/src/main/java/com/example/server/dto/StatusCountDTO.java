package com.example.server.dto;

import com.example.server.models.ProjectStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StatusCountDTO {
    private ProjectStatus status;
    private Long count;

    public StatusCountDTO(ProjectStatus status, Long count) {
        this.status = status;
        this.count = count;
    }
}
