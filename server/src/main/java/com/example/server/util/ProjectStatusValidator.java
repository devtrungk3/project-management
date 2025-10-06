package com.example.server.util;

import com.example.server.exception.InvalidProjectStateException;
import com.example.server.model.entity.Project;
import com.example.server.model.entity.ProjectStatus;

public final class ProjectStatusValidator {
    private ProjectStatusValidator() {}
    public static void validateClosedProject(Project project) {
        if (project.getStatus() == ProjectStatus.DONE || project.getStatus() == ProjectStatus.CANCELLED) {
            throw new InvalidProjectStateException("This project cannot be edited because it is " + project.getStatus());
        }
    }
}
