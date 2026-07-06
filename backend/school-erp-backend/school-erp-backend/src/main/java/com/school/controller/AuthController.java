package com.school.controller;

import com.school.dto.AuthResponse;
import com.school.dto.LoginRequest;
import com.school.dto.PasswordChangeRequest;
import com.school.entity.LoginHistory;
import com.school.entity.User;
import com.school.exception.BadRequestException;
import com.school.exception.ResourceNotFoundException;
import com.school.repository.LoginHistoryRepository;
import com.school.repository.UserRepository;
import com.school.security.JwtService;
import com.school.service.AuditLogService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final LoginHistoryRepository loginHistoryRepository;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;
    private final AuditLogService auditLogService;

    @PostMapping("/login")
    public AuthResponse login(
            @RequestBody LoginRequest request,
            HttpServletRequest servletRequest) {

        String ipAddress = servletRequest.getRemoteAddr();
        User user = userRepository.findByUsername(request.getUsername())
                .orElse(null);

        if (user == null) {
            // Log failed attempt for unknown user
            LoginHistory history = LoginHistory.builder()
                    .username(request.getUsername())
                    .ipAddress(ipAddress)
                    .status("FAILED")
                    .build();
            loginHistoryRepository.save(history);
            throw new ResourceNotFoundException("User Not Found");
        }

        if (Boolean.TRUE.equals(user.getLocked())) {
            recordFailedAttempt(user, ipAddress);
            throw new BadRequestException("Your account is locked. Please contact the administrator.");
        }

        if (Boolean.FALSE.equals(user.getEnabled())) {
            recordFailedAttempt(user, ipAddress);
            throw new BadRequestException("Your account is deactivated.");
        }

        if (!encoder.matches(request.getPassword(), user.getPassword())) {
            int attempts = (user.getFailedLoginAttempts() != null ? user.getFailedLoginAttempts() : 0) + 1;
            user.setFailedLoginAttempts(attempts);
            if (attempts >= 5) {
                user.setLocked(true);
                userRepository.save(user);
                recordFailedAttempt(user, ipAddress);
                auditLogService.log(user.getUsername(), user.getRole().name(), "ACCOUNT_LOCKED", "Account locked due to 5 consecutive failed login attempts");
                throw new BadRequestException("Your account has been locked due to 5 consecutive failed attempts. Contact admin.");
            }
            userRepository.save(user);
            recordFailedAttempt(user, ipAddress);
            throw new BadRequestException("Invalid Password");
        }

        // Successful Login
        user.setFailedLoginAttempts(0);
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        LoginHistory history = LoginHistory.builder()
                .user(user)
                .username(user.getUsername())
                .ipAddress(ipAddress)
                .status("SUCCESS")
                .build();
        loginHistoryRepository.save(history);

        auditLogService.log(user.getUsername(), user.getRole().name(), "USER_LOGIN", "User logged in successfully");

        String token = jwtService.generateToken(
                user.getId(),
                user.getUsername(),
                user.getRole().name(),
                user.getDisplayName() != null ? user.getDisplayName() : user.getUsername()
        );

        return new AuthResponse(token);
    }

    @PostMapping("/change-password")
    public String changePassword(
            @RequestBody PasswordChangeRequest request,
            Principal principal) {

        if (principal == null) {
            throw new BadRequestException("User not authenticated");
        }

        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!encoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password does not match");
        }

        user.setPassword(encoder.encode(request.getNewPassword()));
        user.setPasswordChanged(true);
        userRepository.save(user);

        auditLogService.log(user.getUsername(), user.getRole().name(), "PASSWORD_RESET", "Password changed by user");

        return "Password changed successfully";
    }

    private void recordFailedAttempt(User user, String ipAddress) {
        LoginHistory history = LoginHistory.builder()
                .user(user)
                .username(user.getUsername())
                .ipAddress(ipAddress)
                .status("FAILED")
                .build();
        loginHistoryRepository.save(history);
    }
}