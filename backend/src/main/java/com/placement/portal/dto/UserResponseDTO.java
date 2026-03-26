package com.placement.portal.dto;

import com.placement.portal.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserResponseDTO {
    private String email;
    private Role role;
}
