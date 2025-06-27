package com.core.jikanflow.responseDTOS;

import com.core.jikanflow.entities.User;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class ProjectResDto {
    private UUID id;
    private String title;
    private String description;
    private String createdBy;

    private List<UserResDto> users;

}
