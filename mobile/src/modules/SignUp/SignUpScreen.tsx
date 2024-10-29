import React, { useState } from "react";
import { Text, View, TextInput, Alert, TouchableOpacity } from "react-native";
import authStyles from "@/src/common/styles/authStyles";

const SignUpScreen: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [createPassword, setPassword] = useState<string>("");

  const handleSignUp = () => {
    if (username && email && createPassword) {
      Alert.alert("Success", "Account created successfully!");
      // Можна додати логіку реєстрації, наприклад, запит до бекенду
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
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <View style={authStyles.inputContainer}>
        <Text style={authStyles.label}>Email</Text>
        <TextInput
          style={authStyles.input}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={authStyles.inputContainer}>
        <Text style={authStyles.label}>Create password</Text>
        <TextInput
          style={authStyles.input}
          secureTextEntry
          value={createPassword}
          onChangeText={setPassword}
        />
      </View>

      <View style={authStyles.inputContainer}>
        <Text style={authStyles.label}>Confirm password</Text>
        <TextInput style={authStyles.input} secureTextEntry />
      </View>

      <TouchableOpacity style={authStyles.signInButton} onPress={handleSignUp}>
        <Text style={authStyles.buttonText}>Sign up</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={authStyles.signUpText}>
          Already have an account?{" "}
          <Text style={authStyles.signUpLink}>Sign up.</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUpScreen;
