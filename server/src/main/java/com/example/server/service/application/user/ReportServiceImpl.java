package com.example.server.service.application.user;

import com.example.server.model.dto.TaskDTO;
import com.example.server.model.dto.user.CostOverviewReportDTO;
import com.example.server.model.dto.user.ProjectOverviewReportDTO;
import com.example.server.model.entity.ResourceAllocation;
import com.example.server.model.entity.Task;
import com.example.server.repository.ProjectRepository;
import com.example.server.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    @Override
    public List<TaskDTO> getTasksStartingInNextDays(int ownerId, int projectId, int numberOfDays) {
        if (numberOfDays <= 0) return List.of();
        LocalDate from = LocalDate.now();
        LocalDate to = LocalDate.now().plusDays(numberOfDays);
        return taskRepository.getTasksStartingIn(projectId, ownerId, from, to);
    }

    @Override
    public List<TaskDTO> getTasksDueThisWeek(int ownerId, int projectId) {
        LocalDate firstDayOfThisWeek = LocalDate.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate lastDayOfThisWeek = firstDayOfThisWeek.plusDays(6);
        return taskRepository.getTasksDueIn(projectId, ownerId, firstDayOfThisWeek, lastDayOfThisWeek);
    }

    @Override
    public CostOverviewReportDTO getCostOverviewReport(int userId, int projectId) {
        CostOverviewReportDTO costOverview = taskRepository.getCostSummary(projectId, userId);
        List<Task> tasks = taskRepository.findTaskLeafByProjectIdAndProjectOwnerId(projectId, userId);
        Map<String, Double> resourceWithCost = new HashMap<>();
        for (Task task : tasks) {
            if (task.getEffort() > 0) {
                float effortPerResource = (float) task.getEffort() / task.getResourceAllocations().size();
                for (ResourceAllocation ra : task.getResourceAllocations()) {
                    Double cost = 0.0;
                    if (resourceWithCost.containsKey(ra.getResource().getUser().getUsername())) {
                        cost = resourceWithCost.get(ra.getResource().getUser().getUsername());
                    }
                    if (ra.getTagRate() != null) {
                        cost = cost + effortPerResource * ra.getTagRate().getRate();
                    }
                    resourceWithCost.put(ra.getResource().getUser().getUsername(), cost);
                }
            }
        }
        costOverview.setResourceWithCost(resourceWithCost);
        return costOverview;
    }
}
