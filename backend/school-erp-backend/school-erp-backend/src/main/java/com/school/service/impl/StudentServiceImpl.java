package com.school.service.impl;

import com.school.dto.StudentRequest;
import com.school.dto.StudentResponse;
import com.school.entity.Student;
import com.school.entity.User;
import com.school.entity.Role;
import com.school.entity.Parent;
import com.school.exception.ResourceNotFoundException;
import com.school.repository.StudentRepository;
import com.school.repository.UserRepository;
import com.school.repository.ParentRepository;
import com.school.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final StudentRepository repository;
    private final UserRepository userRepository;
    private final ParentRepository parentRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<StudentResponse> getAllStudents() {

        return repository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public StudentResponse getStudent(Long id) {

        Student student = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student Not Found"));

        return mapToResponse(student);
    }

    @Override
    public StudentResponse createStudent(
            StudentRequest request) {

        String yearStr = request.getAcademicYear() != null && request.getAcademicYear().length() >= 4
                ? request.getAcademicYear().substring(0, 4)
                : String.valueOf(LocalDate.now().getYear());

        // Generate studentId
        String studentId;
        int studentSeq = 1;
        do {
            studentId = "STU" + yearStr + String.format("%04d", studentSeq++);
        } while (repository.existsByStudentId(studentId));

        // Generate admissionNo if blank
        String admissionNo = request.getAdmissionNo();
        if (admissionNo == null || admissionNo.trim().isEmpty()) {
            int admSeq = 1;
            do {
                admissionNo = "ADM" + yearStr + String.format("%05d", admSeq++);
            } while (repository.existsByAdmissionNo(admissionNo));
        }

        LocalDate admDate = null;
        if (request.getAdmissionDate() != null && !request.getAdmissionDate().trim().isEmpty()) {
            try {
                admDate = LocalDate.parse(request.getAdmissionDate());
            } catch (Exception e) {
                // Ignore
            }
        }

        Student student = Student.builder()
                .admissionNo(admissionNo)
                .studentId(studentId)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .className(request.getClassName())
                .section(request.getSection())
                .studentPhone(request.getStudentPhone())
                .email(request.getEmail())
                .photoPath(request.getPhotoPath())
                .bloodGroup(request.getBloodGroup())
                .address(request.getAddress())
                .dob(request.getDob())
                .gender(request.getGender())
                .rollNo(request.getRollNo())
                .religion(request.getReligion())
                .category(request.getCategory())
                .fatherName(request.getFatherName())
                .motherName(request.getMotherName())
                .guardian(request.getGuardian())
                .academicYear(request.getAcademicYear() != null ? request.getAcademicYear() : yearStr)
                .admissionDate(admDate != null ? admDate : LocalDate.now())
                .transport(request.getTransport())
                .hostel(request.getHostel())
                .house(request.getHouse())
                .emergencyContact(request.getEmergencyContact())
                .medicalInfo(request.getMedicalInfo())
                .status(request.getStatus() != null ? request.getStatus() : "ACTIVE")
                .attendancePercentage(request.getAttendancePercentage() != null ? request.getAttendancePercentage() : 100.0)
                .currentGpa(request.getCurrentGpa() != null ? request.getCurrentGpa() : 0.0)
                .currentRank(request.getCurrentRank() != null ? request.getCurrentRank() : 0)
                .build();

        Student savedStudent = repository.save(student);

        String plainPassword = request.getPassword();
        if (plainPassword == null || plainPassword.trim().isEmpty()) {
            plainPassword = generateStrongPassword();
        }

        User user = User.builder()
                .username(studentId)
                .email(resolveUniqueUserEmail(student.getEmail(), studentId, null))
                .password(passwordEncoder.encode(plainPassword))
                .role(Role.STUDENT)
                .enabled(true)
                .locked(false)
                .displayName(student.getFirstName() + " " + (student.getLastName() != null ? student.getLastName() : ""))
                .build();
        userRepository.save(user);

        // Link parent
        if (request.getParentId() != null) {
            Parent parent = parentRepository.findById(request.getParentId()).orElse(null);
            if (parent != null) {
                parent.setStudent(savedStudent);
                parentRepository.save(parent);
            }
        }

        StudentResponse response = mapToResponse(savedStudent);
        response.setGeneratedPassword(plainPassword); // Returned once during creation
        return response;
    }

    @Override
    public StudentResponse updateStudent(
            Long id,
            StudentRequest request) {

        Student student = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student Not Found"));

        student.setFirstName(request.getFirstName());
        student.setLastName(request.getLastName());
        student.setClassName(request.getClassName());
        student.setSection(request.getSection());
        student.setStudentPhone(request.getStudentPhone());
        student.setEmail(request.getEmail());
        student.setPhotoPath(request.getPhotoPath());
        student.setBloodGroup(request.getBloodGroup());
        student.setAddress(request.getAddress());
        student.setDob(request.getDob());
        student.setGender(request.getGender());
        student.setRollNo(request.getRollNo());
        student.setReligion(request.getReligion());
        student.setCategory(request.getCategory());
        student.setFatherName(request.getFatherName());
        student.setMotherName(request.getMotherName());
        student.setGuardian(request.getGuardian());
        student.setAcademicYear(request.getAcademicYear());
        if (request.getAdmissionDate() != null && !request.getAdmissionDate().trim().isEmpty()) {
            try {
                student.setAdmissionDate(LocalDate.parse(request.getAdmissionDate()));
            } catch (Exception e) {
                // Ignore
            }
        }
        student.setTransport(request.getTransport());
        student.setHostel(request.getHostel());
        student.setHouse(request.getHouse());
        student.setEmergencyContact(request.getEmergencyContact());
        student.setMedicalInfo(request.getMedicalInfo());
        student.setStatus(request.getStatus());
        if (request.getAttendancePercentage() != null) {
            student.setAttendancePercentage(request.getAttendancePercentage());
        }
        if (request.getCurrentGpa() != null) {
            student.setCurrentGpa(request.getCurrentGpa());
        }
        if (request.getCurrentRank() != null) {
            student.setCurrentRank(request.getCurrentRank());
        }

        Student savedStudent = repository.save(student);

        // Update corresponding User record email and displayName
        userRepository.findByUsername(student.getStudentId()).ifPresent(user -> {
            user.setEmail(resolveUniqueUserEmail(student.getEmail(), student.getStudentId(), user.getId()));
            user.setDisplayName(student.getFirstName() + " " + (student.getLastName() != null ? student.getLastName() : ""));
            userRepository.save(user);
        });

        // Link parent
        if (request.getParentId() != null) {
            Parent parent = parentRepository.findById(request.getParentId()).orElse(null);
            if (parent != null) {
                parent.setStudent(savedStudent);
                parentRepository.save(parent);
            }
        }

        return mapToResponse(savedStudent);
    }

    @Override
    public void deleteStudent(Long id) {
        Student student = repository.findById(id).orElse(null);
        if (student != null) {
            // Delete user login account
            userRepository.findByUsername(student.getStudentId()).ifPresent(user -> {
                userRepository.delete(user);
            });
            repository.delete(student);
        }
    }

    private StudentResponse mapToResponse(
            Student student) {

        User user = student.getStudentId() != null ? userRepository.findByUsername(student.getStudentId()).orElse(null) : null;
        Boolean active = user != null ? user.getEnabled() : true;
        Boolean locked = user != null ? user.getLocked() : false;

        String fName = student.getFatherName();
        String mName = student.getMotherName();
        Long parentId = null;

        Parent parent = parentRepository.findByStudent(student).orElse(null);
        if (parent != null) {
            parentId = parent.getId();
            if (fName == null) fName = parent.getFatherName();
            if (mName == null) mName = parent.getMotherName();
        }

        return StudentResponse.builder()
                .id(student.getId())
                .admissionNo(student.getAdmissionNo())
                .studentId(student.getStudentId())
                .firstName(student.getFirstName())
                .lastName(student.getLastName())
                .className(student.getClassName())
                .section(student.getSection())
                .studentPhone(student.getStudentPhone())
                .email(student.getEmail())
                .photoPath(student.getPhotoPath())
                .bloodGroup(student.getBloodGroup())
                .address(student.getAddress())
                .dob(student.getDob())
                .gender(student.getGender())
                .rollNo(student.getRollNo())
                .religion(student.getReligion())
                .category(student.getCategory())
                .guardian(student.getGuardian())
                .academicYear(student.getAcademicYear())
                .admissionDate(student.getAdmissionDate() != null ? student.getAdmissionDate().toString() : null)
                .transport(student.getTransport())
                .hostel(student.getHostel())
                .house(student.getHouse())
                .emergencyContact(student.getEmergencyContact())
                .medicalInfo(student.getMedicalInfo())
                .status(student.getStatus())
                .attendancePercentage(student.getAttendancePercentage())
                .currentGpa(student.getCurrentGpa())
                .currentRank(student.getCurrentRank())
                .parentId(parentId)
                .fatherName(fName)
                .motherName(mName)
                .active(active)
                .locked(locked)
                .createdAt(
                        student.getCreatedAt() != null
                                ? student.getCreatedAt().toString()
                                : null)
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