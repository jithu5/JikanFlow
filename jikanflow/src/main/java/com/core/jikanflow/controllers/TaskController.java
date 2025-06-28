package com.core.jikanflow.controllers;

import com.core.jikanflow.requestDTOS.TaskReqDto;
import com.core.jikanflow.requestDTOS.UpdateTaskReqDto;
import com.core.jikanflow.responseDTOS.TaskResDto;
import com.core.jikanflow.service.TaskService;
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

    @PostMapping("/create")
    public ResponseEntity<?> createTask(@RequestBody TaskReqDto newTask){
        try {
            TaskResDto savedTask = taskService.createNewTask(newTask);
            return ResponseEntity.accepted().body(savedTask);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("/get/{taskId}")
    public ResponseEntity<?> getTaskById(@PathVariable UUID taskId){
        try {
            TaskResDto taskResDto = taskService.findTaskById(taskId);
            return ResponseEntity.ok().body(taskResDto);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

}
