package com.core.jikanflow.service;

import com.core.jikanflow.entities.Project;
import com.core.jikanflow.entities.User;
import com.core.jikanflow.repository.ProjectRepo;
import com.core.jikanflow.repository.UserRepo;
import com.core.jikanflow.requestDTOS.ProjectReqDto;
import com.core.jikanflow.responseDTOS.ProjectResDto;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ProjectService {

    private final ProjectRepo projectRepo;
    private final UserRepo userRepo;

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


}
