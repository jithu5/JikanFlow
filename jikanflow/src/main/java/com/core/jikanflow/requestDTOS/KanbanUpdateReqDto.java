package com.core.jikanflow.requestDTOS;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class KanbanUpdateReqDto {
    private UUID projectId;
    public List<UpdateTaskReqDto> UpdatedTasks;
}
