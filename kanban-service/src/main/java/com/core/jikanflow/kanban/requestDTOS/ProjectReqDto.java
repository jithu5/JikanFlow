package com.core.jikanflow.kanban.requestDTOS;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProjectReqDto {

    @Size(max = 100, message = "Title can be at most 100 characters")
    private String title;

    @Size(max = 1000, message = "Description can be at most 1000 characters")
    private String description;

}
