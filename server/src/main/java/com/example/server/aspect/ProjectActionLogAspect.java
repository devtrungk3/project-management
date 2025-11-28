package com.example.server.aspect;

import com.example.server.annotation.LogAction;
import com.example.server.model.document.ProjectActionLog;
import com.example.server.model.entity.Project;
import com.example.server.model.entity.User;
import com.example.server.model.entity.UserPrincipal;
import com.example.server.service.application.user.ProjectActionLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Slf4j
@Aspect
@Component
@RequiredArgsConstructor
public class ProjectActionLogAspect {

    private final ProjectActionLogService actionLogService;

    @AfterReturning(
            pointcut = "@annotation(com.example.server.annotation.LogAction)",
            returning = "result"
    )
    public void logProjectAction(JoinPoint joinPoint, Object result) {
        try {
            MethodSignature signature = (MethodSignature) joinPoint.getSignature();
            LogAction logAction = signature.getMethod().getAnnotation(LogAction.class);
            // Extract method arguments
            Object[] args = joinPoint.getArgs();
            String[] paramNames = signature.getParameterNames();
            // Extract projectId from method arguments
            Integer projectId = extractProjectId(args, paramNames, result);
            // Get current user information
            ProjectActionLog.Actor actor = getCurrentActor();
            // Build description
            String description = buildDescription(logAction, result);
            // Create and save log
            ProjectActionLog log = ProjectActionLog.builder()
                    .projectId(projectId)
                    .actionType(logAction.actionType())
                    .description(description)
                    .actor(actor)
                    .build();
            actionLogService.logAction(log);
        } catch (Exception e) {
            log.error("Failed to log action", e);
        }
    }

    private Integer extractProjectId(Object[] args, String[] paramNames, Object result) {
        for (int i = 0; i < paramNames.length; i++) {
            if (paramNames[i].equals("projectId")) {
                return Integer.parseInt(args[i].toString());
            }
        }
        if (result != null) {
            Integer id = extractProjectIdFromObject(result);
            if (id != null) return id;
        }

        if (args.length > 0) {
            return extractProjectIdFromObject(args[0]);
        }

        return null;
    }

    private Integer extractProjectIdFromObject(Object obj) {
        try {
            var projectField = obj.getClass().getDeclaredField("project");
            projectField.setAccessible(true);
            Object projectObj = projectField.get(obj);

            if (projectObj instanceof Project project) {
                return project.getId();
            }
        } catch (Exception ignored) {}

        return null;
    }

    private ProjectActionLog.Actor getCurrentActor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated()) {

            Object principal = authentication.getPrincipal();
            if (principal instanceof UserPrincipal userPrincipal) {
                User user = userPrincipal.getUser();

                return ProjectActionLog.Actor.builder()
                        .userId(user.getId())
                        .username(user.getUsername())
                        .build();
            }

            // Fallback if principal is not UserPrincipal
            return ProjectActionLog.Actor.builder()
                    .userId(-1)
                    .username(authentication.getName())
                    .build();
        }

        return ProjectActionLog.Actor.builder()
                .userId(0)
                .username("System")
                .build();
    }

    private String buildDescription(LogAction logAction, Object result) {
        if (!logAction.description().isEmpty()) {
            return logAction.description();
        }

        // Auto-generate description based on action type
        String action = logAction.actionType().replace("_", " ");
        Integer targetId = null;
        String targetName = null;

        if (result != null) {
            try {
                var idField = result.getClass().getDeclaredField("id");
                idField.setAccessible(true);
                Object id = idField.get(result);
                if (id != null) {
                    targetId = Integer.parseInt(id.toString());
                }
                var nameField = result.getClass().getDeclaredField("name");
                nameField.setAccessible(true);
                targetName = " '" + nameField.get(result).toString() + "'";
            } catch (Exception ignored) {
                try {
                    var titleField = result.getClass().getDeclaredField("title");
                    titleField.setAccessible(true);
                    targetName = "'" + titleField.get(result).toString() + "'";
                } catch (Exception ignored2) {
                    try {
                        var userField = result.getClass().getDeclaredField("user");
                        userField.setAccessible(true);
                        Object userObj = userField.get(result);
                        if (userObj instanceof User user) {
                            targetName = "'" + user.getUsername()+ "'";
                        }
                    } catch (Exception ignored3) {}
                }
            }
        }

        return action + " " + targetId + ":" + targetName;
    }
}