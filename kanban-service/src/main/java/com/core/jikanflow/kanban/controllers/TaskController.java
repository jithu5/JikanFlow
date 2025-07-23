package com.core.jikanflow.kanban.controllers;

import com.core.jikanflow.kanban.responseDTOS.TaskResDto;
import com.core.jikanflow.kanban.service.TaskService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(path = "/api/main/tasks")
@AllArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping("/get/{taskId}")
    public ResponseEntity<?> getTaskById(@PathVariable UUID taskId){
        try {
            TaskResDto taskResDto = taskService.findTaskById(taskId);
            return ResponseEntity.ok().body(taskResDto);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("/get-all/{projectId}")
    public ResponseEntity<?> getTaskByProjectId(@PathVariable UUID projectId){
        try {
            List<TaskResDto> taskResDto = taskService.findTaskByProjectId(projectId);
            return ResponseEntity.ok().body(taskResDto);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

}
