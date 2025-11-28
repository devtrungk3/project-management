package com.example.server.repository;

import com.example.server.model.document.ProjectActionLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProjectActionLogRepository extends MongoRepository<ProjectActionLog, String> {
    Page<ProjectActionLog> findByProjectIdOrderByCreatedAtDesc(int projectId, Pageable pageable);
}
