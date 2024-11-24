package com.example.seedhope.seedhope.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;
    private String username;
    private String password;
    private String contactno;
    private String picture;
    private String provider;

    protected User() {
    }
    // Private constructor to enforce the use of the builder
    private User(UserBuilder builder) {
        this.id = builder.id;
        this.name = builder.name;
        this.email = builder.email;
        this.username = builder.username;
        this.password = builder.password;
        this.contactno = builder.contactno;
        this.picture = builder.picture;
        this.provider = builder.provider;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public String getContactno() { return  contactno;}

    public String getPicture() {
        return picture;
    }

    public String getProvider() {
        return provider;
    }



    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", username='" + username + '\'' +
                ", contactno='" + contactno + '\'' +
                '}';
    }

    // Static inner Builder class
    public static class UserBuilder {
        private Long id;
        private String name;
        private String email;
        private String username;
        private String password;
        private String contactno;
        private String picture;
        private String provider;

        public UserBuilder setId(Long id) {
            this.id = id;
            return this;
        }

        public UserBuilder setName(String name) {
            this.name = name;
            return this;
        }

        public UserBuilder setEmail(String email) {
            this.email = email;
            return this;
        }

        public UserBuilder setUsername(String username) {
            this.username = username;
            return this;
        }

        public UserBuilder setPassword(String password) {
            this.password = password;
            return this;
        }

        public UserBuilder setContactno(String contactno){
            this.contactno = contactno;
            return this;
        }

        public UserBuilder setPicture(String picture) {
            this.picture = picture;
            return this;
        }

        public UserBuilder setProvider(String provider) {
            this.provider = provider;
            return this;
        }

        public User build() {
            return new User(this);
        }
    }
}
