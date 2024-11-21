package com.example.backend.services;


import com.example.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PasswordResetService {

    private final UserRepository userRepository;

    @Autowired
    public PasswordResetService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void resetPassword(String uid, String email) {

    }
}
