package com.core.jikanflow.kanban.repository;

import com.core.jikanflow.kanban.entities.Project;
import com.core.jikanflow.kanban.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ProjectRepo extends JpaRepository<Project, UUID> {

    List<Project> findAllByCreatedBy(User user);

    @Query("SELECT p FROM Project p JOIN p.users u WHERE u.id = :userId")
    List<Project> findAllByUsers(@Param("userId") UUID userId);

    List<Project> findAllByUsers_Id(UUID id);
}
