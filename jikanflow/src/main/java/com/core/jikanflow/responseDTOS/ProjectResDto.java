package com.core.jikanflow.responseDTOS;

import lombok.Data;

import java.util.UUID;

@Data
public class ProjectResDto {
    private UUID id;
    private String title;
    private String description;
    private String username;
}
