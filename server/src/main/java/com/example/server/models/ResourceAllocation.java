package com.example.server.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResourceAllocation {
    @EmbeddedId
    private ResourceAllocationPK id;
    @ManyToOne
    @MapsId("resourceId")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Resource resource;
    @ManyToOne
    @MapsId("taskId")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Task task;
}
