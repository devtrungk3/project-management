package com.example.server.repositories;

import com.example.server.models.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    @EntityGraph(attributePaths = "role")
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
}