package com.core.jikanflow.kanban.requestDTOS;

import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class UpdateTaskReqDto {

    private UUID id;

    private String status;

    private int orderIndex;

}
