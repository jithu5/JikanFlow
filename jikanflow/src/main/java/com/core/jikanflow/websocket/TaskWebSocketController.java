package com.core.jikanflow.websocket;

import com.core.jikanflow.entities.User;
import com.core.jikanflow.requestDTOS.KanbanUpdateReqDto;
import com.core.jikanflow.requestDTOS.UpdateTaskReqDto;
import com.core.jikanflow.responseDTOS.ProjectResDto;
import com.core.jikanflow.responseDTOS.TaskResDto;
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


    @MessageMapping("/task-drag-started")
    public void handleTaskBeingDragged(Map<String, Object> message, Principal principal) {

        UUID projectId = UUID.fromString((String) message.get("projectId"));
        UUID taskId = UUID.fromString((String) message.get("taskId"));
        String username = (String) message.get("username");
        String type = (String) message.get("type");

        ProjectResDto project = projectService.findProjectByIdForSocket(projectId,principal);

        TaskResDto taskResDto = taskService.findTaskByIdForSocket(taskId,principal);

        messagingTemplate.convertAndSend("/topic/project/" + projectId,  Map.of(
                "message", "Moving to "+ taskResDto.getName() + " by " + username ,
                "username",username,
                "type","TASK_DRAG_START",
                "taskId",taskId)
        );
    }


    @MessageMapping("/update-tasks")
    public void updateTasks(KanbanUpdateReqDto message,Principal principal) {
        UUID projectId = message.getProjectId();

        ProjectResDto project = projectService.findProjectByIdForSocket(projectId,principal);

        if (project == null){
            throw new RuntimeException("Project not found");
        }

        int index = message.getIndex();
        UUID removableTaskId = message.getTaskId();
        String toStatus = message.getToStatus();
        String username = message.getUsername();

        taskService.saveTaskPositions(projectId, index, removableTaskId, toStatus,principal);  // cleaner method
        messagingTemplate.convertAndSend("/topic/project/" + projectId,Map.of(
                        "type", "TASK_DRAG_END",
                        "toStatus", toStatus,
                        "index",index,
                        "username",username,
                        "taskId",removableTaskId
                )
        );
    }

    @MessageMapping("/task-delete")
    public void deleteTasks(){
        
    }

}
