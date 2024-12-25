package com.example.seedhope.seedhope.controller;

import com.example.seedhope.seedhope.model.User;
import com.example.seedhope.seedhope.repository.UserRepository;
import com.example.seedhope.seedhope.service.Userservice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UserController {

    @Autowired
    private Userservice userservice;
    @RequestMapping("/users")
    public List<User> getAllUsers() {
        return userservice.getAllUsers();
    }
    @GetMapping("/users/{id}")
    public User getUserById(@PathVariable Long id){
        return userservice.getUserById(id);
    }

    @PostMapping("/users")
    public User addUser(@RequestBody User user) {
        return userservice.addUser(user);
    }

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userservice.register(user);

    }

    @PostMapping("/login")
    public String login(@RequestBody User user) {
        return userservice.verify(user);
    }



}
