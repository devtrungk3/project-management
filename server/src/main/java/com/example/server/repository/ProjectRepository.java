package com.example.server.repository;

import com.example.server.model.dto.ProjectDTO;
import com.example.server.model.dto.StatusCountDTO;
import com.example.server.model.entity.Project;
import com.example.server.model.entity.ProjectStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

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
            SELECT new com.example.server.model.dto.ProjectDTO(p.id, p.name, p.description, p.status, p.owner.username, p.createdAt, p.updatedAt)
            FROM Project p
            WHERE p.id = :projectId AND p.owner.id = :ownerId
            """)
    Optional<ProjectDTO> findDTOByIdAndOwnerId(int projectId, int ownerId);
    @EntityGraph(attributePaths = "owner")
    Optional<Project> findByIdAndOwnerId(int projectId, int ownerId);
    @Query("""
            SELECT new com.example.server.model.dto.StatusCountDTO(p.status, COUNT(p))
            FROM Project p
            WHERE p.owner.id = :ownerId
            GROUP BY p.status
            """)
    List<StatusCountDTO> countByStatusForOwner(int ownerId);
    boolean existsByIdAndOwnerId(int projectId, int ownerId);
    boolean existsByIdAndStatus(int projectId, ProjectStatus status);
}