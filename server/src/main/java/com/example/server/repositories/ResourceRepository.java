package com.example.server.repositories;

import com.example.server.dto.ProjectDTO;
import com.example.server.dto.StatusCountDTO;
import com.example.server.models.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ResourceRepository extends JpaRepository<Resource, Integer> {
    boolean existsByUserIdAndProjectId(int userId, int projectId);
    @Query("""
            SELECT new com.example.server.dto.StatusCountDTO(r.project.status, COUNT(DISTINCT r.project.id))
            FROM Resource r
            WHERE r.user.id = :userId
            GROUP BY r.project.status
            """)
    List<StatusCountDTO> countByStatusForUser(int userId);
    @Query("""
            SELECT new com.example.server.dto.ProjectDTO(r.project.id, r.project.name, r.project.status, r.project.owner.username, r.project.createdAt, r.project.updatedAt)
            FROM Resource r
            WHERE r.user.id = :userId
            """)
    Page<ProjectDTO> findProjectByResourceUserIdOrderByUpdatedAtDescAndCreatedAtDesc(int userId, Pageable pageable);
    @Query("""
            SELECT new com.example.server.dto.ProjectDTO(r.project.id, r.project.name, r.project.description, r.project.status, r.project.owner.username, r.project.createdAt, r.project.updatedAt)
            FROM Resource r
            WHERE r.project.id = :projectId AND r.user.id = :userId
            """)
    Optional<ProjectDTO> findByIdAndResourceUserId(int projectId, int userId);
}
