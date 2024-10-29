import React, { useState } from "react";
import { Text, View, TextInput, Button, Alert } from "react-native";
import { authStyles } from "@/src/common/styles/authStyles";

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
      <Text style={authStyles.commonText}>Username</Text>
      <TextInput
        style={authStyles.input}
        value={username}
        onChangeText={setUsername}
      />
      <Text style={authStyles.commonText}>Email</Text>
      <TextInput
        style={authStyles.input}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <Text style={authStyles.commonText}>Create password</Text>
      <TextInput
        style={authStyles.input}
        secureTextEntry
        value={createPassword}
        onChangeText={setPassword}
      />
      <Text style={authStyles.commonText}>Confirm password</Text>
      <TextInput style={authStyles.input} secureTextEntry />
      <Button title="Sign Up" onPress={handleSignUp} />
      <Text style={authStyles.commonText}>
        Already have an account?{" "}
        <Text style={authStyles.commonText}>Sign in</Text>
      </Text>
    </View>
  );
};

export default SignUpScreen;
