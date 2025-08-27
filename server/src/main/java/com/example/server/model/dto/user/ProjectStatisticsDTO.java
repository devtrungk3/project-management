package com.example.server.model.dto.user;

import com.example.server.model.dto.StatusCountDTO;
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
