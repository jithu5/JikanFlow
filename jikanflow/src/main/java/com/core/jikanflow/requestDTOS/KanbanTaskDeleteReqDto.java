package com.core.jikanflow.requestDTOS;

import lombok.Data;

import java.util.UUID;

@Data
public class KanbanTaskDeleteReqDto {

    private String username;
    private UUID taskId;
    private UUID projectId;
}
