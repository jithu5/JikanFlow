package com.core.jikanflow.kanban.repository;

import com.core.jikanflow.kanban.entities.Note;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface NoteRepo extends JpaRepository<Note, UUID> {
}
