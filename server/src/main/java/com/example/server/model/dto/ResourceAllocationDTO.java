package com.example.server.model.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class ResourceAllocationDTO {
    private int taskId;
    private int resourceId;
    private String username;
    private int tagRateId;
    private String tagRateName;
    private float rate;

    public ResourceAllocationDTO(int taskId, int resourceId, String username) {
        this.taskId = taskId;
        this.resourceId = resourceId;
        this.username = username;
    }

    public ResourceAllocationDTO(int taskId, int resourceId, String username, Integer tagRateId, String tagRateName, Float rate) {
        this.taskId = taskId;
        this.resourceId = resourceId;
        this.username = username;
        this.tagRateId = tagRateId != null ? tagRateId : 0;
        this.tagRateName = tagRateName != null ? tagRateName : "";
        this.rate = rate != null ? rate : 0;
    }
}
