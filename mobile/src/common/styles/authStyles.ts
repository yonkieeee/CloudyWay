import { StyleSheet } from "react-native";

const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030E38",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headerOne: {
    // CloudyWay
    fontSize: 55,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 40,
  },
  headerTwo: {
    // sign/in/up
    color: "#fff",
    fontSize: 24,
    marginBottom: 30,
    textAlign: "center",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },

  commonText: {
    //універсальний текст
    fontSize: 16,
    fontWeight: "normal",
    textAlign: "left",
    textAlignVertical: "top",
    color: "#FAFAFA",
  },
  label: {
    // текст над полями
    color: "#fff",
    alignSelf: "flex-start",
    marginBottom: 5,
  },
  input: {
    // поля вводу
    height: 50,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderRadius: 9,
    paddingHorizontal: 10,
  },
  inputContainer: {
    //контейнер для того щоб текст розміщувався рівно над полями
    width: "90%",
    marginBottom: 15,
  },
  signInButton: {
    backgroundColor: "#1E6AFF",
    width: "90%",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    // для синіх полів
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    color: "#ccc",
    marginBottom: 20,
  },
  dividerContainer: {
    //роздільник
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    marginVertical: 20,
  },
  divider: {
    //роздільник
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#ccc",
  },
  socialContainer: {
    flexDirection: "row",
    width: "80%",
    justifyContent: "space-evenly",
    marginBottom: 20,
  },
  socialButton: {
    //кнопки з соціальними мережами
    backgroundColor: "#f0f0f0",
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
  },
  signUpText: {
    //нижній рядок
    color: "#ccc",
    fontSize: 14,
  },
  signUpLink: {
    //посилання на signUp
    color: "#1E6AFF",
    fontWeight: "bold",
  },
  instructionText: {
    fontSize: 16,
    color: "#ddd", // Світліший колір для інструкцій
    textAlign: "center",
    marginBottom: 30,
  },
  iconContainer: {
    marginVertical: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  lockIcon: {
    width: 100, // Розмір іконки
    height: 100, // Розмір іконки
  },
  // Додано стиль для footerText
  footerText: {
    fontSize: 14,
    color: "#ccc", // Можна змінити на інший колір
    textAlign: "center",
    marginTop: 190,
  },
  picker: {
    height: 50,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderRadius: 9,
  },
  labelpicker: {
    color: "#aaa", // Сірий колір для тексту
    fontSize: 18,
    marginBottom: 10,
  },
  dropdown: {
    // Контейнер для кнопки
    backgroundColor: "#fff",
    borderRadius: 9,
    padding: 10,
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
  },
  dropdownText: {
    // Текст кнопки
    color: "#aaa", // Сірий текст для "placeholder"
    fontSize: 16,
  },
  dropdownList: {
    backgroundColor: "#fff", // Білий фон
    borderRadius: 9, // Закруглені кути
    width: "100%", // Займає 100% ширини контейнера
    marginTop: 5, // Відступ зверху для простору
    paddingVertical: 5, // Відступ зверху/знизу всередині
    borderWidth: 1, // Тонка рамка
    borderColor: "#ddd", // Світло-сірий колір рамки
    alignSelf: "stretch", // Розтягує список по ширині батьківського елемента
  },
  dropdownItemText: {
    // Текст кожного пункту списку
    fontSize: 16,
    color: "#000",
    padding: 10,
  },
});

export default authStyles;
