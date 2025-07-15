package com.example.server.repositories;

import com.example.server.dto.JoinRequestDTO;
import com.example.server.models.JoinRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface JoinRequestRepository extends JpaRepository<JoinRequest, Integer> {
    @Query("""
            SELECT jr FROM JoinRequest jr WHERE id = :joinRequestId AND jr.project.owner.id = :ownerId
            """)
    Optional<JoinRequest> findByIdAndProjectOwnerId(int joinRequestId, int ownerId);
    boolean existsByUserIdAndProjectIdAndAcceptFlagIsNull(int userId, int projectId);
    void deleteByUserIdAndProjectId(int userId, int projectId);
    @Query("""
            SELECT new com.example.server.dto.JoinRequestDTO(jr.id, jr.user.username, jr.project.id, jr.project.name,
            CASE WHEN jr.acceptFlag = true THEN 'accepted' WHEN jr.acceptFlag = false THEN 'rejected' ELSE 'waiting' END,
            jr.createdAt, jr.updatedAt)
            FROM JoinRequest jr WHERE jr.project.owner.id = :ownerId
            ORDER BY jr.createdAt DESC
            """)
    Page<JoinRequestDTO> findByProjectOwnerIdOrderByCreatedAtDesc(int ownerId, Pageable pageable);
    @Query("""
            SELECT new com.example.server.dto.JoinRequestDTO(jr.id, jr.project.id, jr.project.name, jr.project.owner.username,
             CASE WHEN jr.acceptFlag = true THEN 'accepted' WHEN jr.acceptFlag = false THEN 'rejected' ELSE 'waiting' END,
             jr.createdAt, jr.updatedAt)
            FROM JoinRequest jr WHERE jr.user.id = :userId
            ORDER BY jr.createdAt DESC
            """)
    Page<JoinRequestDTO> findByUserIdOrderByCreatedAtDesc(int userId, Pageable pageable);
}