package com.placement.portal.dto.auth;

import com.placement.portal.entity.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Email is required")
    private String email;
    @NotBlank(message =" Password is required")
    private String password;

    @NotNull(message = "Role is required")
    public Role Role;
}
