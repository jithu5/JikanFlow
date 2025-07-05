package com.core.jikanflow.controllers;

import com.core.jikanflow.requestDTOS.NotesReqDto;
import com.core.jikanflow.responseDTOS.TaskResDto;
import com.core.jikanflow.service.NotesService;
import com.core.jikanflow.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/main/notes")
@RequiredArgsConstructor
public class NotesController {
    private final NotesService notesService;
    private final TaskService taskService;

    @PostMapping("/create")
    public ResponseEntity<?> createNewNote(@RequestBody NotesReqDto newNote){
        try {
            notesService.createNewNote(newNote);
            return ResponseEntity.accepted().body("Note created successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("/get-all/{taskId}")
    public ResponseEntity<?> getAllNotes(@PathVariable UUID taskId){
        try {
            TaskResDto taskResDto = taskService.findTaskById(taskId);
            return ResponseEntity.ok().body(taskResDto);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PatchMapping("/pin/{noteId}")
    public ResponseEntity<?> updatePin(@PathVariable UUID noteId){
        try {
            notesService.updatePin(noteId);
            return ResponseEntity.ok().body("Pinned successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @DeleteMapping("/delete/{noteId}")
    public ResponseEntity<?> deleteNoteById(@PathVariable UUID noteId){
        try {
            notesService.deleteNoteById(noteId);
            return ResponseEntity.ok().body("Note deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PutMapping("/update/{noteId}")
    public ResponseEntity<?> updateNoteById(@PathVariable UUID noteId,
                                            @RequestBody NotesReqDto updateNote){
        try {
            notesService.updateNoteById(noteId, updateNote);
            return ResponseEntity.accepted().body("Note updated successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }


}
