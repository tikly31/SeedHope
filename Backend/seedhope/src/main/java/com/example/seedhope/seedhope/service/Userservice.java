package com.example.seedhope.seedhope.service;

import com.example.seedhope.seedhope.model.User;
import com.example.seedhope.seedhope.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import com.example.seedhope.seedhope.exception.UserNotFoundException;


import java.util.List;

@Service
public class Userservice {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JWTService jwtService;

    @Autowired
    AuthenticationManager authManager;

    public List<User> getAllUsers() {
        List<User> users = userRepository.findAll();
        if(users.isEmpty()) {
            return null;
        }
        return users;
    }

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public User register(User user) {
        // Create a new User instance using the builder, encoding the password
        User newUser = new User.UserBuilder()
                .setName(user.getName())
                .setEmail(user.getEmail())
                .setUsername(user.getUsername())
                .setPassword(encoder.encode(user.getPassword()))
                .build();

        return userRepository.save(newUser);
    }

    public User updatePassword(User user, String newPassword) {
        User updatedUser = new User.UserBuilder()
                .setId(user.getId())
                .setName(user.getName())
                .setEmail(user.getEmail())
                .setUsername(user.getUsername())
                .setPassword(encoder.encode(newPassword))
                .build();

        return userRepository.save(updatedUser);
    }

    public String verify(User user) {
        // Authenticate the user using the AuthenticationManager
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
        );

        // Check if authentication is successful
        if (authentication.isAuthenticated()) {
            String username = authentication.getName();

            // Retrieve the user from the database using the username
            User authenticatedUser = userRepository.findByUsername(username);

            // Check if the user exists in the database
            if (authenticatedUser == null) {
                throw new UserNotFoundException("User not found");
            }

            // Generate a JWT token for the authenticated user
            return jwtService.generateToken(username); // Pass username or modify the JWTService to handle User object
        } else {
            return "Authentication failed";
        }
    }



    public User addUser(@RequestBody User user) {
        return userRepository.save(user);
    }



}
