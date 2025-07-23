package com.core.jikanflow.kanban.repository;

import com.core.jikanflow.kanban.entities.TimeLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TimeLogRepo extends JpaRepository<TimeLog, UUID> {
}
