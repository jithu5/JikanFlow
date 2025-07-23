package com.core.jikanflow.kanban.responseDTOS;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class TaskResDto {
    private UUID id;

    private String name;

    private String description;

    private String status;

    private String priority;

    private int orderIndex;

    private LocalDate due;

    private LocalDateTime createdAt;

    private List<NoteResDto> notes;
}
