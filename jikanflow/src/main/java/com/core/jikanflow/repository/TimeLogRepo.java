package com.core.jikanflow.repository;

import com.core.jikanflow.entities.TimeLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TimeLogRepo extends JpaRepository<TimeLog, UUID> {
}
