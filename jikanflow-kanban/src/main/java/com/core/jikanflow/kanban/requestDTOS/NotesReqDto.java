package com.core.jikanflow.kanban.requestDTOS;

import lombok.Data;

import java.util.UUID;

@Data
public class NotesReqDto {

    private String subject;

    private String body;

    private UUID taskId;

    private UUID projectId;

}
