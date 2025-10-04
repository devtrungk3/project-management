package com.example.server.repository;

import com.example.server.model.dto.MilestoneDTO;
import com.example.server.model.dto.TaskDTO;
import com.example.server.model.dto.admin.TaskStatisticsDTO;
import com.example.server.model.dto.user.OverviewDTO;
import com.example.server.model.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

public interface TaskRepository extends JpaRepository<Task, Integer> {
    @Query("""
            SELECT t FROM Task t
            WHERE t.project.id = :projectId AND t.project.owner.id = :ownerId
            ORDER BY t.arrangement ASC
            """)
    List<Task> findTasksByProjectIdAndProjectOwnerId(int projectId, int ownerId);
    @Query("""
            SELECT t.id FROM Task t WHERE t.project.id = :projectId
            """)
    List<Integer> findIdsByProjectId(int projectId);
    @Query("""
            SELECT t FROM Task t
            JOIN t.resourceAllocations ra
            JOIN ra.resource r
            WHERE t.project.id = :projectId AND r.user.id = :userId
            ORDER BY t.arrangement ASC
            """)
    List<Task> findTasksByProjectIdAndResourceAllocationUserId(int projectId, int userId);
    void deleteByProject_IdAndIdNotIn(int projectId, Set<Integer> taskIds);
    void deleteByProject_Id(int projectId);
    @Query("""
            SELECT new com.example.server.model.dto.user.OverviewDTO(
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
    OverviewDTO findAllOverviewData(int userId);
    @Query("""
            SELECT
                t.finish,
                COUNT(*)
            FROM Task t
            JOIN t.resourceAllocations ra
            WHERE t.project.status = 'IN_PROGRESS'
                AND t.finish >= :from
                AND t.finish <= :to
                AND t.complete < 100
                AND ra.resource.user.id = :userId
            GROUP BY t.finish
            """)
    List<Object[]> findUpcomingTasksBetween(int userId, LocalDate from, LocalDate to);
    @Query("""
            SELECT new com.example.server.model.dto.admin.TaskStatisticsDTO(
                COUNT(*),
                SUM(CASE WHEN t.complete = 100 THEN 1 ELSE 0 END),
                SUM(CASE WHEN t.finish < CURRENT_DATE AND t.complete < 100 THEN 1 ELSE 0 END)
            )
            FROM Task t
            """)
    TaskStatisticsDTO getTaskSummary();
    @Query("""
            SELECT new com.example.server.model.dto.MilestoneDTO(t.id, t.name, t.finish, t.complete)
            FROM Task t
            WHERE t.project.owner.id = :userId AND t.project.id = :projectId AND t.complete < 100 AND t.duration = 0
            """)
    List<MilestoneDTO> getUpcomingMilestones(int userId, int projectId);
    @Query("""
            SELECT new com.example.server.model.dto.TaskDTO(t.id, t.name, t.arrangement, t.duration, t.finish, t.priority, t.complete)
            FROM Task t
            WHERE t.project.owner.id = :userId AND t.project.id = :projectId AND t.complete < 100 AND t.finish < CURRENT_DATE
            """)
    List<TaskDTO> getOverdueTasks(int userId, int projectId);
}
