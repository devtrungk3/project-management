package com.example.server.repositories;

import com.example.server.dto.ProjectDTO;
import com.example.server.models.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Integer> {
    @Query("""
            SELECT new com.example.server.dto.ProjectDTO(p.id, p.name, p.status, o.username, p.createdAt, p.updatedAt)
            FROM Project p
            JOIN p.owner o
            WHERE o.id = :ownerId
            """)
    Page<ProjectDTO> findByOwnerIdWithPaging(int ownerId, Pageable pageable);
    @Query("""
            SELECT new com.example.server.dto.ProjectDTO(p.id, p.name, p.description, p.status, p.createdAt, p.updatedAt)
            FROM Project p
            JOIN p.owner o
            WHERE p.id = :id AND o.id = :ownerId
            """)
    Optional<ProjectDTO> findByIdAndOwnerId(int id, int ownerId);
}