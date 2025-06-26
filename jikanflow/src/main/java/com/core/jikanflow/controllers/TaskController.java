package com.core.jikanflow.controllers;

import com.core.jikanflow.requestDTOS.TaskReqDto;
import com.core.jikanflow.responseDTOS.TaskResDto;
import com.core.jikanflow.service.TaskService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
