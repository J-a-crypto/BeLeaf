import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    console.log('RootLayout mounted');
    
    // Set initial route to splash
    router.replace('/splash');
    
    // Hide splash screen after resources are loaded
    const hideSplash = async () => {
      try {
        await SplashScreen.hideAsync();
        console.log('Splash screen hidden');
      } catch (error) {
        console.log('Error hiding splash screen:', error);
      }
    };

    hideSplash();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="splash"
    >
      <Stack.Screen
        name="splash"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="land"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
