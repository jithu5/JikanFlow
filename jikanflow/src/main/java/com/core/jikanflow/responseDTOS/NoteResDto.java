package com.core.jikanflow.responseDTOS;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class NoteResDto {
    private UUID id;
    private String subject;
    private String body;
    private LocalDateTime createdAt;
}
