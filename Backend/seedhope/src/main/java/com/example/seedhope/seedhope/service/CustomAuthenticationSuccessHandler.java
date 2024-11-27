package com.example.seedhope.seedhope.service;
import com.example.seedhope.seedhope.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;


import java.io.IOException;

import com.example.seedhope.seedhope.model.User;
import org.springframework.stereotype.Service;



@Service
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private final JWTService jwtTokenProvider;
    private final UserRepository userRepository;

    public CustomAuthenticationSuccessHandler(JWTService jwtTokenProvider, UserRepository userRepository) {
        System.out.println("CustomAuthenticationSuccessHandler" + jwtTokenProvider + userRepository);
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        if (authentication == null) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authentication failed");
            return;
        }

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        if (oAuth2User == null) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authentication failed");
            return;
        }

        String email = oAuth2User.getAttribute("email");
        // Generate JWT token for the user
        String token = jwtTokenProvider.generateToken(email);

        // Send the token in the response
        response.setContentType("application/json");
        response.getWriter().write("{\"token\": \"" + token + "\"}");
    }

}
