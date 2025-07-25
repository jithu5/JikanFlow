package com.core.jikanflow.kanban.repository;

import com.core.jikanflow.kanban.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepo extends JpaRepository<User, UUID> {
    Optional<User> findByUsername(String username);

    Optional<User> findByUsernameOrEmail(String username, String email);
}
