package com.school.controller;

import com.school.dto.TeacherRequest;
import com.school.dto.TeacherResponse;
import com.school.entity.Teacher;
import com.school.entity.User;
import com.school.entity.LoginHistory;
import com.school.repository.TeacherRepository;
import com.school.repository.UserRepository;
import com.school.repository.LoginHistoryRepository;
import com.school.exception.ResourceNotFoundException;
import com.school.service.TeacherService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/teachers")
@RequiredArgsConstructor
public class TeacherController {

    private final TeacherService service;
    private final TeacherRepository repository;
    private final UserRepository userRepository;
    private final LoginHistoryRepository loginHistoryRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    public List<TeacherResponse> getAllTeachers() {
        return service.getAllTeachers();
    }

    @PostMapping
    public TeacherResponse addTeacher(@RequestBody TeacherRequest request) {
        return service.createTeacher(request);
    }

    @PutMapping("/{id}")
    public TeacherResponse updateTeacher(
            @PathVariable Long id,
            @RequestBody TeacherRequest request) {
        return service.updateTeacher(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteTeacher(
            @PathVariable Long id) {
        service.deleteTeacher(id);
    }

    @PostMapping("/{id}/reset-password")
    public Map<String, String> resetPassword(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {

        Teacher teacher = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        String plainPassword = (body != null && body.containsKey("password") && !body.get("password").trim().isEmpty())
                ? body.get("password")
                : generateStrongPassword();

        User user = userRepository.findByUsername(teacher.getEmployeeId())
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .username(teacher.getEmployeeId())
                            .email(teacher.getEmail() != null && !teacher.getEmail().trim().isEmpty() 
                                    ? teacher.getEmail() 
                                    : teacher.getEmployeeId() + "@school.com")
                            .password(passwordEncoder.encode(plainPassword))
                            .role(com.school.entity.Role.TEACHER)
                            .enabled(true)
                            .locked(false)
                            .displayName(teacher.getFirstName() + " " + (teacher.getLastName() != null ? teacher.getLastName() : ""))
                            .passwordChanged(false)
                            .build();
                    return userRepository.save(newUser);
                });

        user.setPassword(passwordEncoder.encode(plainPassword));
        user.setLastPasswordResetDate(java.time.LocalDateTime.now());
        if (body != null && Boolean.parseBoolean(body.get("forceChange"))) {
            user.setPasswordChanged(false);
        } else {
            user.setPasswordChanged(true);
        }
        userRepository.save(user);

        Map<String, String> response = new HashMap<>();
        response.put("username", teacher.getEmployeeId());
        response.put("password", plainPassword);
        return response;
    }

    @PostMapping("/{id}/toggle-login")
    public TeacherResponse toggleLogin(@PathVariable Long id) {
        Teacher teacher = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        User user = userRepository.findByUsername(teacher.getEmployeeId())
                .orElseGet(() -> {
                    String tempPwd = generateStrongPassword();
                    User newUser = User.builder()
                            .username(teacher.getEmployeeId())
                            .email(teacher.getEmail() != null && !teacher.getEmail().trim().isEmpty() 
                                    ? teacher.getEmail() 
                                    : teacher.getEmployeeId() + "@school.com")
                            .password(passwordEncoder.encode(tempPwd))
                            .role(com.school.entity.Role.TEACHER)
                            .enabled(true)
                            .locked(false)
                            .displayName(teacher.getFirstName() + " " + (teacher.getLastName() != null ? teacher.getLastName() : ""))
                            .passwordChanged(false)
                            .build();
                    return userRepository.save(newUser);
                });

        user.setEnabled(!Boolean.TRUE.equals(user.getEnabled()));
        userRepository.save(user);

        if (Boolean.TRUE.equals(user.getEnabled())) {
            teacher.setStatus("ACTIVE");
        } else {
            teacher.setStatus("INACTIVE");
        }
        repository.save(teacher);

        return service.getTeacher(id);
    }

    @PostMapping("/{id}/toggle-lock")
    public TeacherResponse toggleLock(@PathVariable Long id) {
        Teacher teacher = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        User user = userRepository.findByUsername(teacher.getEmployeeId())
                .orElseGet(() -> {
                    String tempPwd = generateStrongPassword();
                    User newUser = User.builder()
                            .username(teacher.getEmployeeId())
                            .email(teacher.getEmail() != null && !teacher.getEmail().trim().isEmpty() 
                                    ? teacher.getEmail() 
                                    : teacher.getEmployeeId() + "@school.com")
                            .password(passwordEncoder.encode(tempPwd))
                            .role(com.school.entity.Role.TEACHER)
                            .enabled(true)
                            .locked(false)
                            .displayName(teacher.getFirstName() + " " + (teacher.getLastName() != null ? teacher.getLastName() : ""))
                            .passwordChanged(false)
                            .build();
                    return userRepository.save(newUser);
                });

        user.setLocked(!Boolean.TRUE.equals(user.getLocked()));
        if (Boolean.FALSE.equals(user.getLocked())) {
            user.setFailedLoginAttempts(0);
            teacher.setStatus("ACTIVE");
        } else {
            teacher.setStatus("SUSPENDED");
        }
        userRepository.save(user);
        repository.save(teacher);

        return service.getTeacher(id);
    }

    @GetMapping("/{id}/login-history")
    public List<LoginHistory> getLoginHistory(@PathVariable Long id) {
        Teacher teacher = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        return loginHistoryRepository.findByUsernameOrderByAttemptedAtDesc(teacher.getEmployeeId());
    }

    private String generateStrongPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!*";
        java.security.SecureRandom random = new java.security.SecureRandom();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 10; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }
}