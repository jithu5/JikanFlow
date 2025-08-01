package com.core.jikanflow.kanban.repository;

import com.core.jikanflow.kanban.entities.Project;
import com.core.jikanflow.kanban.entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TaskRepo extends JpaRepository<Task, UUID> {
    List<Task> findByProjectAndStatus(Project project, String status);

    List<Task> findByProjectId(UUID projectId);
}
