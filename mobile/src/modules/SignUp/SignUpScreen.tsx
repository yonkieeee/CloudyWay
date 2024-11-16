import React, { useState } from "react";
import { Text, View, TextInput, Alert, TouchableOpacity } from "react-native";
import authStyles from "@/src/common/styles/authStyles";
import { useRouter } from "expo-router";

const SignUpScreen: React.FC = () => {
  const [username, setUsername] = useState<string>(""); // Define username here
  const [email, setEmail] = useState<string>("");
  const [createPassword, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const router = useRouter();

  const handleSignUp = () => {
    const obj = {
      username: username,
      email: email,
      createPassword: createPassword,
      confirmPassword: confirmPassword,
    };
    console.log("Lox", obj);

    if (username && email && createPassword) {
      Alert.alert("Success", "Account created successfully!");
      // Можна додати логіку реєстрації, наприклад, запит до бекенду
        router.push("/map");
    } else {
      Alert.alert("Error", "Please fill all the fields");
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
