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
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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
        // Step 1: Validate email format
        if (!isValidEmail(user.getEmail())) {
            throw new IllegalArgumentException("Invalid email format");
        }

        // Step 2: Check if the email or username already exists
        if (userRepository.findByUsername(user.getUsername()) != null) {
            throw new IllegalArgumentException("Username is already taken");
        }
        if (userRepository.findByEmail(user.getEmail()) != null) {
            throw new IllegalArgumentException("Email is already registered");
        }

        // Step 3: Validate the contact number
        if (!isValidContactNumber(user.getContactno())) {
            throw new IllegalArgumentException("Invalid contact number. It must be 11 digits and contain only numbers.");
        }

        // Step 4: Create a new User instance using the builder, encoding the password
        User newUser = new User.UserBuilder()
                .setName(user.getName())
                .setEmail(user.getEmail())
                .setUsername(user.getUsername())
                .setPassword(encoder.encode(user.getPassword()))
                .setContactno(user.getContactno())  // Setting the contact number
                .build();

        // Step 5: Save the user to the database
        return userRepository.save(newUser);
    }

    // Helper method to validate contact number (must be exactly 11 digits)
    private boolean isValidContactNumber(String contactno) {
        if (contactno == null || contactno.length() != 11) {
            return false;
        }
        // Check if the contact number consists of only digits
        return contactno.matches("\\d{11}");
    }


    // Helper method to validate email format using a regex
    private boolean isValidEmail(String email) {
        String emailRegex = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
        Pattern pattern = Pattern.compile(emailRegex);
        Matcher matcher = pattern.matcher(email);
        return matcher.matches();
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
