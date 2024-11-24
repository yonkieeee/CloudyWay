package com.example.backend.models;

import com.google.cloud.spring.data.firestore.Document;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;


@Setter @Getter
@Document(collectionName="users")
public class User {

    @Id
    private String uid;

    private String username;
    private String email;
    private String password;
    private String dateOfBirth;
    private String gender;
    private String region;

    public User(){}

    public User(String uid, String username, String email, String password, String dateOfBirth, String gender, String region) {
        this.uid = uid;
        this.username = username;
        this.email = email;
        this.password = password;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.region = region;
    }
}
