package com.core.jikanflow.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/main/user")
public class UserController {

    @GetMapping("/{token}")
    public void getUserData(){

    }
}
