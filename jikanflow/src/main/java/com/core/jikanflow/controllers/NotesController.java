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


}
