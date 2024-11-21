package com.example.seedhope.seedhope.service;

import com.example.seedhope.seedhope.model.User;
import com.example.seedhope.seedhope.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Service
public class Userservice {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        List<User> users = userRepository.findAll();
        if(users.isEmpty()) {
            return null;
        }
        return users;
    }

    public User addUser(@RequestBody User user) {
        return userRepository.save(user);
    }




}
