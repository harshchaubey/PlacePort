package com.placement.portal.service;


import com.placement.portal.dto.auth.RegisterRequest;
import com.placement.portal.entity.User;
import com.placement.portal.repository.UserRepository;
import com.placement.portal.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public void register(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();

        userRepository.save(user);
    }

    @Override
    public String login(String email, String password){
         User user = userRepository.findByEmail(email)
                 .orElseThrow(() -> new RuntimeException("Invalid email or password"));

         if(!passwordEncoder.matches(password, user.getPassword())){
             throw new RuntimeException("Invalid password");
         }

         return jwtUtil.generateToken(user.getEmail());
    }
}