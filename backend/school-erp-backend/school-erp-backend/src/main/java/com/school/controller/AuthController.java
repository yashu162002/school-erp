package com.school.controller;

import com.school.dto.AuthResponse;
import com.school.dto.LoginRequest;
import com.school.entity.User;
import com.school.exception.BadRequestException;
import com.school.exception.ResourceNotFoundException;
import com.school.repository.UserRepository;
import com.school.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository repository;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;

    @PostMapping("/login")
    public AuthResponse login(
            @RequestBody LoginRequest request) {

        User user = repository
                .findByUsername(request.getUsername())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User Not Found"));

        if (!encoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new BadRequestException(
                    "Invalid Password");
        }

        String token = jwtService.generateToken(
                user.getUsername());

        return new AuthResponse(token);
    }
}