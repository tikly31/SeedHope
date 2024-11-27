package com.example.seedhope.seedhope.service;

import com.example.seedhope.seedhope.model.User;
import com.example.seedhope.seedhope.repository.UserRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {
        System.out.println("CustomOAuth2UserService" + userRepository);
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        OAuth2User oAuth2User = super.loadUser(userRequest);  // Get user data from OAuth2 provider (Google)

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String picture = oAuth2User.getAttribute("picture");

        // Check if user exists in the database
        User user = userRepository.findByEmail(email);

        if (user == null) {
            // If not found, create a new user
            user = new User.UserBuilder().setName(name).setEmail(email).setPicture(picture).setProvider("google").build();
            userRepository.save(user);
        } else if ("google".equals(user.getProvider())) {
            // Handle the case where the user is already logged in via Google
        } else {
            // Handle cases where the user is registered with a different method
            throw new IllegalStateException("This email is already registered manually. Please use your password.");
        }

        return oAuth2User;
    }
}

