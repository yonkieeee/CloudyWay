package com.example.backend.models;

import com.google.cloud.spring.data.firestore.Document;

import lombok.Getter;
import lombok.Setter;

@Document
@Getter @Setter
public class Pin {
    private String id;
    private String pin;
    private String uid;
    private String expireDate;

    Pin(){}

    public Pin(String id, String pin, String uid, String expireDate) {
        this.id = id;
        this.pin = pin;
        this.uid = uid;
        this.expireDate = expireDate;
    }
}
