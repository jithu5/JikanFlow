package com.core.jikanflow.kanban.service;

import com.core.jikanflow.kanban.config.JwtUtils;
import com.core.jikanflow.kanban.entities.User;
import com.core.jikanflow.kanban.repository.UserRepo;
import com.core.jikanflow.kanban.requestDTOS.LoginDto;
import com.core.jikanflow.kanban.requestDTOS.RegisterDto;
import com.core.jikanflow.kanban.responseDTOS.JwtResponse;
import com.core.jikanflow.kanban.responseDTOS.UserResDto;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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

    public User findByUsername(String username) {
        return userRepo.findByUsername(username).orElseThrow(
                ()-> new UsernameNotFoundException("User not found")
        );
    }


    public UserResDto getUserData() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = findByUsername(username);

        UserResDto userResDto = new UserResDto();
        userResDto.setUsername(user.getUsername());
        userResDto.setEmail(user.getEmail());
        return userResDto;
    }
}
