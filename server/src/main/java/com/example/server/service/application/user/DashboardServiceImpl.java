package com.example.server.service.application.user;

import com.example.server.model.dto.user.OverviewDTO;
import com.example.server.repository.JoinRequestRepository;
import com.example.server.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service("userDashboardService")
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {
    private final TaskRepository taskRepository;
    private final JoinRequestRepository joinRequestRepository;
    @Override
    public OverviewDTO getOverviewForUser(int userId) {
        OverviewDTO overviewDTO = new OverviewDTO();

        OverviewDTO taskOverviewDTO = taskRepository.findAllOverviewData(userId);

        List<Object[]> upComingTaskFromDB = taskRepository.findUpcomingTasksBetween(userId, LocalDate.now(), LocalDate.now().plusDays(10));
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM");
        Map<String, Long> upcomingTasksIn10Days = new LinkedHashMap<>();
        for(int i=0; i<10; i++) {
            String date = LocalDate.now().plusDays(i).format(formatter);
            upcomingTasksIn10Days.put(date,0L);
        }
        upComingTaskFromDB.forEach(object -> upcomingTasksIn10Days.put(((LocalDate)object[0]).format(formatter), (Long)object[1]));

        long pendingIncomingJoinRequest = joinRequestRepository.countPendingIncomingJoinRequest(userId);

        overviewDTO.setMyActiveTasks(taskOverviewDTO.getMyActiveTasks());
        overviewDTO.setMyOverdueTasks(taskOverviewDTO.getMyOverdueTasks());
        overviewDTO.setAssignedTaskStatuses(taskOverviewDTO.getAssignedTaskStatuses());
        overviewDTO.setAssignedTaskPriorities(taskOverviewDTO.getAssignedTaskPriorities());
        overviewDTO.setUpcomingTasksIn10Days(upcomingTasksIn10Days);
        overviewDTO.setPendingIncomingJoinRequests(pendingIncomingJoinRequest);
        return overviewDTO;
    }
}
