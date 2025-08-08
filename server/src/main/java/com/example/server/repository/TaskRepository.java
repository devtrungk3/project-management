package com.example.server.repository;

import com.example.server.model.dto.UserOverviewDTO;
import com.example.server.model.entity.Task;
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
    @Query("""
            SELECT new com.example.server.model.dto.UserOverviewDTO(
                SUM(CASE WHEN t.start <= CURRENT_DATE AND t.finish >= CURRENT_DATE AND t.complete < 100 THEN 1 ELSE 0 END) AS active_task,
                SUM(CASE WHEN t.finish < CURRENT_DATE AND t.complete < 100 THEN 1 ELSE 0 END) AS overdue_task,
                SUM(CASE WHEN t.start <= CURRENT_DATE AND t.finish >= CURRENT_DATE AND t.complete = 0 THEN 1 ELSE 0 END) as todo_task,
                SUM(CASE WHEN t.start <= CURRENT_DATE AND t.finish >= CURRENT_DATE AND t.complete > 0 AND t.complete < 100 THEN 1 ELSE 0 END) as in_progress_task,
                SUM(CASE WHEN t.complete = 100 THEN 1 ELSE 0 END) as done_task,
                SUM(CASE WHEN t.priority = 'LOW' THEN 1 ELSE 0 END) as low_priority_task,
                SUM(CASE WHEN t.priority = 'MEDIUM' THEN 1 ELSE 0 END) as medium_priority_task,
                SUM(CASE WHEN t.priority = 'HIGH' THEN 1 ELSE 0 END) as high_priority_task
            )
            FROM Task t
            JOIN t.resourceAllocations ra
            WHERE t.project.status = 'IN_PROGRESS' AND ra.resource.user.id = :userId
            """)
    UserOverviewDTO findAllOverviewData(int userId);
}
