package com.example.server.service.application.admin;

import com.example.server.model.dto.admin.ProjectStatisticsDTO;
import com.example.server.model.dto.admin.TaskStatisticsDTO;
import com.example.server.model.dto.admin.UserStatisticsDTO;
import com.example.server.repository.ProjectRepository;
import com.example.server.repository.TaskRepository;
import com.example.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service("adminDashboardService")
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final LocalDateTime date = LocalDateTime.now().minusDays(30);
    @Override
    public UserStatisticsDTO getUserStatistics() {
        UserStatisticsDTO userStatistics = userRepository.getUserSummary().orElse(null);
        if (userStatistics != null) {
            userStatistics.setUserGrowthCount(userRepository.getUserGrowthCountComparedTo(date));
            userStatistics.setUserGrowthRate(userRepository.getUserGrowthRateComparedTo(date));
            return userStatistics;
        }
        return new UserStatisticsDTO();
    }

    @Override
    public ProjectStatisticsDTO getProjectStatistics() {
        ProjectStatisticsDTO projectStatistics = projectRepository.getProjectSummary().orElse(null);
        if (projectStatistics != null) {
            double successRate = projectStatistics.getTotalProjects() != 0 ?
                    (double)projectStatistics.getCompletedProjects()*100 / projectStatistics.getTotalProjects()
                    : 0;
            projectStatistics.setSuccessRate(successRate);

            projectStatistics.setProjectGrowthCount(projectRepository.getProjectGrowthCountComparedTo(date));
            projectStatistics.setProjectGrowthRate(projectRepository.getProjectGrowthRateComparedTo(date));

            List<Object[]> newProjectObjectInYear = projectRepository.findMonthlyCreationCountByYear(Year.now().getValue());
            Map<Integer, Long> newProjectInYear = new LinkedHashMap<>();
            for(int i=1; i<=12; i++) {
                newProjectInYear.put(i,0L);
            }
            newProjectObjectInYear.forEach(object -> newProjectInYear.put(
                    (Integer)object[0],
                    (Long)object[1]
            ));
            projectStatistics.setNewProjectInYear(newProjectInYear);

            projectStatistics.setTopProjectManager(projectRepository.findTopOwnerByProjectCount(PageRequest.of(0, 10)));

            projectStatistics.setStatusCounts(projectRepository.countByStatus());
            return projectStatistics;
        }
        return new ProjectStatisticsDTO();
    }

    @Override
    public TaskStatisticsDTO getTaskStatistics() {
        return taskRepository.getTaskSummary();
    }
}
