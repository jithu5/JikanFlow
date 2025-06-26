package com.core.jikanflow.service;

import com.core.jikanflow.repository.TaskRepo;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class TaskService {
    private final TaskRepo taskRepo;
}
