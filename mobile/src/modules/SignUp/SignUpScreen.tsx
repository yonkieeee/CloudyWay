import React, { useState } from "react";
import { Text, View, TextInput, Alert, TouchableOpacity } from "react-native";
import authStyles from "@/src/common/styles/authStyles";
import { useRouter } from "expo-router";
import { getAuth, createUserWithEmailAndPassword } from "@firebase/auth";
import { firebaseSDK } from "@/FirebaseConfig";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignUpScreen: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [createPassword, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const router = useRouter();
    const auth = getAuth(firebaseSDK);

    const saveUid = async (uid: string) => {
        try {
            await AsyncStorage.setItem("@uid", uid); // Save UID in AsyncStorage
            console.log("UID saved successfully");
        } catch (e) {
            console.error("Failed to save UID:", e);
        }
    };

    const handleSignUp = async () => {
        if (createPassword !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match!");
            return;
        }

        try {
            // Реєстрація у Firebase
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                createPassword,
            );
            const user = userCredential.user;

            await saveUid(user.uid);

            // 👉 Додаємо користувача в додаткову базу для слідкувань
            await axios.post(`http://18.156.173.171:5002/users/createUser/${user.uid}`);

            // 👉 Додаємо користувача в основну базу (наприклад, для профілю)
            const response = await axios.post(
                "http://51.20.126.241:8080/auth",
                {
                    uid: user.uid,
                    username: username,
                    email: user.email,
                    password: createPassword,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );

            if (response.status === 200) {
                Alert.alert("Success", "User created successfully!");
                router.push({ pathname: "/details", params: { uid: user.uid } });
            } else {
                Alert.alert("Error", response.data);
            }
        } catch (error) {
            console.error("@sign-up-error", error);

            if (axios.isAxiosError(error) && error.response) {
                Alert.alert("Error", error.response.data || "An error occurred.");
            } else if (error instanceof Error) {
                Alert.alert("Error", error.message);
            } else {
                Alert.alert("Error", "An unknown error occurred.");
            }
        }
    };

    return (
        <View style={authStyles.container}>
            <Text style={authStyles.headerOne}>CloudyWay</Text>
            <Text style={authStyles.headerTwo}>Create your account</Text>

            <View style={authStyles.inputContainer}>
                <Text style={authStyles.label}>Username</Text>
                <TextInput
                    style={authStyles.input}
                    placeholder="Enter your username"
                    placeholderTextColor="#aaa"
                    value={username}
                    onChangeText={setUsername}
                />
            </View>

            <View style={authStyles.inputContainer}>
                <Text style={authStyles.label}>Email</Text>
                <TextInput
                    style={authStyles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="#aaa"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />
            </View>

            <View style={authStyles.inputContainer}>
                <Text style={authStyles.label}>Create password</Text>
                <TextInput
                    style={authStyles.input}
                    placeholder="Create your password"
                    placeholderTextColor="#aaa"
                    secureTextEntry
                    value={createPassword}
                    onChangeText={setPassword}
                />
            </View>

            <View style={authStyles.inputContainer}>
                <Text style={authStyles.label}>Confirm password</Text>
                <TextInput
                    style={authStyles.input}
                    placeholder="Confirm your password"
                    placeholderTextColor="#aaa"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />
            </View>

            <TouchableOpacity style={authStyles.signInButton} onPress={handleSignUp}>
                <Text style={authStyles.buttonText}>Sign up</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/signIn")}>
                <Text style={authStyles.signUpText}>
                    Already have an account?{" "}
                    <Text style={authStyles.signUpLink}>Sign in.</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default SignUpScreen;