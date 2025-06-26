package com.core.jikanflow.controllers;

import com.core.jikanflow.entities.Project;
import com.core.jikanflow.requestDTOS.ProjectReqDto;
import com.core.jikanflow.responseDTOS.ProjectResDto;
import com.core.jikanflow.service.ProjectService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api/main/projects")
@AllArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    private static final Logger log = LoggerFactory.getLogger(ProjectController.class);

    @PostMapping("/create")
    public ResponseEntity<?> createNewProject(@Valid @RequestBody ProjectReqDto newProject){
        log.info(newProject.toString());
        try {
            ProjectResDto savedProject = projectService.createNewProject(newProject);
            return ResponseEntity.ok().body(savedProject);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllProjects(){
        try {
            List<ProjectResDto> projects = projectService.findAllProjects();
            return ResponseEntity.ok().body(projects);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

}
