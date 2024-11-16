import React, { useState } from "react";
import { Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import authStyles from "@/src/common/styles/authStyles";
import { useRouter } from "expo-router";

const SignInScreen: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    const router = useRouter();

    const handleSignIn = () => {

        setEmailError('');
        setPasswordError('');

        let isValid = true;

        if (!email) {
            setEmailError('Please enter your email');
            isValid = false;
        }


        if (!password) {
            setPasswordError('Please enter your password');
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        router.push("/map");
    };

    return (
        <KeyboardAvoidingView
            style={authStyles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <Text style={authStyles.headerOne}>CloudyWay</Text>
            <Text style={authStyles.headerTwo}>Sign in to your account</Text>

            <View style={authStyles.inputContainer}>
                <Text style={authStyles.label}>Email</Text>
                <TextInput
                    style={authStyles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="#aaa"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
                {emailError ? <Text style={authStyles.errorText}>{emailError}</Text> : null}
            </View>

            <View style={authStyles.inputContainer}>
                <Text style={authStyles.label}>Password</Text>
                <TextInput
                    style={authStyles.input}
                    placeholder="Enter your password"
                    placeholderTextColor="#aaa"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                {passwordError ? <Text style={authStyles.errorText}>{passwordError}</Text> : null}
                <TouchableOpacity onPress={() => router.push("/forgotPassword")}>
                    <Text style={authStyles.forgotPassword}>Forgot password?</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={authStyles.signInButton}
                onPress={handleSignIn}
            >
                <Text style={authStyles.buttonText}>Sign in</Text>
            </TouchableOpacity>

            <View style={authStyles.dividerContainer}>
                <View style={authStyles.divider} />
                <Text style={authStyles.dividerText}>or use social sign in</Text>
                <View style={authStyles.divider} />
            </View>

            <View style={authStyles.socialContainer}>
                <TouchableOpacity style={authStyles.socialButton}>
                    <FontAwesome name="google" size={24} color="#EA4335" />
                </TouchableOpacity>
                <TouchableOpacity style={authStyles.socialButton}>
                    <FontAwesome name="facebook" size={24} color="#3b5998" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => router.push("/signUp")}>
                <Text style={authStyles.signUpText}>
                    Don’t have an account? <Text style={authStyles.signUpLink}>Sign up.</Text>
                </Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
};

export default SignInScreen;
