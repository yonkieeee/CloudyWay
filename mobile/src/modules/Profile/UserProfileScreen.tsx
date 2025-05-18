import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ImageBackground, Image } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";

interface ProfileProps {
    uid: string;
}

interface UserProfile {
    username: string;
    email: string;
    profilePicture?: string;
    friends?: number;
    visitedPlaces?: number;
    mapProgress?: string;
    album: Array<any>;
    achievements: string;
    statistics: {
        progress: string | null;
    };
}

const UserProfileScreen: React.FC<ProfileProps> = ({ uid }) => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("Album");
    const [isFriend, setIsFriend] = useState(false);
    const [currentUid, setCurrentUid] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const auth = getAuth();
                const user = auth.currentUser;
                if (!user) return;

                const token = await user.getIdToken();
                const currentUserId = user.uid;
                setCurrentUid(currentUserId);

                const profileRes = await axios.get(`http://51.20.126.241:8080/profile?uid=${uid}`
                   // , {headers: { Authorization: `Bearer ${token}` },}
                );

                setProfile(profileRes.data);

                const followingRes = await axios.get(`http://18.156.173.171:5002/users/getFollowing/${currentUserId}`);
                setIsFriend(followingRes.data.includes(uid));
            } catch (error) {
                console.error("Error loading profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [uid]);

    const handleFollowToggle = async () => {
        if (!currentUid) return;

        try {
            if (isFriend) {
                await axios.delete(`http://18.156.173.171:5002/users/deleteFollow/${currentUid}/${uid}`);
            } else {
                await axios.post(`http://18.156.173.171:5002/users/createFollow/${currentUid}/${uid}`);
            }
            setIsFriend(!isFriend);
        } catch (error) {
            console.error("Error toggling friend:", error);
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case "Album":
                return <Album album={profile?.album || []} />;
            case "Achievements":
                return <Achievements achievements={profile?.achievements || "Achievements section is empty for now."} />;
            case "Statistics":
                return <Statistics statistics={profile?.statistics || { progress: null }} />;
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#273466" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ImageBackground source={require("../../../assets/images/background.png")} style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Icon name="arrow-left" size={20} color="#fff" />
                </TouchableOpacity>


                <Text style={styles.profileName}>{profile?.username ?? "User Name"}</Text>

                <View style={styles.avatarContainer}>
                    {profile?.profilePicture ? (
                        <Image source={{ uri: profile.profilePicture }} style={styles.avatar} />
                    ) : (
                        <View style={styles.defaultAvatar}>
                            <Text style={styles.initials}>{profile?.username?.charAt(0).toUpperCase()}</Text>
                        </View>
                    )}
                </View>

                <View style={styles.infoContainer}>
                    <View style={styles.infoBox}>
                        <Text style={styles.infoTitle}>Friends</Text>
                        <Text style={styles.infoContent}>{profile?.friends ?? 3}</Text>
                    </View>
                    <View style={styles.infoBox}>
                        <Text style={styles.infoTitle}>Visited Places</Text>
                        <Text style={styles.infoContent}>{profile?.visitedPlaces ?? 0}</Text>
                    </View>
                    <View style={styles.infoBox}>
                        <Text style={styles.infoTitle}>Map Progress</Text>
                        <Text style={styles.infoContent}>{profile?.mapProgress ?? "0%"}</Text>
                    </View>
                </View>
            </ImageBackground>

            <View style={styles.tabButtons}>
                {["Album", "Achievements", "Statistics"].map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Icon
                            name={
                                tab === "Album"
                                    ? "book"
                                    : tab === "Achievements"
                                        ? "trophy"
                                        : "bar-chart"
                            }
                            size={24}
                            color={activeTab === tab ? "#030E38" : "#aaa"}
                        />
                    </TouchableOpacity>
                ))}
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

const Achievements = ({ achievements }: { achievements: string }) => (
    <View style={styles.tabContent}>
        <Text style={styles.mapText}>{achievements}</Text>
    </View>
);

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
        left: 55,
    },
    defaultAvatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#ccc",
        justifyContent: "center",
        alignItems: "center",
    },
    initials: {
        fontSize: 32,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    friendButton: {
        backgroundColor: "#4CAF50",  // Зелений фон для кнопки
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
    },
    friendButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default UserProfileScreen;
