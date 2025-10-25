package com.example.server.repository;

import com.example.server.model.dto.MilestoneDTO;
import com.example.server.model.dto.TaskDTO;
import com.example.server.model.dto.admin.TaskStatisticsDTO;
import com.example.server.model.dto.user.CostOverviewReportDTO;
import com.example.server.model.dto.user.OverviewDTO;
import com.example.server.model.entity.Task;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
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
    List<Task> findByProject_Id(int projectId);
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
            ORDER BY t.finish ASC
            """)
    List<MilestoneDTO> getUpcomingMilestones(int userId, int projectId);
    @Query("""
            SELECT new com.example.server.model.dto.TaskDTO(t.id, t.name, t.arrangement, t.duration, t.finish, t.priority, t.complete)
            FROM Task t
            WHERE t.project.owner.id = :userId AND t.project.id = :projectId AND t.duration > 0 AND t.complete < 100 AND t.finish < CURRENT_DATE
            ORDER BY t.finish ASC
            """)
    List<TaskDTO> getOverdueTasks(int userId, int projectId);
    @Query("""
            SELECT AVG(t.complete) FROM Task t WHERE t.project.id = :projectId
            """)
    BigDecimal findAverageCompleteByProjectId(int projectId);
    @Query("""
            SELECT new com.example.server.model.dto.TaskDTO(t.name, t.start, t.finish)
            FROM Task t
            WHERE t.project.owner.id = :ownerId AND t.project.id = :projectId AND t.start >= :from AND t.start <= :to
            ORDER BY t.start ASC
            """)
    List<TaskDTO> getTasksStartingIn(int projectId, int ownerId, LocalDate from, LocalDate to);
    @Query("""
            SELECT new com.example.server.model.dto.TaskDTO(t.name, t.complete)
            FROM Task t
            WHERE t.project.owner.id = :ownerId AND t.project.id = :projectId AND t.finish >= :from AND t.finish <= :to AND t.complete < 100
            ORDER BY t.finish ASC
            """)
    List<TaskDTO> getTasksDueIn(int projectId, int ownerId, LocalDate from, LocalDate to);
    @Query("""
            SELECT new com.example.server.model.dto.user.CostOverviewReportDTO(
                SUM(t.baseCost),
                SUM(t.actualCost),
                SUM((100 - t.complete) * t.actualCost / 100)
            )
            FROM Task t
            WHERE t.project.owner.id = :ownerId AND t.project.id = :projectId AND t.isLeaf = true
            """)
    CostOverviewReportDTO getCostSummary(int projectId, int ownerId);
    @EntityGraph(attributePaths = {
            "resourceAllocations",
            "resourceAllocations.resource",
            "resourceAllocations.tagRate"
    })
    @Query("""
            SELECT DISTINCT t FROM Task t
            WHERE t.project.id = :projectId
            AND EXISTS (
                SELECT 1 FROM ResourceAllocation ra2
                WHERE ra2.task = t AND ra2.tagRate.id = :tagRateId
            )
            """)
    List<Task> findTasksByProjectIdAndTagRateId(int projectId, int tagRateId);
    @EntityGraph(attributePaths = {
            "resourceAllocations",
            "resourceAllocations.resource",
            "resourceAllocations.tagRate",
            "resourceAllocations.resource.user"})
    @Query("""
            SELECT t FROM Task t
            WHERE t.project.id = :projectId AND t.project.owner.id = :ownerId AND t.isLeaf = true
            """)
    List<Task> findTaskLeafByProjectIdAndProjectOwnerId(int projectId, int ownerId);
}
