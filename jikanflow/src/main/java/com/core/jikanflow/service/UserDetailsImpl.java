package com.core.jikanflow.service;

import com.core.jikanflow.entities.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

@Data
@AllArgsConstructor
@Builder
public class UserDetailsImpl implements UserDetails{

    private final User user;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // You can return roles/authorities here if you add them later
        return Collections.emptyList(); // No roles yet
    }

    @Override
    public String getPassword() {
        return user.getPassword();  // Return actual password
    }

    @Override
    public String getUsername() {
        return user.getUsername(); // Return actual username
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // Change as per your logic
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Change as needed
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Change as needed
    }

    @Override
    public boolean isEnabled() {
        return true; // You can connect this with a field like `user.isEnabled()`
    }

    public static UserDetailsImpl build(User user){
        return new UserDetailsImpl(
                user
        );
    }
}
