package com.example.server.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ProjectStatisticsDTO {
    private List<StatusCountDTO> statusCounts;

    public ProjectStatisticsDTO(List<StatusCountDTO> statusCounts) {
        this.statusCounts = statusCounts;
    }
}
