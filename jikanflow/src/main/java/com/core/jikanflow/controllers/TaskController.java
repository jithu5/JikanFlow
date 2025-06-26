package com.core.jikanflow.controllers;

import com.core.jikanflow.service.TaskService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api/main/tasks")
@AllArgsConstructor
public class TaskController {

    private final TaskService taskService;



}
