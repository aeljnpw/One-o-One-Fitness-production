import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" />
      <Stack.Screen name="personal-info" />
      <Stack.Screen name="fitness-goals" />
    </Stack>
  );
}