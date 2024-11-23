import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import authStyles from "@/src/common/styles/authStyles";

const Profile = () => {
    return (
        <View style={[authStyles.container, styles.container]}>
            <View style={styles.header}>
                <Text style={styles.title}>CloudyWay</Text>
            </View>

            <View style={styles.profileContainer}>
                <Icon name="user-circle" size={100} color="#fff" style={styles.profileIcon} />
                <Text style={styles.name}>Anna Smith</Text>

                <View style={styles.statsContainer}>
                    <View style={styles.stat}>
                        <Text style={styles.statNumber}>123</Text>
                        <Text style={styles.statLabel}>Visited place</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={styles.statNumber}>456</Text>
                        <Text style={styles.statLabel}>Friends</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={styles.statNumber}>50.9%</Text>
                        <Text style={styles.statLabel}>Open Ukraine</Text>
                    </View>
                </View>

                <Text style={styles.topPlaceLabel}>Top Place of week:</Text>
                <View style={styles.cameraIconsContainer}>
                    <TouchableOpacity style={styles.cameraButton}>
                        <Icon name="camera" size={35} color="#000" style={styles.cameraIcon} /> {/* Set camera icon color here */}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cameraButton}>
                        <Icon name="camera" size={35} color="#000" style={styles.cameraIcon} /> {/* Set camera icon color here */}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cameraButton}>
                        <Icon name="camera" size={35} color="#000" style={styles.cameraIcon} /> {/* Set camera icon color here */}
                    </TouchableOpacity>
                </View>

                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Chat</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Follow</Text>
                    </TouchableOpacity>
                </View>


            </View>
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-start',
        paddingTop: 50,
    },
    header: {
        paddingVertical: 10,
    },
    title: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
    },
    profileContainer: {
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        width: '90%',
        marginTop: 5,
    },
    profileIcon: {
        marginBottom: 30,
    },
    name: {
        fontSize: 32,
        color: '#fff',
        fontWeight: 'bold',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginVertical: 10,
    },
    stat: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 25,
        color: '#fff',
        fontWeight: 'bold',
    },
    statLabel: {
        fontSize: 12,
        color: '#bbb',
    },
    topPlaceLabel: {
        fontSize: 25,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 40,
    },
    cameraIconsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30,
    },
    cameraButton: {
        marginHorizontal: 20, // Відступи між кнопками
        width: 60, // Ширина кнопки
        height: 120, // Висота кнопки
        borderRadius: 5, // Невелике заокруглення кутів (можна встановити 0, якщо потрібні чіткі кути)
        backgroundColor: '#ccc', // Колір кнопки
        justifyContent: 'center', // Центрування іконки по вертикалі
        alignItems: 'center', // Центрування іконки по горизонталі
    },
    cameraIcon: {
        fontSize: 35, // Розмір іконки
        color: '#000', // Колір іконки
    },

    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 25,
    },
    button: {
        backgroundColor: '#F6F3EB',
        padding: 15,
        borderRadius: 20,
        flex: 1,
        marginHorizontal: 11,
        alignItems: 'center',
        marginTop: 45,
    },
    buttonText: {
        color: '#030E38',
        fontWeight: 'bold',
    },
    cameraIconContainer: {
        backgroundColor: '#F6F3EB',
        borderRadius: 100,
        padding: 15,
        marginHorizontal: 15,
        alignItems: 'center',
        justifyContent: 'center', 
    },
});

export default Profile;
