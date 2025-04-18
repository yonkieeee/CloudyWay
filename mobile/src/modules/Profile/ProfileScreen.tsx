import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ImageBackground } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth } from "firebase/auth";
import axios from "axios";


const ProfileHeader = ({ userData }: { userData: UserProfile | null }) => {
    return (
        <ImageBackground
            source={require("../../../assets/images/background.png")}
            style={styles.header}
        >
            <TouchableOpacity style={styles.backButton} onPress={() => console.log("Back button pressed")}>
                <Icon name="arrow-left" size={20} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.profileName}>{userData?.name ?? "User Name"}</Text>
            <TouchableOpacity style={styles.menuButton} onPress={() => console.log("Menu button pressed")}>
                <Icon name="ellipsis-h" size={20} color="#fff" />
            </TouchableOpacity>
            <View style={styles.avatarContainer}>
                <View style={styles.avatar} />
            </View>
            <View style={styles.infoContainer}>
                <View style={styles.infoBox}>
                    <Text style={styles.infoTitle}>Friends</Text>
                    <Text style={styles.infoContent}>{userData?.friends ?? 0}</Text>
                </View>
                <View style={styles.infoBox}>
                    <Text style={styles.infoTitle}>Visited Places</Text>
                    <Text style={styles.infoContent}>{userData?.visitedPlaces ?? 0}</Text>
                </View>
                <View style={styles.infoBox}>
                    <Text style={styles.infoTitle}>Map Progress</Text>
                    <Text style={styles.infoContent}>{userData?.mapProgress ?? "0%"}</Text>
                </View>
            </View>
            <View style={styles.separator}></View>
        </ImageBackground>
    );
};

interface UserProfile {
    name: string | null;
    friends: number | null;
    visitedPlaces: number | null;
    mapProgress: string | null;
    album: Array<any>;
    achievements: string;
    statistics: {
        progress: string | null;
    };
}

const ProfileScreen = () => {
    const [userData, setUserData] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<string>("Album");

    const getUserDataFromServer = async (uid: string) => {
        try {
            const response = await axios.get(`http://13.60.155.25:8080/auth?uid=${uid}`);
            console.log("Response from server:", response.data);
            setUserData(response.data);
        } catch (error) {
            console.error("Error fetching data from server:", error);
        }
    }

    const getProfileData = async () => {
        try {
            const token = await AsyncStorage.getItem("authToken");
            if (!token) {
                console.log("No token found");
                return;
            }

            const auth = getAuth();
            const user = auth.currentUser;

            if (user) {
                const userName = user.displayName ?? "No Name";
                const userEmail = user.email;

                const uid = user.uid;

                const response = await axios.get(`http://13.60.155.25:8080/auth?uid=${uid}`);
                console.log("Server response:", response.data);

                setUserData(prevState => ({
                    ...prevState,
                    name: response.data.username ?? "User Name",
                    friends: response.data.friends ?? 0,
                    visitedPlaces: response.data.visitedPlaces ?? 0,
                    mapProgress: response.data.mapProgress ?? "0%",
                    album: response.data.album ?? [],
                    achievements: response.data.achievements ?? "Achievements section is empty for now.",
                    statistics: response.data.statistics ?? { progress: "0%" },
                }));

            }

            setLoading(false);
        } catch (error: unknown) {
            console.error("Error fetching profile data:", error);
            setLoading(false);
        }
    };


    useEffect(() => {
        getProfileData();
    }, []);


    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#273466" />
            </View>
        );
    }

    const renderContent = () => {
        switch (activeTab) {
            case "Album":
                return <Album album={userData?.album || []} />;
            case "Achievements":
                return <Achievements achievements={userData?.achievements || "Achievements section is empty for now."} />;
            case "Statistics":
                return <Statistics statistics={userData?.statistics || { progress: null }} />;
            default:
                return <Album album={userData?.album || []} />;
        }
    };

    return (
        <View style={styles.container}>
            {userData && <ProfileHeader userData={userData} />}
            <View style={styles.separator} />
            <View style={styles.tabButtons}>
                <TouchableOpacity style={[styles.tabButton, activeTab === "Album" && styles.activeTabButton]} onPress={() => setActiveTab("Album")}>
                    <Icon name="book" size={24} color={activeTab === "Album" ? "#030E38" : "#aaa"} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === "Achievements" && styles.activeTabButton]} onPress={() => setActiveTab("Achievements")}>
                    <Icon name="trophy" size={24} color={activeTab === "Achievements" ? "#030E38" : "#aaa"} />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.tabButton, activeTab === "Statistics" && styles.activeTabButton]} onPress={() => setActiveTab("Statistics")}>
                    <Icon name="bar-chart" size={24} color={activeTab === "Statistics" ? "#030E38" : "#aaa"} />
                </TouchableOpacity>
            </View>
            <View style={styles.tabContainer}>{renderContent()}</View>
        </View>
    );
};

const Album = ({ album }: { album: Array<any> }) => (
    <View style={styles.tabContent}>
        <View style={styles.grid}>
            {Array(6).fill(null).map((_, index) => (
                <View key={index} style={styles.photoBox}></View>
            ))}
        </View>
    </View>
);

const Achievements = ({ achievements }: { achievements: string }) => {
    console.log("Achievements prop:", achievements);
    return (
        <View style={styles.tabContent}>
            <Text style={styles.mapText}>{achievements || "Achievements section is empty for now."}</Text>
        </View>
    );
};


const Statistics = ({ statistics }: { statistics: { progress: string | null } }) => (
    <View style={styles.tabContent}>
        <ImageBackground
            source={require("../../../assets/images/map_statistic.png")}
            style={styles.statisticsBackground}
        >
            <View style={styles.statisticsContent}>
                <Text style={styles.statisticsText}>Progress: {statistics.progress || "0%"}</Text>
            </View>
        </ImageBackground>
    </View>
);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flex: 1,
        padding: 5,
        paddingBottom: 10,
        alignItems: "center",
        bottom: 55,
    },
    profileName: {
        fontSize: 20,
        color: "#fff",
        fontWeight: "bold",
        top: 70,
    },
    backButton: {
        position: "absolute",
        left: 20,
        top: 63,
    },
    menuButton: {
        position: "absolute",
        right: 20,
        top: 65,
    },
    avatarContainer: {
        marginTop: 20,
        marginBottom: 10,
        top: 85,
    },
    avatar: {
        width: 150,
        height: 150,
        borderRadius: 100,
        backgroundColor: "#ccc",
    },
    infoContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        marginTop: 83,
    },
    infoBox: {
        padding: 15,
        borderRadius: 8,
        width: "30%",
        alignItems: "center",
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#030E38",
    },
    infoContent: {
        fontSize: 16,
        color: "#030E38",
        marginTop: 5,
    },

    separator: {
        height: 1,
        backgroundColor: "#ddd",
        marginVertical: 20,
    },
    tabButtons: {
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "#f5f5f5",
        paddingVertical: 10,
    },
    tabButton: {
        padding: 10,
    },
    activeTabButton: {
        borderBottomWidth: 2,
        borderBottomColor: "#030E38",
    },
    tabContainer: {
        flex: 1,
    },
    tabContent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 10,
        margin: 20,
    },
    photoBox: {
        width: 100,
        height: 100,
        backgroundColor: "#ccc",
        borderRadius: 10,
    },
    mapText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    statisticsText: {
        fontSize: 16,
        marginVertical: 5,
    },
    statisticsBackground: {
        width: 235,
        height: 160,
        resizeMode: "cover",
        marginBottom: 20,
        bottom: 20,
    },
    statisticsContent: {
        padding: 10,
        borderRadius: 10,
        position: "absolute",
        top: 180,
        left: 55
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default ProfileScreen;
