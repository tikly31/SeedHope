package com.example.seedhope.seedhope.model;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import jakarta.persistence.*;
import org.hibernate.annotations.Type;

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
    private Double donatedAmount = 0.0;

    private String bio;

    private String gender;

    private String role;




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
        this.donatedAmount = builder.donatedAmount;
        this.bio = builder.bio;
        this.gender = builder.gender;
        this.role = builder.role;

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

    public Double getDonatedAmount() {
        return donatedAmount;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setContactno(String contactno) {
        this.contactno = contactno;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public void  setDonatedAmount(Double amount){ this.donatedAmount = amount;}

    public String getBio() {
        return bio;
    }

    public String getGender() {
        return gender;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }



    // toString() method to print the User object






    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", contactno='" + contactno + '\'' +
                ", picture='" + picture + '\'' +
                ", provider='" + provider + '\'' +
                ",donatedAmount='" + donatedAmount + '\'' +
                ", bio='" + bio + '\'' +
                ", gender ='" + gender +'\'' +
                '}';
    }

    // Static inner Builder class
    public static class UserBuilder {
        public byte[] image;
        private Long id;
        private String name;
        private String email;
        private String username;
        private String password;
        private String contactno;
        private String picture;
        private String provider;
        private Double donatedAmount;

        private String bio;

        private String gender;

        private String role;

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

        public UserBuilder setDonatedAmount(Double amount){
            this.donatedAmount = amount;
            return this;
        }

        public UserBuilder setBio(String bio) {
            this.bio = bio;
            return this;
        }

        public UserBuilder setGender(String gender) {
            this.gender = gender;
            return this;
        }

        public UserBuilder setRole(String role) {
            this.role = role;
            return this;
        }


        public User build() {
            return new User(this);
        }
    }
}
