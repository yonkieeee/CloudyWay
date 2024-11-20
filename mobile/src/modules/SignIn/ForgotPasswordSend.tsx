import React from 'react';
import { View, Text } from 'react-native';
import authStyles from "@/src/common/styles/authStyles";

const ForgotPasswordSend: React.FC = () => {
    return (
        <View style={authStyles.container}>
            <Text style={authStyles.headerOne}>CloudyWay</Text>

            <Text style={authStyles.headerTwo}>We have send a password recovery to your email!</Text>
            <Text style={authStyles.instructionText}>
                Check your email inbox for further instructions to reset your password.
            </Text>

            <Text style={authStyles.footerText}>
                Didn’t receive the email?{" "}
                <Text style={authStyles.signUpLink} onPress={() => alert('Resend email functionality here')}>
                    Resend
                </Text>
            </Text>
        </View>
    );
};



export default ForgotPasswordSend;