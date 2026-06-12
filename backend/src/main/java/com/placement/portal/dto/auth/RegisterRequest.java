package com.placement.portal.dto.auth;

import com.placement.portal.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    @NotBlank(message =" Password is required")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{5,}$", message = "Password must be at least 5 characters long and contain at least one digit, one lowercase letter, one uppercase letter, and one special character")
    private String password;

    @NotNull(message = "Role is required")
    public Role role;
}
