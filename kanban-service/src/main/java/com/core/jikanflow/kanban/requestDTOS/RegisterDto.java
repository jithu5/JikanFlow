package com.core.jikanflow.kanban.requestDTOS;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterDto {

    @Size(min = 3,max = 20, message = "Username must have minimum 3 characters and maximum 20.")
    private String username;

    @Email(message = "Email should be a valid one.")
    private String email;

    @Size(min = 8,message = "Password should be minimum of 8 characters.")
    private String password;
}
