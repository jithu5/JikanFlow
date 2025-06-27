package com.core.jikanflow.repository;

import com.core.jikanflow.entities.Project;
import com.core.jikanflow.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ProjectRepo extends JpaRepository<Project, UUID> {

    List<Project> findAllByCreatedBy(User user);

}
