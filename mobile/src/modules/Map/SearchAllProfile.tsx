import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { useRouter } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";

interface Friend {
    uid: string;
    name: string;
    status: "follow" | "invite";
}

const FriendsProfile: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [friendsState, setFriendsState] = useState<Friend[]>([]);
    const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]);
    const [currentUid, setCurrentUid] = useState("");
    const router = useRouter();

    useEffect(() => {
        const loadData = async () => {
            try {
                const auth = getAuth();
                const user = auth.currentUser;
                if (!user) return;

                const uid = user.uid;
                setCurrentUid(uid);

                const allUsersRes = await axios.get("http://18.156.173.171:5002/users/getAllUsers");
                const allUids: string[] = allUsersRes.data;

                const followingRes = await axios.get(
                    `http://18.156.173.171:5002/users/getFollowing/${uid}`
                );
                const following: string[] = followingRes.data;

                const profiles = await Promise.all(
                    allUids
                        .filter((id) => id !== uid)
                        .map(async (id) => {
                            try {
                                const res = await axios.get(
                                    `http://51.20.126.241:8080/profile?uid=${id}`
                                );
                                return {
                                    uid: id,
                                    name: res.data.username || "No name",
                                    status: following.includes(id) ? "follow" : "invite",
                                };
                            } catch {
                                return null;
                            }
                        })
                );

                const validProfiles = profiles.filter(Boolean) as Friend[];
                const sorted = [
                    ...validProfiles.filter((f) => f.status === "follow"),
                    ...validProfiles.filter((f) => f.status === "invite"),
                ];

                setFriendsState(sorted);
                setFilteredFriends(sorted);
            } catch (err) {
                console.error("Error loading users:", err);
            }
        };

        loadData();
    }, []);

    useEffect(() => {
        const results = friendsState.filter((friend) =>
            friend.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const sorted = [
            ...results.filter((f) => f.status === "follow"),
            ...results.filter((f) => f.status === "invite"),
        ];

        setFilteredFriends(sorted);
    }, [searchQuery, friendsState]);

    const toggleStatus = async (friend: Friend) => {
        const { uid, status } = friend;

        if (status === "follow") {
            Alert.alert("Unfollow", `Are you sure you want to unfollow ${friend.name}?`, [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Yes",
                    onPress: async () => {
                        try {
                            await axios.delete(
                                `http://18.156.173.1713.121.196.125:5002/users/deleteFollow/${currentUid}/${uid}`
                            );
                            setFriendsState((prevState) =>
                                prevState.map((f) =>
                                    f.uid === uid ? { ...f, status: "invite" } : f
                                )
                            );
                        } catch (err) {
                            console.error("Failed to unfollow user", err);
                        }
                    },
                },
            ]);
        } else {
            try {
                await axios.post(
                    `http://18.156.173.171:5002/users/createFollow/${currentUid}/${uid}`
                );
                setFriendsState((prevState) =>
                    prevState.map((f) =>
                        f.uid === uid ? { ...f, status: "follow" } : f
                    )
                );
            } catch (err) {
                console.error("Failed to follow user", err);
            }
        }
    };

    const openProfile = (uid: string) => {
        router.push(`/userprofile?uid=${uid}`);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#030E38" />
                </TouchableOpacity>
                <Text style={styles.title}>Search all accounts</Text>
                <View style={{ width: 24 }} />
            </View>

            <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search account"
                style={styles.input}
            />

            <FlatList
                data={filteredFriends}
                keyExtractor={(item) => item.uid}
                renderItem={({ item }) => (
                    <View style={styles.friendItem}>
                        <View style={styles.friendInfo}>
                            <Icon
                                name="user-circle"
                                size={24}
                                color="#030E38"
                                style={{ marginRight: 10 }}
                            />
                            <TouchableOpacity onPress={() => openProfile(item.uid)}>
                                <Text style={styles.friendName}>{item.name}</Text>
                            </TouchableOpacity>

                        </View>
                        <TouchableOpacity
                            style={[
                                styles.button,
                                item.status === "invite" && styles.inviteButton,
                            ]}
                            onPress={() => toggleStatus(item)}
                        >
                            <Text
                                style={[
                                    styles.buttonText,
                                    item.status === "invite" && styles.inviteButtonText,
                                ]}
                            >
                                {item.status === "follow" ? "Friends" : "Add to friends"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#fff" },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 12,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 8,
        marginBottom: 12,
    },
    friendItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
        borderBottomWidth: 0.5,
        borderColor: "#ccc",
        alignItems: "center",
    },
    friendInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    nameWithArrow: {
        flexDirection: "row",
        alignItems: "center",
    },
    friendName: {
        fontSize: 16,
        color: "#030E38",
    },
    button: {
        backgroundColor: "#1a1a40",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    inviteButton: {
        backgroundColor: "#ccc",
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
    },
    inviteButtonText: {
        color: "#030E38",
    },
});

export default FriendsProfile;

