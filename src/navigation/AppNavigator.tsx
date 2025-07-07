// src/navigation/AppNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../components/HomeScreen';
import DayScreen from '../components/DayScreen';
import { NavigationContainer } from '@react-navigation/native';

type RootStackParamList = {
  Home: undefined;
  Day: { date: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Daily Planner' }} />
        <Stack.Screen name="Day" component={DayScreen} options={({ route }) => ({ title: route.params.date })} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;