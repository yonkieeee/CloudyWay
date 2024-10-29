import { StyleSheet } from "react-native";

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 41,
    justifyContent: "center",
    backgroundColor: "#030E38",
  },
  headerOne: {
    fontSize: 55,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
    color: "#FAFAFA",
  },
  headerTwo: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
    color: "#FFFFFF",
    fontFamily: "Roboto",
  },
  commonText: {
    fontSize: 16,
    fontWeight: "normal",
    textAlign: "left",
    textAlignVertical: "top",
    color: "#FAFAFA",
  },

  input: {
    height: 40,
    borderColor: "#0000001A",
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
    borderRadius: 5,
  },
});
