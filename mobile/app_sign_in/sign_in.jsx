import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function SignIn() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>CloudyWay</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>

            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your password"
                secureTextEntry
            />

            <TouchableOpacity style={styles.forgotPasswordContainer}>
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Sign in</Text>
            </TouchableOpacity>

            <Text style={styles.socialText}>or sign in with</Text>
            <View style={styles.socialButtons}>
                <TouchableOpacity style={styles.socialButton}>
                    <Icon name="google" size={24} color="#DB4437" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                    <Icon name="facebook" size={24} color="#4267B2" />
                </TouchableOpacity>
            </View>

            <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Don't have an account? </Text>
                <TouchableOpacity>
                    <Text style={styles.signupLink}>Sign up.</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#030E38',
        padding: 20,
    },
    title: {
        fontSize: 55,
        fontWeight: 'bold',
        marginBottom: 40,
        color: "#fff",
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: "#fff",
        textAlign: 'center',
    },
    label: {
        color: '#fff',
        alignSelf: 'flex-start',
        marginBottom: 5,
        marginLeft: 10,
    },
    input: {
        width: '95%',
        height: 50,
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 9,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    forgotPasswordContainer: {
        alignSelf: 'flex-end',
        marginBottom: 30,
        marginRight: 10,
    },
    forgotPassword: {
        color: '#007BFF',
    },
    button: {
        backgroundColor: '#007BFF',
        borderRadius: 9,
        padding: 10,
        width: '95%',
        height: 50,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 18,
        width: '100%',
        paddingBottom: 10
    },
    socialText: {
        marginBottom: 10,
        color: '#666',
        textAlign: 'center',
    },
    socialButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        marginBottom: 20,
        paddingBottom: 20
    },
    socialButton: {
        backgroundColor: '#f0f0f0',
        borderRadius: 30,
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
        marginTop: 10,
    },
    signupContainer: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'center',
    },
    signupText: {
        color: '#666',
    },
    signupLink: {
        color: '#007BFF',
        fontWeight: 'bold',
    },
});
