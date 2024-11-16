package com.example.backend.controllers;

import com.example.backend.models.User;
import com.example.backend.repositories.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class UserController {
    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User user) {
        try{
            if (userRepository.existById(user.getUid())) {
                return ResponseEntity.badRequest().body("User already exists");
            }

            userRepository.saveUser(user);
            return ResponseEntity.ok("User created");
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllUsers(@RequestParam(value="uid", required = false) String uid) {
        try{
            if (uid == null) {
                return ResponseEntity.ok(userRepository.getAllUsers());
            }
            if (userRepository.existById(uid)) {
                return ResponseEntity.ok(userRepository.getUser(uid));
            }
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        return null;
    }

    @PutMapping
    public ResponseEntity<?> updateUser(@RequestParam(value="uid") String uid
            , @RequestBody Map<String, Object> update) throws ExecutionException, InterruptedException {
        if (!userRepository.existById(uid)){
            return ResponseEntity.badRequest().body("User doesn`t exist");
        }
        userRepository.changeUser(uid, update);
            return ResponseEntity.ok("User updated");

    }

    @DeleteMapping
    public ResponseEntity<?> deleteUser(@RequestParam(value="uid") String uid) throws ExecutionException, InterruptedException {
        if(!userRepository.existById(uid)){
            return ResponseEntity.badRequest().body("User doesn`t exist");
        }

        userRepository.deleteUser(uid);
        return ResponseEntity.ok("User deleted");
    }
}
