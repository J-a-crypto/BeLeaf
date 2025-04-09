import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LandingPage from './landing'; // Landing Page screen
import ReadingFunction from './reading'; // Your existing reading function screen

const Stack = createStackNavigator();

export default function Index() {
    return (

        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: true }}>
            <Stack.Screen name="Home" component={LandingPage} />
            <Stack.Screen name="reading" component={ReadingFunction} />
        </Stack.Navigator>

    );
}
