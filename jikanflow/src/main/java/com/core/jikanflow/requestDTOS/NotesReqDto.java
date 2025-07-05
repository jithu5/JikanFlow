package com.core.jikanflow.requestDTOS;

import lombok.Data;

import java.util.UUID;

@Data
public class NotesReqDto {

    private String subject;

    private String body;

    private UUID taskId;

    private UUID projectId;

}
