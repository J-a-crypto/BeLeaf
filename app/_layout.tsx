import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#5e17eb',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Student Dashboard',
        }}
      />
      <Stack.Screen
        name="assignments"
        options={{
          title: 'Assignments',
        }}
      />
      <Stack.Screen
        name="appointments"
        options={{
          title: 'Appointments',
        }}
      />
      <Stack.Screen
        name="resources"
        options={{
          title: 'Resources',
        }}
      />
      <Stack.Screen
        name="messages"
        options={{
          title: 'Messages',
        }}
      />
      <Stack.Screen
        name="pomodoro"
        options={{
          title: 'Pomodoro Timer',
        }}
      />
    </Stack>
  );
} 