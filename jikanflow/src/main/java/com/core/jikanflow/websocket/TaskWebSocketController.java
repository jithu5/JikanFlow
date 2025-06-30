package com.core.jikanflow.websocket;

import com.core.jikanflow.entities.User;
import com.core.jikanflow.requestDTOS.KanbanUpdateReqDto;
import com.core.jikanflow.requestDTOS.UpdateTaskReqDto;
import com.core.jikanflow.responseDTOS.ProjectResDto;
import com.core.jikanflow.service.ProjectService;
import com.core.jikanflow.service.TaskService;
import com.core.jikanflow.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Controller
@RequiredArgsConstructor
public class TaskWebSocketController {

    private final ProjectService projectService;
    private final TaskService taskService;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserService userService;

    private boolean isUserMemberOfProject(String username, UUID projectId) {
        ProjectResDto project = projectService.findProjectById(projectId);
        return project.getUsers().stream().anyMatch(u -> u.getUsername().equals(username));
    }

    @MessageMapping("/task-drag-started")
    public void handleTaskBeingDragged(Map<String, Object> message, Principal principal) {
        String username = principal.getName();
        User user = userService.findByUsername(username);
        UUID projectId = UUID.fromString((String) message.get("projectId"));

        ProjectResDto project = projectService.findProjectById(projectId);

        if (!isUserMemberOfProject(username, projectId)) {
            throw new RuntimeException("User is not a member of the project");
        }
        messagingTemplate.convertAndSend("/topic/project/" + projectId, message);
    }


    @MessageMapping("/update-tasks")
    public void updateTasks(KanbanUpdateReqDto message, Principal principal) {
        String username = principal.getName();
        User user = userService.findByUsername(username);
        UUID projectId = message.getProjectId();

        ProjectResDto project = projectService.findProjectById(projectId);

        if (!isUserMemberOfProject(username, projectId)) {
            throw new RuntimeException("User is not a member of the project");
        }

        List<UpdateTaskReqDto> updatedTasks = message.getUpdatedTasks();

//        taskService.saveTaskPositions(projectId, updatedTasks);  // cleaner method
        messagingTemplate.convertAndSend("/topic/project/" + projectId, message);
    }

}
