import React from "react";
import { View, Text, StyleSheet, ScrollView, ImageBackground, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

const CityDetailScreen = () => {
  const { city } = useLocalSearchParams();
  const router = useRouter();

  const citiesData = {
    lviv: {
      title: "Lviv",
      dates: [
        { year: "2025", period: "09-03 January" },
        { year: "2023", period: "02-06 October" }
      ],
    },
    kyiv: { title: "Kyiv", dates: [] },
    uzhhorod: { title: "Uzhhorod", dates: [] },
    cherkasy: { title: "Cherkasy", dates: [] },
    odesa: { title: "Odesa", dates: [] },
    kharkiv: { title: "Kharkiv", dates: [] }
  };

  const cityInfo = citiesData[city?.toLowerCase()] || citiesData.lviv;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{cityInfo.title}</Text>

      <View style={styles.datesContainer}>
        {cityInfo.dates.map((date, idx) => (
          <TouchableOpacity key={idx} style={styles.dateBox} onPress={() => router.push(`/lviv2025`)}>
            <Text style={styles.year}>{date.year}</Text>
            <Text style={styles.period}>{date.period}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1B41',
    paddingVertical: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  datesContainer: {
    alignItems: 'center',
  },
  dateBox: {
    width: "85%",
    backgroundColor: "#D3D3D3",
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  year: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  period: {
    fontSize: 16,
    color: "#FFFFFF",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  }
});

export default CityDetailScreen;
