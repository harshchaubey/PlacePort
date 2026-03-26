package com.placement.portal.service;

import com.placement.portal.dto.auth.RegisterRequest;

public interface AuthService {
    void register (RegisterRequest request);
    String login(String email,String password);
}
