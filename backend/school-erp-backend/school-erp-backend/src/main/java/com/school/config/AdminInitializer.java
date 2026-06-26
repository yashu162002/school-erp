package com.school.config;

import com.school.entity.Role;
import com.school.entity.User;
import com.school.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {

    private static final String ADMIN_USERNAME = "admin";
    private static final String ADMIN_PASSWORD = "admin123";

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;

    @Override
    public void run(String... args) {
        userRepository.findByUsername(ADMIN_USERNAME).ifPresentOrElse(
                existing -> {
                    if (!encoder.matches(ADMIN_PASSWORD, existing.getPassword())) {
                        existing.setPassword(encoder.encode(ADMIN_PASSWORD));
                        userRepository.save(existing);
                        System.out.println("Admin password updated successfully");
                    }
                },
                () -> {
                    User admin = User.builder()
                            .username(ADMIN_USERNAME)
                            .email("admin@school.com")
                            .password(encoder.encode(ADMIN_PASSWORD))
                            .role(Role.ADMIN)
                            .enabled(true)
                            .build();

                    userRepository.save(admin);
                    System.out.println("Default Admin Created Successfully");
                });
    }
}
