import { StyleSheet } from "react-native";

const mapStyles = StyleSheet.create({
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
    position: "absolute",
    top: 145,
    left: 37,
    right: 37,
  },
  barsButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: 70,
    height: 70,
    borderRadius: 30,
    position: "absolute",
    top: 10,
    left: 5,
  },
  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    paddingVertical: 5,
    paddingHorizontal: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
    position: "absolute",
    top: 50,
    right: 2,
    zIndex: 1,
  },
  searchIconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconInsideSearch: {
    marginLeft: 10,
    marginRight: 10,
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
    bottom: 70,
    left: "40%",
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
    bottom: 70,
    left: "40%",
    transform: [{ translateX: 90 }],
  },
  plusContainer: {
    flex: 0.5,
    backgroundColor: "rgba(3, 14, 56, 0.98)",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    borderRadius: 10,
    top: 210,
  },
  modalTitle: {
    fontSize: 25,
    color: "#fff",
    fontWeight: "bold",
    top: 10,
    textAlign: "center",
  },
  photoBox: {
    width: 200,
    height: 200,
    backgroundColor: "#fff",
    borderRadius: 0,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    top: 17,
  },
  input: {
    width: "80%",
    height: 20,
    backgroundColor: "#fff",
    borderRadius: 9,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    color: "#000",
    marginBottom: 20,
    top: 10,
  },
  noteInput: {
    height: 65,
    textAlignVertical: "top",
  },
  placeButton: {
    width: "80%",
    height: 33,
    backgroundColor: "#fff",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 1,
    top: 5,
  },

  placeButtonText: {
    fontSize: 18,
    color: "#030E38",
    fontWeight: "bold",
  },
  saveButton: {
    width: "60%",
    height: 50,
    backgroundColor: "#05092d",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    bottom: 8,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
  menuContainer: {
    flex: 1,
    backgroundColor: "rgba(3, 14, 56, 0.97)",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  menuItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#1D2A56",
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    marginBottom: 20,
  },
  menuTitle: {
    fontSize: 30,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 40,
  },
  menuText: {
    fontSize: 20,
    color: "#fff",
  },
  closeButtonMenu: {
    position: "absolute",
    top: 50,
    right: 10,
    padding: 10,
    color: "#84B0E1",
  },
  closeButtonAdd: {
    position: "absolute",
    top: 3,
    right: 5,
    padding: 10,
    color: "#84B0E1",
  },
  icon: {
    marginRight: 0,
    color: "#030E38",
  },
  commonButtonStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F6F3EB",
    width: 60,
    height: 60,
    borderRadius: 30,
    position: "absolute",
    bottom: 70,
    left: "40%",
    transform: [{ translateX: 90 }],
  },
  marker: {
    width: 30,
    height: 40,
    backgroundColor: "#007BFF",
    borderRadius: 15,
    transform: [{ rotate: "180deg" }],
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: -20,
    left: -15,
  },

  markerText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "center",
  },
  searchWrapper: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    zIndex: 10,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    bottom: 50,
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 8,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: '#fff',
  },

  searchInput: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10, // щоб текст не впирався у плюс
    fontSize: 16,
    color: '#000',
  },

  addIconInsideSearch: {
    marginLeft: 10,
  },


  suggestionsContainer: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    bottom:57,
    maxHeight: 200,
    overflow: 'scroll',
    zIndex: 9,
    position: 'relative',
  },

  suggestionItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: 'white',
  },

  suggestionText: {
    fontSize: 16,
    color: 'black',
  },
  addButton: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },

  modalTitle2: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },

  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },

  modalButtons: {
    flexDirection: 'row',            // Розташування поруч
    justifyContent: 'space-between', // Відстань між кнопками
  },

  modalButton: {
    flex: 1,                         // Однакова ширина
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,             // Відстань між кнопками
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

});

export default mapStyles;