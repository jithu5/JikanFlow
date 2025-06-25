package com.core.jikanflow.repository;

import com.core.jikanflow.entities.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ProjectRepo extends JpaRepository<Project, UUID> {
}
