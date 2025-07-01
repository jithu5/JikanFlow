package com.core.jikanflow.service;

import com.core.jikanflow.entities.Project;
import com.core.jikanflow.entities.User;
import com.core.jikanflow.repository.ProjectRepo;
import com.core.jikanflow.repository.UserRepo;
import com.core.jikanflow.requestDTOS.ProjectReqDto;
import com.core.jikanflow.responseDTOS.*;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ProjectService {

    private final ProjectRepo projectRepo;
    private final UserRepo userRepo;

    private ProjectResDto convertToProjectDetailedDto(Project project) {
        ProjectResDto dto = new ProjectResDto();
        dto.setId(project.getId());
        dto.setTitle(project.getTitle());
        dto.setDescription(project.getDescription());
        dto.setCreatedAt(project.getCreatedAt());
        dto.setCreatedBy(project.getCreatedBy().getUsername());
        dto.setUsers(project.getUsers().stream().map( u ->{
            UserResDto userResDto = new UserResDto();
            userResDto.setUsername(u.getUsername());
            userResDto.setEmail(u.getEmail());
            return userResDto;
        }).toList()
        );
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
        project.setCreatedBy(user);
        project.setUsers(new ArrayList<>(List.of(user))); // 👈 Add current user to list

        Project saved = projectRepo.save(project);

        ProjectResDto resDto = new ProjectResDto();
        resDto.setId(saved.getId());
        resDto.setTitle(saved.getTitle());
        resDto.setDescription(saved.getDescription());
        resDto.setUsers(saved.getUsers().stream().map( u -> {
            UserResDto userResDto = new UserResDto();
            userResDto.setEmail(u.getEmail());
            userResDto.setUsername(u.getUsername());
            return userResDto;
        }).toList());
        resDto.setCreatedBy(user.getUsername()); // optional: maybe show "Created by"
        return resDto;
    }

    public List<ProjectResDto> findAllProjects() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Get projects the user is a member of
        List<Project> projects = projectRepo.findAllByUsers_Id(user.getId());

        return projects.stream()
                .map(this::convertToProjectDetailedDto)
                .collect(Collectors.toList());
    }



    public void deleteProjectById(UUID projectId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Project project = projectRepo.findById(projectId).orElseThrow(
                ()-> new RuntimeException("Project not found")
        );

        if (project.getCreatedBy().getId().equals(user.getId())){
            projectRepo.deleteById(projectId);
        }else {
            throw new RuntimeException("Unauthorized to delete");
        }
    }

    public ProjectResDto findProjectById(UUID projectId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        // Get authenticated user
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Fetch project
        Project project = projectRepo.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        if(project.getUsers().stream().noneMatch(u -> u.getUsername().equals(username))){
            throw new RuntimeException("Unauthorized");
        }

        // Build and return DTO
        return convertToProjectDetailedDto(project);
    }

    public void addNewMember(UUID projectId, UUID userId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepo.findByUsername(username).orElseThrow(
                ()-> new UsernameNotFoundException("User not found")
        );

        if (user.getId().equals(userId)){
            Project project = projectRepo.findById(projectId).orElseThrow(
                    ()-> new RuntimeException("Project not found")
            );

            // Check if authenticated user is part of the project
            boolean isMember = project.getUsers().stream()
                    .anyMatch(u -> u.getId().equals(user.getId()));

            if (isMember) {
                throw new RuntimeException("User is already added to this project.");
            }

            // add user
            project.getUsers().add(user);
            projectRepo.save(project);
        }
    }

    @Transactional
    public ProjectResDto findProjectByIdForSocket(UUID projectId, Principal principal) {
        String username = principal.getName();
        // Fetch project
        Project project = projectRepo.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        if(project.getUsers().stream().noneMatch(u -> u.getUsername().equals(username))){
            throw new RuntimeException("Unauthorized");
        }

        // Build and return DTO
        return convertToProjectDetailedDto(project);
    }
}
