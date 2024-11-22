package com.example.seedhope.seedhope.repository;

import com.example.seedhope.seedhope.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Additional query methods (if needed)
    User findByUsername(String username);
}