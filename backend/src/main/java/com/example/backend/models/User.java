package com.example.backend.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


@Entity
@Table(name = "\"user\"")
@Setter @Getter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String uid;

    private String username;

    private String email;

    private String dateOfBirth;

    private String gender;

    private String region;

    private String photo;

}
