package com.core.jikanflow.responseDTOS;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class ProjectDetailedResDto {
    private UUID id;
    private String title;
    private String description;
    private String username;
    private LocalDateTime createdAt;
    private List<TaskResDto> tasks;
}
