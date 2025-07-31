package com.example.server.repositories;

import com.example.server.models.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Integer> {
    @Query("""
            SELECT t FROM Task t
            WHERE t.project.id = :projectId AND t.project.owner.id = :ownerId
            ORDER BY t.arrangement ASC
            """)
    List<Task> findTasksByProjectIdAndProjectOwnerId(int projectId, int ownerId);
    @Query("""
            SELECT t FROM Task t
            JOIN t.resourceAllocations ra
            JOIN ra.resource r
            WHERE t.project.id = :projectId AND r.user.id = :userId
            ORDER BY t.arrangement ASC
            """)
    List<Task> findTasksByProjectIdAndResourceAllocationUserId(int projectId, int userId);

    boolean existsByIdAndProjectId(int taskId, int projectId);
    @Modifying
    @Query("""
            DELETE FROM Task t
            WHERE t.project.id = :projectId AND t.id NOT IN :taskIds
            """)
    void deleteByProjectIdAndIdNotIn(int projectId, List<Integer> taskIds);
    void deleteByProjectId(int projectId);
}
