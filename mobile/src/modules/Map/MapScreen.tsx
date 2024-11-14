import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Alert,
    TextInput,
    Animated,
    Keyboard,
    Modal,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const AuthScreen: React.FC = () => {
    const [isSearching, setIsSearching] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const searchWidth = useState(new Animated.Value(90))[0]; // Початкова ширина кнопки пошуку

    const Bars = (): void => {
        setIsMenuVisible(true); // відкриваємо меню
    };

    const closeMenu = (): void => {
        setIsMenuVisible(false); // закриваємо меню
    };

    const startSearch = (): void => {
        setIsSearching(true);
        Animated.timing(searchWidth, {
            toValue: 385, // збільшена ширина кнопки під час пошуку
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    const endSearch = (): void => {
        setIsSearching(false);
        setSearchText(""); // Очищаємо текст пошуку
        Animated.timing(searchWidth, {
            toValue: 90, // Повертаємо кнопку до початкового розміру
            duration: 300,
            useNativeDriver: false,
        }).start();
        Keyboard.dismiss(); // Закриваємо клавіатуру
    };

    const handleSearchSubmit = () => {
        Alert.alert("Searching for:", searchText);
        endSearch();
    };

    const changeTheme = () => {
        Alert.alert("Change Theme / Map Colors");
        closeMenu();
    };

    const viewSearchHistory = () => {
        Alert.alert("Search History");
        closeMenu();
    };

    const openSettings = () => {
        Alert.alert("Settings");
        closeMenu();
    };

    const Profile = (): void => {
        Alert.alert("Profile account");
    };

    const Plus = (): void => {
        Alert.alert(" Add");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Map of Ukraine</Text>

            <TouchableOpacity style={styles.barsButton} onPress={Bars}>
                <Icon name="bars" size={40} color="black" style={styles.icon} />
            </TouchableOpacity>

            <Animated.View
                style={[
                    styles.searchButton,
                    {
                        width: searchWidth,
                        backgroundColor: isSearching ? "#ffffff" : "#84B0E1", // Білий фон під час пошуку
                        top: isSearching ? 10 : 0,
                    },
                ]}
            >
                {isSearching ? (
                    <>
                        <Icon
                            name="search"
                            size={20}
                            color="black"
                            style={styles.iconInsideSearch}
                        />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search..."
                            placeholderTextColor="#000" // Чорний текст підказки
                            value={searchText}
                            onChangeText={setSearchText}
                            onSubmitEditing={handleSearchSubmit} // Закриваємо пошук при натисканні Enter
                            autoFocus
                        />
                    </>
                ) : (
                    <TouchableOpacity
                        onPress={startSearch}
                        style={styles.searchIconContainer}
                    >
                        <Icon name="search" size={35} color="black" style={styles.icon} />
                    </TouchableOpacity>
                )}
            </Animated.View>

            <Image
                source={{ uri: "https://i.postimg.cc/T1vSm65G/2024-10-29-190624.png" }}
                style={{ width: 390, height: 300, marginTop: 20 }}
            />

            <TouchableOpacity style={styles.profileButton} onPress={Profile}>
                <Icon name="user" size={40} color="black" style={styles.icon} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.plusButton} onPress={Plus}>
                <Icon name="plus" size={40} color="black" style={styles.icon} />
            </TouchableOpacity>

            <Modal
                visible={isMenuVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={closeMenu}
            >
                <TouchableOpacity style={styles.modalOverlay} onPress={closeMenu}>
                    <View style={styles.menuContainer}>
                        <TouchableOpacity onPress={closeMenu} style={styles.closeButton}>
                            <Icon name="times" size={20} color="#84B0E1" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={changeTheme} style={styles.menuItem}>
                            <Text style={styles.menuText}>Change Theme / Map Colors</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={viewSearchHistory}
                            style={styles.menuItem}
                        >
                            <Text style={styles.menuText}>History</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={openSettings} style={styles.menuItem}>
                            <Text style={styles.menuText}>Settings</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#84B0E1",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 45,
        color: "#030E38",
        fontWeight: "bold",
        textAlign: "center",
        position: "absolute", // Абсолютне позиціювання
        top: 140, // Збільште значення, щоб опустити текст нижче
        left: "50%", // Центрування по горизонталі
        transform: [{ translateX: -140 }], //
    },

    barsButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#84B0E1",
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: 80, // Ширина кнопки
        height: 60, // Висота кнопки
        borderRadius: 30, // Кругла кнопка
        position: "absolute", // Абсолютне позиціювання
        top: 0, // Відстань від верхнього краю
        left: 0, // Відстань від лівого краю
    },
    searchButton: {
        flexDirection: "row", // Вирівнювання дочірніх елементів в ряд
        alignItems: "center", // Вертикальне вирівнювання елементів по центру
        justifyContent: "center", // Горизонтальне вирівнювання елементів по центру
        backgroundColor: "#84B0E1", // Колір фону кнопки
        paddingVertical: 5, // Вертикальні відступи
        paddingHorizontal: 10, // Горизонтальні відступи
        width: 80, // Ширина кнопки
        height: 45, // Висота кнопки
        borderRadius: 30, // Зробити кнопку круглою
        position: "absolute", // Абсолютне позиціювання
        top: 0, // Відстань від верхньої границі
        right: 2,
    },
    searchIconContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    iconInsideSearch: {
        marginLeft: 10,
        marginRight: 10,
    },
    searchInput: {
        height: 30,
        flex: 1,
        color: "#000", // Чорний текст в полі вводу
        backgroundColor: "transparent", // Прозорий фон
    },
    profileButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F6F3EB",
        width: 60,
        height: 60,
        borderRadius: 30,
        position: "absolute",
        bottom: 70, // Відстань від нижнього краю контейнера
        left: "40%", // Розміщення по центру по горизонталі
        transform: [{ translateX: -30 }],
    },
    plusButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F6F3EB",
        width: 60,
        height: 60,
        borderRadius: 30,
        position: "absolute",
        bottom: 70, // Відстань від нижнього краю контейнера
        left: "40%", // Розміщення по центру по горизонталі
        transform: [{ translateX: 90 }],
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Прозорий темний фон
        justifyContent: "center",
        alignItems: "center",
        position: "absolute", // Повне покриття екрану
    },
    menuContainer: {
        backgroundColor: "rgba(3, 14, 56, 0.9)", // Прозорий чорний фон для меню
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 9,
        position: "absolute", // Абсолютне позиціювання
        top: 95, // Зміщуємо меню вниз, щоб воно було під кнопкою
        left: 10, // Відстань від лівого краю
        width: 300, // Ширина меню
        height: 350,
    },
    menuItem: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#fff", // Біла лінія розділення
        width: "80%",
        alignSelf: "center",
        justifyContent: "center",
        marginBottom: 10, // Відступи між пунктами меню
    },
    menuItemActive: {
        backgroundColor: "#1D2A56",
    },
    menuText: {
        fontSize: 18,
        color: "#84B0E1",
        fontWeight: "500",
    },
    closeButton: {
        position: "absolute",
        top: 10,
        right: 10,
        padding: 10,
    },
    icon: {
        marginRight: 0,
        color: "#030E38",
    },
});

export default AuthScreen;
