import { Stack } from 'expo-router';

export default function RootLayout() {
  return <Stack initialRouteName="SplashScreen" screenOptions={{ headerShown: false }} />;
}