package com.example.seedhope.seedhope.controller;


import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;


public class FileUploadController {
    private static final String UPLOAD_DIRECTORY = "D:\\SeedHope\\Backend\\seedhope\\src\\main\\resources\\photos\\campaigns\\";

    @PostMapping("/photo")
    public String uploadPhoto(@RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            return "File upload failed: file is empty.";
        }

        // Save file to the specified directory with the original filename
        File destination = new File(UPLOAD_DIRECTORY + file.getOriginalFilename());
        file.transferTo(destination);

        return "File uploaded successfully: " + destination.getAbsolutePath();
    }
}
