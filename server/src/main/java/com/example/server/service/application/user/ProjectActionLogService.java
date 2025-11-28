package com.example.server.service.application.user;

import com.example.server.exception.UserNotInProjectException;
import com.example.server.model.document.ProjectActionLog;
import com.example.server.repository.ProjectActionLogRepository;
import com.example.server.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;


import java.time.Instant;

@Service
@RequiredArgsConstructor
public class ProjectActionLogService {

    private final ProjectActionLogRepository repository;
    private final ResourceRepository resourceRepository;

    public ProjectActionLog logAction(ProjectActionLog log) {
        log.setCreatedAt(Instant.now());
        return repository.save(log);
    }

    public Page<ProjectActionLog> getProjectLogs(int projectId, int userId, int pageNumber, int pageSize) {
        if (!resourceRepository.existsByProject_IdAndUser_Id(projectId, userId)) {
            throw new UserNotInProjectException("User with ID" + userId + " is not a member of project with ID " + projectId + ". User must be a member to get log.");
        }
        return repository.findByProjectIdOrderByCreatedAtDesc(projectId, PageRequest.of(pageNumber, pageSize));
    }
}