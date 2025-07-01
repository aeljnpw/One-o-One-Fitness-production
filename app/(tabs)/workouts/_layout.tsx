import { Stack } from 'expo-router';

export default function WorkoutsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="equipment/[id]" />
      <Stack.Screen name="exercise/[id]" />
      <Stack.Screen name="workout/[id]" />
    </Stack>
  );
}