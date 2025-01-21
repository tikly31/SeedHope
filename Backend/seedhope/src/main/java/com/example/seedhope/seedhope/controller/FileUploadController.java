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
    private static final String UPLOAD_DIRECTORY = "D:/SeedHope/uploads/";

    @PostMapping("/photo")
    public ResponseEntity<String> uploadPhoto(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File upload failed: file is empty.");
        }

        try {
            // Ensure the directory exists
            Path uploadPath = Paths.get(UPLOAD_DIRECTORY);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Save file with a unique name
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            File destination = new File(UPLOAD_DIRECTORY + fileName);
            file.transferTo(destination);

            // Return the file URL
            return ResponseEntity.ok(fileName);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("File upload failed.");
        }
    }
}
