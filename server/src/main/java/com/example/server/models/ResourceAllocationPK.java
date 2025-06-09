package com.example.server.models;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Objects;

@NoArgsConstructor
@AllArgsConstructor
public class ResourceAllocationPK implements Serializable {
    private int resourceId;
    private int taskId;

    @Override
    public boolean equals(Object obj) {
        if (obj == this) return true;
        if (!(obj instanceof ResourceAllocationPK)) return false;
        ResourceAllocationPK o = (ResourceAllocationPK) obj;
        return Objects.equals(resourceId, o.resourceId) && Objects.equals(taskId, o.taskId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(resourceId, taskId);
    }
}
