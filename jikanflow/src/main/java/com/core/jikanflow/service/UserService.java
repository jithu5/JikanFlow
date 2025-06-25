package com.core.jikanflow.service;

import com.core.jikanflow.entities.User;
import com.core.jikanflow.repository.UserRepo;
import com.core.jikanflow.requestDTOS.RegisterDto;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class UserService {
    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;

    public User registerUser(RegisterDto newUser){
        // check if user exists with username or email
        Optional<User> existingUser = userRepo.findByUsernameOrEmail(newUser.getUsername(),newUser.getEmail());
        if (existingUser.isPresent()) {
            throw new IllegalArgumentException("Username or email already exists");
        }
        // create new user
        User user = new User();

        user.setUsername(newUser.getUsername());
        user.setEmail(newUser.getEmail());
        // Encode password before saving
        String encodedPassword = passwordEncoder.encode(newUser.getPassword());
        user.setPassword(encodedPassword);

        return userRepo.save(user);
    }
}
