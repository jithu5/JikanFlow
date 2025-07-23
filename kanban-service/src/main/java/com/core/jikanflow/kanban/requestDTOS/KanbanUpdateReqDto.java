package com.core.jikanflow.kanban.requestDTOS;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class KanbanUpdateReqDto {
    private UUID projectId;
    public int index;
    private UUID taskId;
    private String toStatus;
    private String type;
    private String username;
}
