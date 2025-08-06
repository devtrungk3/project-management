package com.example.server.model.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.Objects;

@NoArgsConstructor
@AllArgsConstructor
@Embeddable
@Setter
@Getter
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
