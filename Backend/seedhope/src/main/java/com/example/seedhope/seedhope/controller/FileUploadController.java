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
    private static final String BASE_UPLOAD_DIRECTORY = "D:/SeedHope/Backend/seedhope/src/main/resources/photos/";

    @PostMapping("/campaign")
    public ResponseEntity<String> uploadCampaignPhoto(@RequestParam("file") MultipartFile file) {
        return uploadFile(file, "campaigns");
    }

    @PostMapping("/user")
    public ResponseEntity<String> uploadUserPhoto(@RequestParam("file") MultipartFile file) {
        return uploadFile(file, "user");
    }

    private ResponseEntity<String> uploadFile(MultipartFile file, String folder) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File upload failed: file is empty.");
        }

        try {
            // Define target directory
            String uploadDir = BASE_UPLOAD_DIRECTORY + folder + "/";
            Path uploadPath = Paths.get(uploadDir);

            // Ensure the directory exists
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Save file with a unique name
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            File destination = new File(uploadDir + fileName);
            file.transferTo(destination);

            // Return the file path (relative)
            return ResponseEntity.ok(fileName);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("File upload failed.");
        }
    }
}
