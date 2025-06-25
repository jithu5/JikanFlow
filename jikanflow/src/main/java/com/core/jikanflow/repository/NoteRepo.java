package com.core.jikanflow.repository;

import com.core.jikanflow.entities.Note;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface NoteRepo extends JpaRepository<Note, UUID> {
}
