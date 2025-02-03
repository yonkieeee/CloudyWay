import React, { useState } from "react";
import { Text, View, TextInput, Alert, TouchableOpacity } from "react-native";
import authStyles from "@/src/common/styles/authStyles";
import { useRouter } from "expo-router";
import { getAuth, createUserWithEmailAndPassword } from "@firebase/auth";
import { firebaseSDK } from "@/FirebaseConfig";
import axios from "axios";

const SignUpScreen: React.FC = () => {
  const [username, setUsername] = useState<string>(""); // Define username here
  const [email, setEmail] = useState<string>("");
  const [createPassword, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const router = useRouter();
  const auth = getAuth(firebaseSDK);

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
        createPassword, // Використовуємо основний пароль
      );
      const user = userCredential.user;

      // Відправляємо дані на бекенд Spring Boot
      const response = await axios.post(
        "http://13.60.155.25:8080/auth",
        {
          uid: user.uid,
          username: username,
          email: user.email,
          password: createPassword, // Використовуємо createPassword, а не confirmPassword
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      // Перевіряємо відповідь сервера
      if (response.status === 200) {
        Alert.alert("Success", "User created successfully!");

        // Переходимо до екрану введення додаткових даних
        router.push({ pathname: "/details", params: { uid: user.uid } });
      } else {
        Alert.alert("Error", response.data);
      }
    } catch (error) {
      console.error("@sign-up-error", error);

      // Виводимо детальну інформацію про помилку
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
