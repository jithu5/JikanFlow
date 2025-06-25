package com.core.jikanflow.service;

import com.core.jikanflow.config.JwtUtils;
import com.core.jikanflow.entities.User;
import com.core.jikanflow.repository.UserRepo;
import com.core.jikanflow.requestDTOS.LoginDto;
import com.core.jikanflow.requestDTOS.RegisterDto;
import com.core.jikanflow.responseDTOS.JwtResponse;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class UserService {
    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

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

    public JwtResponse loginUser(LoginDto user) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(),user.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String token = jwtUtils.generateJwtToken(userDetails);
        return new JwtResponse(token);
    }
}
