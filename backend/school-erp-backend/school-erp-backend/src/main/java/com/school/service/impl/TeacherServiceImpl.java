package com.school.service.impl;

import com.school.dto.TeacherRequest;
import com.school.dto.TeacherResponse;
import com.school.entity.Teacher;
import com.school.entity.User;
import com.school.entity.Role;
import com.school.exception.ResourceNotFoundException;
import com.school.repository.TeacherRepository;
import com.school.repository.UserRepository;
import com.school.service.TeacherService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TeacherServiceImpl implements TeacherService {

    private final TeacherRepository repository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public TeacherResponse createTeacher(TeacherRequest request) {
        String yearStr = String.valueOf(LocalDate.now().getYear());

        // Generate employeeId if blank
        String employeeId = request.getEmployeeId();
        if (employeeId == null || employeeId.trim().isEmpty()) {
            int seq = 1;
            do {
                employeeId = "TCH" + yearStr + String.format("%04d", seq++);
            } while (repository.existsByEmployeeId(employeeId));
        }

        Teacher teacher = Teacher.builder()
                .employeeId(employeeId)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .qualification(request.getQualification())
                .subject(request.getSubject())
                .experience(request.getExperience())
                .photoPath(request.getPhotoPath())
                .assignedClasses(request.getAssignedClasses())
                .assignedSections(request.getAssignedSections())
                .assignedSubjects(request.getAssignedSubjects())
                .department(request.getDepartment())
                .dob(request.getDob())
                .gender(request.getGender())
                .address(request.getAddress())
                .joiningDate(request.getJoiningDate() != null && !request.getJoiningDate().trim().isEmpty()
                        ? request.getJoiningDate()
                        : LocalDate.now().toString())
                .salary(request.getSalary())
                .employmentType(request.getEmploymentType())
                .status(request.getStatus() != null ? request.getStatus() : "ACTIVE")
                .build();

        Teacher saved = repository.save(teacher);

        // Create user login account
        String plainPassword = request.getPassword();
        if (plainPassword == null || plainPassword.trim().isEmpty()) {
            plainPassword = generateStrongPassword();
        }

        User user = User.builder()
                .username(employeeId)
                .email(resolveUniqueUserEmail(teacher.getEmail(), employeeId, null))
                .password(passwordEncoder.encode(plainPassword))
                .role(Role.TEACHER)
                .enabled(!"INACTIVE".equals(teacher.getStatus()) && !"SUSPENDED".equals(teacher.getStatus()))
                .locked("SUSPENDED".equals(teacher.getStatus()))
                .displayName(teacher.getFirstName() + " " + (teacher.getLastName() != null ? teacher.getLastName() : ""))
                .build();
        userRepository.save(user);

        TeacherResponse response = mapToResponse(saved);
        // Temporarily return plain password to display in UI on creation
        response.setCreatedAt(plainPassword); // We can piggyback this or return it in standard field if frontend expects it
        return response;
    }

    @Override
    public List<TeacherResponse> getAllTeachers() {
        return repository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public TeacherResponse getTeacher(Long id) {
        Teacher teacher = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher Not Found with ID: " + id));
        return mapToResponse(teacher);
    }

    @Override
    public TeacherResponse updateTeacher(Long id, TeacherRequest request) {
        Teacher existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher Not Found"));

        existing.setFirstName(request.getFirstName());
        existing.setLastName(request.getLastName());
        existing.setEmail(request.getEmail());
        existing.setPhone(request.getPhone());
        existing.setQualification(request.getQualification());
        existing.setSubject(request.getSubject());
        existing.setExperience(request.getExperience());
        existing.setPhotoPath(request.getPhotoPath());
        existing.setAssignedClasses(request.getAssignedClasses());
        existing.setAssignedSections(request.getAssignedSections());
        existing.setAssignedSubjects(request.getAssignedSubjects());
        existing.setDepartment(request.getDepartment());
        existing.setDob(request.getDob());
        existing.setGender(request.getGender());
        existing.setAddress(request.getAddress());
        existing.setJoiningDate(request.getJoiningDate());
        existing.setSalary(request.getSalary());
        existing.setEmploymentType(request.getEmploymentType());
        existing.setStatus(request.getStatus());

        Teacher saved = repository.save(existing);

        // Update corresponding User record email, displayName and active/locked state
        userRepository.findByUsername(existing.getEmployeeId()).ifPresent(user -> {
            user.setEmail(resolveUniqueUserEmail(existing.getEmail(), existing.getEmployeeId(), user.getId()));
            user.setDisplayName(existing.getFirstName() + " " + (existing.getLastName() != null ? existing.getLastName() : ""));
            user.setEnabled(!"INACTIVE".equals(existing.getStatus()) && !"SUSPENDED".equals(existing.getStatus()));
            user.setLocked("SUSPENDED".equals(existing.getStatus()));
            userRepository.save(user);
        });

        return mapToResponse(saved);
    }

    @Override
    public void deleteTeacher(Long id) {
        Teacher teacher = repository.findById(id).orElse(null);
        if (teacher != null) {
            userRepository.findByUsername(teacher.getEmployeeId()).ifPresent(userRepository::delete);
            repository.delete(teacher);
        }
    }

    private TeacherResponse mapToResponse(Teacher teacher) {
        User user = teacher.getEmployeeId() != null ? userRepository.findByUsername(teacher.getEmployeeId()).orElse(null) : null;
        Boolean active = user != null ? user.getEnabled() : true;
        Boolean locked = user != null ? user.getLocked() : false;

        return TeacherResponse.builder()
                .id(teacher.getId())
                .employeeId(teacher.getEmployeeId())
                .firstName(teacher.getFirstName())
                .lastName(teacher.getLastName())
                .email(teacher.getEmail())
                .phone(teacher.getPhone())
                .subject(teacher.getSubject())
                .qualification(teacher.getQualification())
                .experience(teacher.getExperience())
                .photoPath(teacher.getPhotoPath())
                .assignedClasses(teacher.getAssignedClasses())
                .assignedSections(teacher.getAssignedSections())
                .assignedSubjects(teacher.getAssignedSubjects())
                .department(teacher.getDepartment())
                .dob(teacher.getDob())
                .gender(teacher.getGender())
                .address(teacher.getAddress())
                .joiningDate(teacher.getJoiningDate())
                .salary(teacher.getSalary())
                .employmentType(teacher.getEmploymentType())
                .status(teacher.getStatus())
                .active(active)
                .locked(locked)
                .createdAt(teacher.getCreatedAt() != null ? teacher.getCreatedAt().toString() : null)
                .build();
    }

    private String resolveUniqueUserEmail(String requestedEmail, String username, Long userId) {
        if (requestedEmail == null || requestedEmail.trim().isEmpty()) {
            return username + "@school.com";
        }
        java.util.Optional<User> existing = userRepository.findByEmail(requestedEmail);
        if (existing.isPresent()) {
            User existingUser = existing.get();
            if (userId == null || !existingUser.getId().equals(userId)) {
                return username + "@school.com";
            }
        }
        return requestedEmail;
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