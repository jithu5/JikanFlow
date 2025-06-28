package com.core.jikanflow.requestDTOS;

import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class UpdateTaskReqDto {

    private UUID id;

    private String status;

    private int orderIndex;

}
