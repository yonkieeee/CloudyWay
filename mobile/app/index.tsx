import { Text, View } from "react-native";
import { Link } from "expo-router";
import { ROUTES } from "@/src/common/constants/routes";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>CloudyWay index.tsx</Text>
      {/*TODO add types here*/}
      <Link href={`/${ROUTES.auth}` as any}>Auth</Link>
      <Link href={`/${ROUTES.signIn}` as any}>Sign In</Link>
      <Link href={`/${ROUTES.signUp}` as any}>Sign Up</Link>
      <Link href={`/${ROUTES.map}` as any}>Map</Link>
      <Link href={`/${ROUTES.album}` as any}>Album</Link>
      <Link href={`/${ROUTES.profile}` as any}>Profile</Link>
    </View>
  );
}
