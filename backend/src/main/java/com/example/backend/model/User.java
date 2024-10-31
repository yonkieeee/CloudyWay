package com.example.backend.model;

import org.springframework.data.annotation.Id;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class User {

    @Id
    private String id;

    private String username;

    private String email;

    private String dateOfBirth;

    private String fullName;
}
