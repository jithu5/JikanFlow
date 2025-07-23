package com.core.jikanflow.kanban.service;

import com.core.jikanflow.kanban.entities.Note;
import com.core.jikanflow.kanban.entities.Project;
import com.core.jikanflow.kanban.entities.Task;
import com.core.jikanflow.kanban.entities.User;
import com.core.jikanflow.kanban.repository.NoteRepo;
import com.core.jikanflow.kanban.repository.ProjectRepo;
import com.core.jikanflow.kanban.repository.TaskRepo;
import com.core.jikanflow.kanban.repository.UserRepo;
import com.core.jikanflow.kanban.requestDTOS.NotesReqDto;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotesService {

    private final NoteRepo noteRepo;
    private final UserRepo userRepo;
    private final ProjectRepo projectRepo;
    private final TaskRepo taskRepo;

    public void createNewNote(NotesReqDto newNote) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username).orElseThrow(
                ()-> new UsernameNotFoundException("User not found")
        );

        Project project = projectRepo.findById(newNote.getProjectId()).orElseThrow(
                ()-> new RuntimeException("Project not found")
        );

        Task task = taskRepo.findById(newNote.getTaskId()).orElseThrow(
                ()-> new RuntimeException("Task not found")
        );

        if (project.getUsers().stream().noneMatch(u-> u.getId().equals(user.getId()))){
            throw new RuntimeException("Unauthorized");
        }

        Note note = new Note();

        note.setSubject(newNote.getSubject());
        note.setBody(newNote.getBody());
        note.setPinned(false);
        note.setTask(task);
        note.setProject(project);
        note.setUser(user);

        noteRepo.save(note);
    }

    @Transactional
    public void updatePin(UUID noteId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username).orElseThrow(
                ()-> new UsernameNotFoundException("User not found")
        );
        Note note = noteRepo.findById(noteId).orElseThrow(
                ()-> new RuntimeException("Note not found")
        );

        if (note.getTask().getProject().getUsers().stream().noneMatch(u-> u.getId().equals(user.getId()))){
            throw new RuntimeException("Unauthorized");
        }
        note.setPinned(!note.isPinned());
        noteRepo.save(note);
    }

    public void deleteNoteById(UUID noteId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username).orElseThrow(
                ()-> new UsernameNotFoundException("User not found")
        );
        Note note = noteRepo.findById(noteId).orElseThrow(
                ()-> new RuntimeException("Note not found")
        );

        if (note.getTask().getProject().getUsers().stream().noneMatch(u-> u.getId().equals(user.getId()))){
            throw new RuntimeException("Unauthorized");
        }
        noteRepo.deleteById(noteId);
    }

    public void updateNoteById(UUID noteId, NotesReqDto updateNote) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username).orElseThrow(
                ()-> new UsernameNotFoundException("User not found")
        );
        Note note = noteRepo.findById(noteId).orElseThrow(
                ()-> new RuntimeException("Note not found")
        );
        if (note.getTask().getProject().getUsers().stream().noneMatch(u-> u.getId().equals(user.getId()))){
            throw new RuntimeException("Unauthorized");
        }
        note.setSubject(updateNote.getSubject());
        note.setBody(updateNote.getBody());
        noteRepo.save(note);
    }
}
