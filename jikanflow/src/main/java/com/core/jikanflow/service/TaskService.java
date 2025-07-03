package com.core.jikanflow.service;

import com.core.jikanflow.entities.Project;
import com.core.jikanflow.entities.Task;
import com.core.jikanflow.entities.User;
import com.core.jikanflow.repository.ProjectRepo;
import com.core.jikanflow.repository.TaskRepo;
import com.core.jikanflow.repository.UserRepo;
import com.core.jikanflow.requestDTOS.TaskReqDto;
import com.core.jikanflow.responseDTOS.NoteResDto;
import com.core.jikanflow.responseDTOS.TaskResDto;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@AllArgsConstructor
public class TaskService {
    private final TaskRepo taskRepo;
    private final UserRepo userRepo;
    private final ProjectRepo projectRepo;

    public TaskResDto createNewTask(TaskReqDto newTask) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username).orElseThrow(
                () -> new UsernameNotFoundException("User not found")
        );

        Project project = projectRepo.findById(newTask.getProjectId()).orElseThrow(
                ()-> new RuntimeException("Project not found")
        );

        if (user.getId().equals(project.getCreatedBy().getId())){
            Task task = new Task();
            task.setName(newTask.getName());
            task.setDescription(newTask.getDescription());
            task.setOrderIndex(newTask.getOrderIndex());
            task.setDue(newTask.getDue());
            task.setStatus(newTask.getStatus());
            task.setPriority(newTask.getPriority());
            task.setProject(project);
            task.setCreatedBy(user);

            Task savedTask = taskRepo.save(task);

            // Convert entity to DTO
            TaskResDto taskResDto = new TaskResDto();
            taskResDto.setId(savedTask.getId());
            taskResDto.setName(savedTask.getName());
            taskResDto.setDescription(savedTask.getDescription());
            taskResDto.setStatus(savedTask.getStatus());
            taskResDto.setPriority(savedTask.getPriority());
            taskResDto.setOrderIndex(savedTask.getOrderIndex());
            taskResDto.setDue(savedTask.getDue());
            taskResDto.setCreatedAt(savedTask.getCreatedAt());

            return taskResDto;
        }
        throw new RuntimeException("Unauthorized to create task for this project");
    }

    public TaskResDto findTaskById(UUID taskId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username).orElseThrow(
                ()-> new UsernameNotFoundException("User not found")
        );

        Task task = taskRepo.findById(taskId).orElseThrow(
                ()-> new RuntimeException("Task not found")
        );

        TaskResDto taskResDto = new TaskResDto();

        taskResDto.setId(task.getId());
        taskResDto.setName(task.getName());
        taskResDto.setDescription(task.getDescription());
        taskResDto.setStatus(task.getStatus());
        taskResDto.setPriority(task.getPriority());
        taskResDto.setOrderIndex(task.getOrderIndex());
        taskResDto.setDue(task.getDue());
        task.setCreatedAt(task.getCreatedAt());
        taskResDto.setNotes(task.getNotes().stream().map( n ->{
            NoteResDto noteResDto = new NoteResDto();

            noteResDto.setId(n.getId());
            noteResDto.setSubject(n.getSubject());
            noteResDto.setBody(n.getBody());
            noteResDto.setCreatedAt(n.getCreatedAt());

            return noteResDto;
        }).toList()
        );
        return taskResDto;
    }

    @Transactional
    public void saveTaskPositions(UUID projectId, int index, UUID taskId, String toStatus, Principal principal) {
        // Authenticate user
        String username = principal.getName();
        User user = userRepo.findByUsername(username).orElseThrow(
                () -> new UsernameNotFoundException("User not found")
        );

        // Validate project
        Project project = projectRepo.findById(projectId).orElseThrow(
                () -> new RuntimeException("Project not found")
        );

        if (project.getUsers().stream().noneMatch(u -> u.getId().equals(user.getId()))) {
            throw new RuntimeException("Unauthorized to update tasks for this project");
        }

        Task task = taskRepo.findById(taskId).orElseThrow(
                ()-> new RuntimeException("Task not found")
        );

        if (task.getStatus().equals(toStatus)){
            task.setOrderIndex(index);
            taskRepo.save(task);
        }else{
            if (Objects.equals(toStatus, "IN PROGRESS"))
                toStatus = "IN_PROGRESS";
            task.setStatus(toStatus);
            task.setOrderIndex(index);
            taskRepo.save(task);
        }
    }

    public List<TaskResDto> findTaskByProjectId(UUID projectId) {
        // Authenticate user
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username).orElseThrow(
                () -> new UsernameNotFoundException("User not found")
        );

        // Validate project
        Project project = projectRepo.findById(projectId).orElseThrow(
                () -> new RuntimeException("Project not found")
        );

        if (project.getUsers().stream().noneMatch(u-> u.getId().equals(user.getId()))){
            throw new RuntimeException("Unauthorized");
        }

        // Fetch tasks
        List<Task> tasks = taskRepo.findByProjectId(projectId);

        // Map to DTOs
        return tasks.stream().map(t -> {
            TaskResDto dto = new TaskResDto();
            dto.setId(t.getId());
            dto.setName(t.getName());
            dto.setDescription(t.getDescription());
            dto.setDue(t.getDue());
            dto.setOrderIndex(t.getOrderIndex());
            dto.setStatus(t.getStatus());
            dto.setPriority(t.getPriority());
            dto.setCreatedAt(t.getCreatedAt());
            return dto;
        }).toList();
    }

    @Transactional
    public TaskResDto findTaskByIdForSocket(UUID taskId, Principal principal) {

        String username = principal.getName();
        User user = userRepo.findByUsername(username).orElseThrow(
                ()-> new UsernameNotFoundException("User not found")
        );
        Task task = taskRepo.findById(taskId).orElseThrow(
                ()-> new RuntimeException("Task not found")
        );

        TaskResDto taskResDto = new TaskResDto();

        taskResDto.setId(task.getId());
        taskResDto.setName(task.getName());
        taskResDto.setDescription(task.getDescription());
        taskResDto.setStatus(task.getStatus());
        taskResDto.setPriority(task.getPriority());
        taskResDto.setOrderIndex(task.getOrderIndex());
        taskResDto.setDue(task.getDue());
        task.setCreatedAt(task.getCreatedAt());
        taskResDto.setNotes(task.getNotes().stream().map( n ->{
                    NoteResDto noteResDto = new NoteResDto();

                    noteResDto.setId(n.getId());
                    noteResDto.setSubject(n.getSubject());
                    noteResDto.setBody(n.getBody());
                    noteResDto.setCreatedAt(n.getCreatedAt());

                    return noteResDto;
                }).toList()
        );
        return taskResDto;
    }

    public void deleteTaskById(UUID taskId) {
        taskRepo.deleteById(taskId);
    }
}
