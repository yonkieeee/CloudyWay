import React, { useState } from "react";
import { Text, View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function SignInScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = () => {

    };

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>CloudyWay</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="#aaa"
                    value={email}
                    onChangeText={setEmail}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor="#aaa"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
            </View>

            <TouchableOpacity>
                <Text style={styles.forgotPassword}>Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
                <Text style={styles.buttonText}>Sign in</Text>
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>or use social sign in</Text>
                <View style={styles.divider} />
            </View>

            <View style={styles.socialContainer}>
                <TouchableOpacity style={styles.socialButton}>
                    <FontAwesome name="google" size={24} color="#EA4335" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                    <FontAwesome name="facebook" size={24} color="#3b5998" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity>
                <Text style={styles.signUpText}>
                    Don’t have an account? <Text style={styles.signUpLink}>Sign up.</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#030E38",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    logo: {
        fontSize: 55,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 40,
    },
    subtitle: {
        color: "#ccc",
        fontSize: 24,
        marginBottom: 30,
    },
    inputContainer: {
        width: "90%",
        marginBottom: 15,
    },
    input: {
        height: 50,
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 9,
        paddingHorizontal: 10,
    },
    label: {
        color: '#fff',
        alignSelf: 'flex-start',
        marginBottom: 5,
    },
    forgotPassword: {
        alignSelf: "flex-end",
        color: "#ccc",
        marginBottom: 20,
    },
    signInButton: {
        backgroundColor: "#1E6AFF",
        width: "90%",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 20,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "80%",
        marginVertical: 20,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: "#ccc",
    },
    dividerText: {
        marginHorizontal: 10,
        color: "#ccc",
    },
    socialContainer: {
        flexDirection: "row",
        width: "80%",
        justifyContent: "space-evenly",
        marginBottom: 20,
    },
    socialButton: {
        backgroundColor: '#f0f0f0',
        borderRadius: 30,
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
    },
    signUpText: {
        color: "#ccc",
        fontSize: 16,
    },
    signUpLink: {
        color: "#1E6AFF",
        fontWeight: "bold",
    },
});
