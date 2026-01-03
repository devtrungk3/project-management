package com.example.server.repository;

import com.example.server.model.entity.ExtraCost;
import com.example.server.model.enums.ExtraCostStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ExtraCostRepository extends JpaRepository<ExtraCost, Integer> {
    List<ExtraCost> findByProject_IdAndProject_Owner_Id(int projectId, int ownerId);
    boolean existsByIdAndProject_Id(int extraCostId, int projectId);
    @Query("""
            SELECT ROUND(SUM(ec.cost), 2)
            FROM ExtraCost ec
            WHERE ec.project.id = :projectId AND ec.project.owner.id = :ownerId
            """)
    Double findSumOfCostByProjectIdAndOwner(int projectId, int ownerId);
    @Query("""
            SELECT ROUND(SUM(ec.cost), 2)
            FROM ExtraCost ec
            WHERE ec.project.id = :projectId AND ec.project.owner.id = :ownerId AND ec.status = :status
            """)
    Double findSumOfCostByProjectIdAndOwnerAndStatus(int projectId, int ownerId, ExtraCostStatus status);
}
