import { Stack } from "expo-router";
import { ROUTES } from "@/src/common/constants/routes";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name={ROUTES.index} />
      <Stack.Screen name={ROUTES.auth} />
      <Stack.Screen name={ROUTES.signIn} />
      <Stack.Screen name={ROUTES.signUp} />
      <Stack.Screen name={ROUTES.map} />
      <Stack.Screen name={ROUTES.album} />
      <Stack.Screen name={ROUTES.profile} />
    </Stack>
  );
}

