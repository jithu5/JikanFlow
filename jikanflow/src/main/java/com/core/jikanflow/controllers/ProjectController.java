package com.core.jikanflow.controllers;

import com.core.jikanflow.requestDTOS.ProjectReqDto;
import com.core.jikanflow.responseDTOS.ProjectResDto;
import com.core.jikanflow.service.ProjectService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(path = "/api/main/projects")
@AllArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping("/create")
    public ResponseEntity<?> createNewProject(@Valid @RequestBody ProjectReqDto newProject){
        try {
            ProjectResDto savedProject = projectService.createNewProject(newProject);
            return ResponseEntity.accepted().body(savedProject);
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

    @GetMapping("/get/{projectId}")
    public ResponseEntity<?> getProjectById(@PathVariable UUID projectId){
        try {
            ProjectResDto projects = projectService.findProjectById(projectId);
            return ResponseEntity.ok().body(projects);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @DeleteMapping("/delete/{projectId}")
    public ResponseEntity<?> deleteProjectById(@PathVariable UUID projectId){
        try {
            projectService.deleteProjectById(projectId);
            return ResponseEntity.ok().body("Deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("{projectId}/{userId}")
    public ResponseEntity<?> addNewMember(@PathVariable UUID projectId, @PathVariable UUID userId){
        try {
            projectService.addNewMember(projectId,userId);
            return ResponseEntity.accepted().body("User added to the project successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

}
