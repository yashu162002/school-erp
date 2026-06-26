package com.school.service.impl;

import com.school.service.FileUploadService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class FileUploadServiceImpl implements FileUploadService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Override
    public String uploadStudentPhoto(MultipartFile file) {

        try {

            Path uploadPath = Paths.get(uploadDir);

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String fileName =
                    UUID.randomUUID() + "_" + file.getOriginalFilename();

            Files.copy(
                    file.getInputStream(),
                    uploadPath.resolve(fileName),
                    StandardCopyOption.REPLACE_EXISTING
            );

            return fileName;

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to upload file", e);
        }
    }
}