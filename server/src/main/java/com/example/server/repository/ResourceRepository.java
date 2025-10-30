package com.example.server.repository;

import com.example.server.model.dto.ProjectDTO;
import com.example.server.model.dto.ResourceDTO;
import com.example.server.model.dto.StatusCountDTO;
import com.example.server.model.enums.ProjectStatus;
import com.example.server.model.entity.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface ResourceRepository extends JpaRepository<Resource, Integer> {
    boolean existsByUserIdAndProjectId(int userId, int projectId);
    @Query("""
            SELECT new com.example.server.model.dto.StatusCountDTO(r.project.status, COUNT(DISTINCT r.project.id))
            FROM Resource r
            WHERE r.user.id = :userId AND r.project.owner.id != :userId
            GROUP BY r.project.status
            """)
    List<StatusCountDTO> countByStatusForUser(int userId);
    @Query("""
            SELECT new com.example.server.model.dto.ProjectDTO(r.project.id, r.project.name, r.project.status, r.project.owner.username, r.project.createdAt, r.project.updatedAt)
            FROM Resource r
            WHERE r.user.id = :userId AND r.project.owner.id != :userId
            ORDER BY r.project.updatedAt DESC, r.project.createdAt DESC
            """)
    Page<ProjectDTO> findProjectByResourceUserIdOrderByUpdatedAtDescAndCreatedAtDesc(int userId, Pageable pageable);
    @Query("""
            SELECT new com.example.server.model.dto.ProjectDTO(r.project.id, r.project.name, r.project.status, r.project.owner.username, r.project.createdAt, r.project.updatedAt)
            FROM Resource r
            WHERE r.user.id = :userId AND r.project.owner.id != :userId
            AND (:projectName IS NULL OR r.project.name LIKE CONCAT('%', :projectName, '%'))
            AND (:ownerUsername IS NULL OR r.project.owner.username LIKE CONCAT('%', :ownerUsername, '%'))
            AND (:projectStatus IS NULL OR r.project.status = :projectStatus)
            ORDER BY r.project.updatedAt DESC, r.project.createdAt DESC
            """)
    Page<ProjectDTO> findProjectByResourceUserIdWithFilters(int userId, Pageable pageable, String projectName, String ownerUsername, ProjectStatus projectStatus);

    @Query("""
            SELECT new com.example.server.model.dto.ProjectDTO(r.project.id, r.project.name, r.project.description, r.project.status, r.project.owner.username, c, r.project.createdAt, r.project.updatedAt)
            FROM Resource r
            LEFT JOIN r.project.currency c
            WHERE r.project.id = :projectId AND r.user.id = :userId AND r.project.owner.id != :userId
            """)
    Optional<ProjectDTO> findProjectIdByProjectIdAndResourceUserId(int projectId, int userId);
    @Query("""
            SELECT new com.example.server.model.dto.ResourceDTO(r.id, r.user.username, r.createdAt)
            FROM Resource r
            WHERE r.project.id = :projectId AND r.project.owner.id = :ownerId
            ORDER BY r.createdAt DESC
            """)
    List<ResourceDTO> findByProjectIdAndProjectOwnerId(int projectId, int ownerId);
    Optional<Resource> findByIdAndProject_Owner_Id(int resourceId, int ownerId);
    @Query("""
            SELECT r.id FROM Resource r WHERE r.project.id = :projectId
            """)
    Set<Integer> findIdsByProjectId(int projectId);
}
