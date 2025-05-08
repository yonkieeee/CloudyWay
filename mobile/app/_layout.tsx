import { Stack } from "expo-router";
import { ROUTES } from "@/src/common/constants/routes";
import { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { firebaseSDK } from "@/FirebaseConfig";

export default function RootLayout() {
  const auth = getAuth(firebaseSDK);

  // logic for checking if user is authorized or not.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // TODO use MobX or Redux for storing user
      console.log("AUTH STATE CHANGED", user);
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <Stack>
      <Stack.Screen name={ROUTES.index} />
      <Stack.Screen name={ROUTES.auth} />
      <Stack.Screen name={ROUTES.signIn} />
      <Stack.Screen name={ROUTES.signUp} />
      <Stack.Screen name={ROUTES.map} />
      <Stack.Screen name={ROUTES.album} />
      <Stack.Screen name={ROUTES.profile} />
      <Stack.Screen name={ROUTES.postscreen}  />
      <Stack.Screen name={ROUTES.addLocation}/>
      <Stack.Screen name={ROUTES.details}  />
      <Stack.Screen name={ROUTES.forgotPassword}/>
      <Stack.Screen name={ROUTES.forgotPasswordSend}  />
      <Stack.Screen name={ROUTES.splashScreen}/>
      <Stack.Screen name={ROUTES.resetPassword}  />
    </Stack>
  );
}
