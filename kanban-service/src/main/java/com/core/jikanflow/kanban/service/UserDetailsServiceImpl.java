package com.core.jikanflow.kanban.service;

import com.core.jikanflow.kanban.entities.User;
import com.core.jikanflow.kanban.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepo userRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user =  userRepo.findByUsername(username).orElseThrow(
                ()->  new UsernameNotFoundException("User with this username is not found in database.")
        );
        return UserDetailsImpl.build(user);
    }
}
