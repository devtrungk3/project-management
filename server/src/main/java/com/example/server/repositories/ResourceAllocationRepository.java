package com.example.server.repositories;

import com.example.server.dto.ResourceAllocationDTO;
import com.example.server.models.ResourceAllocation;
import com.example.server.models.ResourceAllocationPK;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ResourceAllocationRepository extends JpaRepository<ResourceAllocation, ResourceAllocationPK> {
    @Query("""
            SELECT new com.example.server.dto.ResourceAllocationDTO(ra.task.id, ra.resource.id, ra.resource.user.username)
            FROM ResourceAllocation ra
            WHERE ra.task.project.id = :projectId AND ra.task.project.owner.id = :ownerId
            """)
    List<ResourceAllocationDTO> findAllResourceAllocationsByProjectIdAndProjectOwnerId(int projectId, int ownerId);
    @Query("""
            SELECT new com.example.server.dto.ResourceAllocationDTO(ra.task.id, ra.resource.id, ra.resource.user.username)
            FROM ResourceAllocation ra
            WHERE ra.task.project.id = :projectId AND ra.task.id IN :taskIds
            """)
    List<ResourceAllocationDTO> findAllResourceAllocationsByProjectIdAndTaskIdIn(int projectId, List<Integer> taskIds);
    @Modifying
    @Query("""
            DELETE FROM ResourceAllocation ra
            WHERE ra.task.project.id = :projectId AND ra.id NOT IN :resourceAllocationIds
            """)
    void deleteByProjectIdAndIdNotIn(int projectId, List<ResourceAllocationPK> resourceAllocationIds);
    @Modifying
    @Query("""
            DELETE FROM ResourceAllocation ra
            WHERE ra.task.project.id = :projectId
            """)
    void deleteByProjectId(int projectId);
}
