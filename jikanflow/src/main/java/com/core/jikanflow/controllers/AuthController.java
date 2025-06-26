package com.core.jikanflow.controllers;

import com.core.jikanflow.entities.User;
import com.core.jikanflow.requestDTOS.LoginDto;
import com.core.jikanflow.requestDTOS.RegisterDto;
import com.core.jikanflow.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterDto newUser) {
        try {
            User user = userService.registerUser(newUser);
            return ResponseEntity.ok("Registered successfully: " + user.getUsername());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Something went wrong");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginDto user) {
        try {
            // ✅ Return JWT token in response
            return ResponseEntity.ok(userService.loginUser(user));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }
}
