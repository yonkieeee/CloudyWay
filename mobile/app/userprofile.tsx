import UserProfileScreen from "@/src/modules/Profile/UserProfileScreen";
import { useLocalSearchParams } from "expo-router";

export default function UserProfile() {
    const { uid } = useLocalSearchParams();
    return <UserProfileScreen uid={String(uid)} />;
}
