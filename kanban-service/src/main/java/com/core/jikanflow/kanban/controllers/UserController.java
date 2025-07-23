package com.core.jikanflow.kanban.controllers;

import com.core.jikanflow.kanban.responseDTOS.UserResDto;
import com.core.jikanflow.kanban.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/main/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/data")
    public ResponseEntity<?> getUserData(){
        try {
            UserResDto userResDto = userService.getUserData();
            return ResponseEntity.ok().body(userResDto);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
}
