package com.example.backend.repositories;

import com.example.backend.models.User;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.security.crypto.bcrypt.BCrypt;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

@Repository
public class UserRepository{

    private final CollectionReference usersCollection;

    @Autowired
    public UserRepository(Firestore firestore) {
        this.usersCollection = firestore.collection("users"); // Use the collection name
    }

    public void saveUser(User user) throws ExecutionException, InterruptedException {
        String hashPassword = BCrypt.hashpw(user.getPassword(), BCrypt.gensalt());
        user.setPassword(hashPassword);

        ApiFuture<WriteResult> future = usersCollection.document(user.getUid()).set(user);
        future.get();
    }

    public Optional<User> getUser(String uid) throws ExecutionException, InterruptedException {
        DocumentReference docRef = usersCollection.document(uid);
        ApiFuture<DocumentSnapshot> future = docRef.get();
        DocumentSnapshot document = future.get();

        if(document.exists()) {
            return Optional.ofNullable(document.toObject(User.class));
        }
        return Optional.empty();
    }

    public void deleteUser(String uid) throws ExecutionException, InterruptedException {
        ApiFuture<WriteResult> future = usersCollection.document(uid).delete();
        future.get();
    }

    public Boolean existById(String uid) throws ExecutionException, InterruptedException {
        DocumentReference docRef = usersCollection.document(uid);
        ApiFuture<DocumentSnapshot> future = docRef.get();
        DocumentSnapshot document = future.get();

        return document.exists();
    }

    public Boolean usernameExists(String username) throws ExecutionException, InterruptedException {
        DocumentReference docRef = usersCollection.document(username);
        ApiFuture<DocumentSnapshot> future = docRef.get();

        DocumentSnapshot document = future.get();
        return document.exists();
    }

    public List<User> getAllUsers()throws ExecutionException, InterruptedException {
        ApiFuture<QuerySnapshot> future = usersCollection.get();
        QuerySnapshot query = future.get();

        if(query.isEmpty()){
            return Collections.emptyList();
        }

        List<QueryDocumentSnapshot> documents = query.getDocuments();

        return documents.stream()
                .map(doc->doc.toObject(User.class))
                .toList();

    }

    public void changeUser(String uid, Map<String, Object> updates) throws ExecutionException, InterruptedException {
        ApiFuture<WriteResult> future = usersCollection.document(uid).update(updates);
        future.get();
    }
}
