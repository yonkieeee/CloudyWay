import React from 'react';
import { Text, View, StyleSheet, StatusBar } from 'react-native';
import {Slot,Stack} from "expo-router";

const RooyLoyout = () => {
    return(
        <Stack>
            <Stack.Screen name= "index" options={{headerShown:
            false}} />
        </Stack>
    )
}

export default RooyLoyout