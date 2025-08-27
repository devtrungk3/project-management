package com.example.server.repository;

import com.example.server.model.dto.admin.UserStatisticsDTO;
import com.example.server.model.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    @EntityGraph(attributePaths = "role")
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    @Query("""
            SELECT new com.example.server.model.dto.admin.UserStatisticsDTO(
                COUNT(*),
                SUM(CASE WHEN u.status = com.example.server.model.entity.UserStatus.ACTIVE THEN 1 ELSE 0 END),
                SUM(CASE WHEN u.status != com.example.server.model.entity.UserStatus.ACTIVE THEN 1 ELSE 0 END)
            )
            FROM User u
            """)
    Optional<UserStatisticsDTO> getUserSummary();
    @Query("""
            SELECT
                SUM(CASE WHEN u.createdAt > :date THEN 1 ELSE 0 END)
            FROM User u
            """)
    Long getUserGrowthCountComparedTo(LocalDateTime date);
    @Query("""
            SELECT
                (COUNT(*) * 100.0 / SUM(CASE WHEN u.createdAt <= :date THEN 1 ELSE 0 END)) - 100
            FROM User u
            """)
    Double getUserGrowthRateComparedTo(LocalDateTime date);
}