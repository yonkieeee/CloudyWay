import React from 'react';
import { Text, View, StyleSheet, StatusBar } from 'react-native';
import { Link } from 'expo-router';

export default function App() {
    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <Link href="/sign_in" style={styles.link}>Sign in</Link>
            <View style={styles.main}>
                <Text style={styles.title}>Valia</Text>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: 'center',
    },
    main: {
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    link: {
        color: "blue",
        textDecorationLine: 'underline',
        marginBottom: 20,
    },
});
