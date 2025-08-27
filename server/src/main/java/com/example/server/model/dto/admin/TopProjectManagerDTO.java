package com.example.server.model.dto.admin;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class TopProjectManagerDTO {
    private String username;
    private Long projectCount;

    public TopProjectManagerDTO(String username, Long projectCount) {
        this.username = username;
        this.projectCount = projectCount;
    }
}
