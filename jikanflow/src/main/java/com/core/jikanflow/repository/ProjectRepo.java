package com.core.jikanflow.repository;

import com.core.jikanflow.entities.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ProjectRepo extends JpaRepository<Project, UUID> {

    List<Project> findByUserId(UUID userId);
}
