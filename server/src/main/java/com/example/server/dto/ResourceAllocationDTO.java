package com.example.server.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class ResourceAllocationDTO {
    private int taskId;
    private int resourceId;
    private String username;

    public ResourceAllocationDTO(int taskId, int resourceId, String username) {
        this.taskId = taskId;
        this.resourceId = resourceId;
        this.username = username;
    }
}
