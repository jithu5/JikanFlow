package com.core.jikanflow.service;

import com.core.jikanflow.entities.Project;
import com.core.jikanflow.entities.User;
import com.core.jikanflow.repository.ProjectRepo;
import com.core.jikanflow.repository.UserRepo;
import com.core.jikanflow.requestDTOS.ProjectReqDto;
import com.core.jikanflow.responseDTOS.NoteResDto;
import com.core.jikanflow.responseDTOS.ProjectDetailedResDto;
import com.core.jikanflow.responseDTOS.ProjectResDto;
import com.core.jikanflow.responseDTOS.TaskResDto;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ProjectService {

    private final ProjectRepo projectRepo;
    private final UserRepo userRepo;

    private ProjectDetailedResDto convertToProjectDetailedDto(Project project) {
        ProjectDetailedResDto dto = new ProjectDetailedResDto();
        dto.setId(project.getId());
        dto.setTitle(project.getTitle());
        dto.setDescription(project.getDescription());
        dto.setCreatedAt(project.getCreatedAt());
        dto.setUsername(project.getUser().getUsername());
//        dto.setUpdatedAt(project.getUpdatedAt());

        List<TaskResDto> taskDtos = project.getTasks().stream().map(task -> {
            TaskResDto taskDto = new TaskResDto();
            taskDto.setId(task.getId());
            taskDto.setName(task.getName());
            taskDto.setStatus(task.getStatus());
            taskDto.setPriority(task.getPriority());
            taskDto.setDue(task.getDue());

            List<NoteResDto> noteDtos = task.getNotes().stream().map(note -> {
                NoteResDto noteDto = new NoteResDto();
                noteDto.setId(note.getId());
                noteDto.setSubject(note.getSubject());
                noteDto.setBody(note.getBody());

                noteDto.setCreatedAt(note.getCreatedAt());
                return noteDto;
            }).toList();

            taskDto.setNotes(noteDtos);
            return taskDto;
        }).toList();

        dto.setTasks(taskDtos);
        return dto;
    }


    public ProjectResDto createNewProject(ProjectReqDto newProjectDto) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Project project = new Project();
        project.setTitle(newProjectDto.getTitle());
        project.setDescription(newProjectDto.getDescription());
        project.setUser(user);

        Project saved = projectRepo.save(project);

        // Map to response DTO
        ProjectResDto resDto = new ProjectResDto();
        resDto.setId(saved.getId());
        resDto.setTitle(saved.getTitle());
        resDto.setDescription(saved.getDescription());
        resDto.setUsername(user.getUsername());

        return resDto;
    }

    public List<ProjectResDto> findAllProjects() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Project> projects = projectRepo.findByUserId(user.getId());

        return projects.stream().map(p -> {
            ProjectResDto dto = new ProjectResDto();
            dto.setId(p.getId());
            dto.setTitle(p.getTitle());
            dto.setDescription(p.getDescription());
            dto.setUsername(user.getUsername());
            return dto;
        }).collect(Collectors.toList());
    }


    public void deleteProjectById(UUID projectId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Project project = projectRepo.findById(projectId).orElseThrow(
                ()-> new RuntimeException("Project not found")
        );

        if (project.getUser().getId().equals(user.getId())){
            projectRepo.deleteById(projectId);
        }else {
            throw new RuntimeException("Unauthorized to delete");
        }
    }

    public ProjectDetailedResDto findProjectById(UUID projectId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        // Get authenticated user
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Fetch project
        Project project = projectRepo.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // Verify ownership
        if (!project.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access");
        }

        // Build and return DTO
        return convertToProjectDetailedDto(project);
    }
}
