package com.core.jikanflow.kanban.responseDTOS;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class ProjectResDto {
    private UUID id;
    private String title;
    private String description;
    private String createdBy;
    private LocalDateTime createdAt;
    private List<TaskResDto> tasks;

    private List<UserResDto> users;
}
