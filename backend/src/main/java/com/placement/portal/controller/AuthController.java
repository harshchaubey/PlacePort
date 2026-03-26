package com.placement.portal.controller;

import com.placement.portal.dto.UserResponseDTO;
import com.placement.portal.dto.auth.AuthResponse;
import com.placement.portal.dto.auth.LoginRequest;
import com.placement.portal.dto.auth.LoginResponse;
import com.placement.portal.dto.auth.RegisterRequest;
import com.placement.portal.entity.User;
import com.placement.portal.repository.UserRepository;
import com.placement.portal.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request){
        authService.register(request);
        return new ResponseEntity<> (new AuthResponse("User registered successfully"),
                HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> Login(@Valid @RequestBody LoginRequest request){

        String token = authService.login(request.getEmail(), request.getPassword());

        return  ResponseEntity.ok(new LoginResponse(token));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {

        if(authentication == null) { throw new RuntimeException("Authentication object is null"); }
        String email = authentication.getName(); // ✅ correct way

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(Map.of(
                "email", user.getEmail(),
                "role", user.getRole()
        ));
    }


}
