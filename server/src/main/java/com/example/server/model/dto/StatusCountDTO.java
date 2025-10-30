package com.example.server.model.dto;

import com.example.server.model.enums.ProjectStatus;
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
