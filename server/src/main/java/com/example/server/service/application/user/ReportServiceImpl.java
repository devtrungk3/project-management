package com.example.server.service.application.user;

import com.example.server.model.dto.user.ProjectOverviewReportDTO;
import com.example.server.repository.ProjectRepository;
import com.example.server.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    @Override
    public ProjectOverviewReportDTO getProjectOverviewReport(int userId, int projectId) {
        ProjectOverviewReportDTO report = projectRepository.getProjectStartAndFinish(userId, projectId);
        report.setProjectComplete(projectRepository.getProjectComplete(userId, projectId));
        report.setUpcomingMilestones(taskRepository.getUpcomingMilestones(userId, projectId));
        report.setOverdueTasks(taskRepository.getOverdueTasks(userId, projectId));
        return report;
    }
}
