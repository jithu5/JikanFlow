package com.core.jikanflow.requestDTOS;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class KanbanUpdateReqDto {
    private UUID projectId;
    public int index;
    private UUID taskId;
    private String toStatus;
}
