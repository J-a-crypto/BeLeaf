import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import Dashboard from './Dashboard';
import Assignments from './Assignments';
import Appointments from './Appointments';
import Resources from './Resources';
import Messages from './Messages';
import PomodoroTimer from './PomodoroTimer';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName="Dashboard"
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
              name="Dashboard" 
              component={Dashboard}
              options={{ title: 'Student Dashboard' }}
            />
            <Stack.Screen 
              name="Assignments" 
              component={Assignments}
              options={{ title: 'Assignments' }}
            />
            <Stack.Screen 
              name="Appointments" 
              component={Appointments}
              options={{ title: 'Appointments' }}
            />
            <Stack.Screen 
              name="Resources" 
              component={Resources}
              options={{ title: 'Resources' }}
            />
            <Stack.Screen 
              name="Messages" 
              component={Messages}
              options={{ title: 'Messages' }}
            />
            <Stack.Screen 
              name="PomodoroTimer" 
              component={PomodoroTimer}
              options={{ title: 'Pomodoro Timer' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
