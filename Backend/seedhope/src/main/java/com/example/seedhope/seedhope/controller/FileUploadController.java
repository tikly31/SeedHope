package com.example.seedhope.seedhope.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;

@RestController
@RequestMapping("/uploads")
public class FileUploadController {

    // Base directory for all uploads
    private static final String BASE_UPLOAD_DIRECTORY = "D:/home/hp/SDP/SeedHope/Backend/seedhope/src/main/resources/photos";

    /**
     * Endpoint to upload campaign photos.
     * Expects a multipart/form-data request with a 'file' parameter.
     *
     * @param file The file to be uploaded.
     * @return ResponseEntity with the uploaded file name or an error message.
     */
    @PostMapping("/campaign")
    public ResponseEntity<String> uploadCampaignPhoto(@RequestParam("file") MultipartFile file) {
        return uploadFile(file, "campaigns");
    }

    /**
     * Endpoint to upload user photos.
     * Expects a multipart/form-data request with a 'file' parameter.
     *
     * @param file The file to be uploaded.
     * @return ResponseEntity with the uploaded file name or an error message.
     */
    @PostMapping("/user")
    public ResponseEntity<String> uploadUserPhoto(@RequestParam("file") MultipartFile file) {
        return uploadFile(file, "user");
    }

    /**
     * Endpoint to upload documents.
     * Expects a multipart/form-data request with a 'file' parameter.
     *
     * @param file The file to be uploaded.
     * @return ResponseEntity with the uploaded file name or an error message.
     */
    @PostMapping("/document")
    public ResponseEntity<String> uploadDocument(@RequestParam("file") MultipartFile file) {
        return uploadFile(file, "document");
    }

    /**
     * Helper method to handle file uploads to specified folders.
     *
     * @param file   The MultipartFile to be uploaded.
     * @param folder The target subfolder within the base upload directory.
     * @return ResponseEntity with the uploaded file name or an error message.
     */
    private ResponseEntity<String> uploadFile(MultipartFile file, String folder) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File upload failed: file is empty.");
        }

        try {
            // Define target directory
            String uploadDir = Paths.get(BASE_UPLOAD_DIRECTORY, folder).toString() + File.separator;
            Path uploadPath = Paths.get(uploadDir);

            // Ensure the directory exists; create it if it doesn't
            if (Files.notExists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate a unique file name to prevent overwriting and handle duplicates
            String originalFileName = Paths.get(file.getOriginalFilename()).getFileName().toString();
            String uniqueFileName = System.currentTimeMillis() + "_" + originalFileName;

            // Resolve the target file path
            Path targetPath = uploadPath.resolve(uniqueFileName);

            // Save the file to the target location
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            // Optionally, you can return the relative path or a URL to access the file
            // For simplicity, we're returning the file name
            return ResponseEntity.ok(uniqueFileName);
        } catch (IOException e) {
            // Log the exception (consider using a logging framework)
            System.err.println("Error uploading file: " + e.getMessage());
            return ResponseEntity.status(500).body("File upload failed due to server error.");
        }
    }
}