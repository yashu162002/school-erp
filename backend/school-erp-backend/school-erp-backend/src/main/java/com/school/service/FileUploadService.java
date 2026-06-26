package com.school.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileUploadService {

    String uploadStudentPhoto(MultipartFile file);
}