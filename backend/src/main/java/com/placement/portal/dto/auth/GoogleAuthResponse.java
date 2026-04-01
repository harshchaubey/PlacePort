package com.placement.portal.dto.auth;

import com.placement.portal.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GoogleAuthResponse {
    private String token;
    private Role role;
    private boolean needsProfile;
}
