package com.core.jikanflow.repository;

import com.core.jikanflow.entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TaskRepo extends JpaRepository<Task, UUID> {
}
