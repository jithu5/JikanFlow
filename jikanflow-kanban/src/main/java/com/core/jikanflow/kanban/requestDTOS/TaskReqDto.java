package com.core.jikanflow.kanban.requestDTOS;

import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class TaskReqDto {

    private String name;

    private String description;

    private String status;

    private String priority;

    private int orderIndex;

    private LocalDate due;

    private UUID projectId;

    private String username;
}
