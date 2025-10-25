package com.example.server.repository;

import com.example.server.model.dto.ProjectDTO;
import com.example.server.model.dto.StatusCountDTO;
import com.example.server.model.dto.admin.ProjectStatisticsDTO;
import com.example.server.model.dto.admin.TopProjectManagerDTO;
import com.example.server.model.dto.user.ProjectOverviewReportDTO;
import com.example.server.model.entity.Project;
import com.example.server.model.entity.ProjectStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Integer> {
    @Query("""
            SELECT new com.example.server.model.dto.ProjectDTO(p.id, p.name, p.status, p.owner.username, p.createdAt, p.updatedAt)
            FROM Project p
            WHERE p.owner.id = :ownerId
            ORDER BY p.updatedAt DESC, p.createdAt DESC
            """)
    Page<ProjectDTO> findByOwnerIdOrderByUpdatedAtDescAndCreatedAtDesc(int ownerId, Pageable pageable);
    @Query("""
            SELECT new com.example.server.model.dto.ProjectDTO(p.id, p.name, p.status, p.owner.username, p.createdAt, p.updatedAt)
            FROM Project p
            WHERE p.owner.id = :ownerId
            AND (:projectName IS NULL OR p.name LIKE CONCAT('%', :projectName, '%'))
            AND (:projectStatus IS NULL OR p.status = :projectStatus)
            ORDER BY p.updatedAt DESC, p.createdAt DESC
            """)
    Page<ProjectDTO> findByOwnerIdWithFilters(int ownerId, Pageable pageable, String projectName, ProjectStatus projectStatus);
    @Query("""
            SELECT new com.example.server.model.dto.ProjectDTO(p.id, p.name, p.description, p.status, p.owner.username, c, p.createdAt, p.updatedAt)
            FROM Project p
            LEFT JOIN p.currency c
            WHERE p.id = :projectId AND p.owner.id = :ownerId
            """)
    Optional<ProjectDTO> findDTOByIdAndOwnerId(int projectId, int ownerId);
    @EntityGraph(attributePaths = {"owner", "currency"})
    Optional<Project> findByIdAndOwnerId(int projectId, int ownerId);
    @Query("""
            SELECT new com.example.server.model.dto.StatusCountDTO(p.status, COUNT(p))
            FROM Project p
            WHERE p.owner.id = :ownerId
            GROUP BY p.status
            """)
    List<StatusCountDTO> countByStatusForOwner(int ownerId);
    @Query("""
            SELECT new com.example.server.model.dto.StatusCountDTO(p.status, COUNT(p))
            FROM Project p
            GROUP BY p.status
            """)
    List<StatusCountDTO> countByStatus();
    boolean existsByIdAndOwnerId(int projectId, int ownerId);
    @Query("""
            SELECT new com.example.server.model.dto.admin.ProjectStatisticsDTO(
                COUNT(*),
                SUM(CASE WHEN p.status = com.example.server.model.entity.ProjectStatus.DONE THEN 1 ELSE 0 END),
                SUM(CASE WHEN p.status = com.example.server.model.entity.ProjectStatus.CANCELLED THEN 1 ELSE 0 END)
            )
            FROM Project p
            """)
    Optional<ProjectStatisticsDTO> getProjectSummary();
    @Query("""
            SELECT
                SUM(CASE WHEN p.createdAt > :date THEN 1 ELSE 0 END)
            FROM Project p
            """)
    Long getProjectGrowthCountComparedTo(LocalDateTime date);
    @Query("""
            SELECT
                (COUNT(*) * 100.0 / SUM(CASE WHEN p.createdAt <= :date THEN 1 ELSE 0 END)) - 100
            FROM Project p
            """)
    Double getProjectGrowthRateComparedTo(LocalDateTime date);
    @Query("""
            SELECT MONTH(p.createdAt), COUNT(*)
            FROM Project p
            WHERE YEAR(p.createdAt) = :year
            GROUP BY MONTH(p.createdAt)
            """)
    List<Object[]> findMonthlyCreationCountByYear(int year);
    @Query("""
            SELECT new com.example.server.model.dto.admin.TopProjectManagerDTO(p.owner.username, COUNT(*) as total)
            FROM Project p
            GROUP BY p.owner.username
            ORDER BY total DESC
            """)
    List<TopProjectManagerDTO> findTopOwnerByProjectCount(Pageable pageable);
    @Query("""
            SELECT new com.example.server.model.dto.user.ProjectOverviewReportDTO(MIN(t.start), MAX(t.finish))
            FROM Project p
            JOIN p.tasks t
            WHERE p.owner.id = :userId AND p.id = :projectId
            """)
    ProjectOverviewReportDTO getProjectStartAndFinish(int userId, int projectId);
    @Query("""
            SELECT SUM(t.duration * t.complete)*100/SUM(t.duration * 100)
            FROM Project p
            JOIN p.tasks t
            WHERE p.owner.id = :userId AND p.id = :projectId
            """)
    Double getProjectComplete(int userId, int projectId);
}