package com.example.seedhope.seedhope.controller;

import com.example.seedhope.seedhope.repository.UserRepository;
import com.example.seedhope.seedhope.service.JWTService;

import com.example.seedhope.seedhope.model.User;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;




@RestController
public class GoogleLoginController {

    @Autowired
    private JWTService jwtService;




    @GetMapping("/oauth2/callback/google")
    public ResponseEntity<?> handleGoogleCallback(Authentication authentication, HttpServletResponse response) {
        // Extract user details from the authentication object
        System.out.println("GoogleLoginController Istahak 1");
        // print the authentication object
        System.out.println(authentication);
        if(authentication == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return ResponseEntity.status(HttpServletResponse.SC_UNAUTHORIZED).body("{\"error\": \"Authentication failed\"}");
        }
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        System.out.println(oAuth2User);
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String token = jwtService.generateToken(email);
        return ResponseEntity.ok("{\"token\": \"" + token + "\"}");
    }
}
