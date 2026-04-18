package com.smartcampus.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    public String store(MultipartFile file) throws IOException {
        // Create the directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(uploadPath);

        // Build a unique filename
        String original = file.getOriginalFilename();
        String ext = (original != null && original.contains("."))
                ? original.substring(original.lastIndexOf(".")).toLowerCase()
                : ".jpg";

        String filename = UUID.randomUUID().toString() + ext;
        Path targetLocation = uploadPath.resolve(filename);

        // Copy file to target location
        Files.copy(file.getInputStream(), targetLocation,
                StandardCopyOption.REPLACE_EXISTING);

        return filename;
    }
}