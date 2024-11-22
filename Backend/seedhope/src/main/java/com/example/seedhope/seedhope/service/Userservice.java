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
        user.setPassword(encoder.encode(user.getPassword()));
        userRepository.save(user);
        return user;
    }

    public String verify(User user) {
        Authentication authentication = authManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
        if (authentication.isAuthenticated()) {
            String username = authentication.getName();
            User user1 = userRepository.findByUsername(username);

            return username + " is logged in";
        } else {
            return "fail";
        }
    }

    public User addUser(@RequestBody User user) {
        return userRepository.save(user);
    }




}
