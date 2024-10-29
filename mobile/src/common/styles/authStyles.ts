import { StyleSheet } from "react-native";

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030E38",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  headerOne: { //CloudyWay
    fontSize: 55,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 40,
  },
  headerTwo: { //sign/in/up
      color: "#fff",
      fontSize: 24,
      marginBottom: 30,
  },
  commonText: {
    fontSize: 16,
    fontWeight: "normal",
    textAlign: "left",
    textAlignVertical: "top",
    color: "#FAFAFA",
  },

  label: { //текст над полями
    color: '#fff',
    alignSelf: 'flex-start',
    marginBottom: 5,
  },

  input: { //поля вводу
    height: 50,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 9,
    paddingHorizontal: 10,
  },
  signInButton: {
    backgroundColor: "#1E6AFF",
    width: "90%",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: { //для синіх полів
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
