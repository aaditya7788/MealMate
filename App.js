import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WelcomeScreen from './frontend/screens/WelcomeScreen';
import HomeScreen from './frontend/screens/HomeScreen';
import { tabNavigatorScreenOptions, stackNavigatorScreenOptions } from './styles';
import profileScreen from './frontend/screens/profileScreen';
import SearchScreen from './frontend/screens/SearchScreen';
import LoginScreen from './frontend/Auth/LoginScreen';
import SignUpScreen from './frontend/Auth/SignUpScreen';
import DetailScreen from './frontend/screens/DetailScreen';
import MealPlannerScreen from './frontend/screens/MealPlannerScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={tabNavigatorScreenOptions}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={profileScreen} />
      <Tab.Screen name="MealPlanner" component={MealPlannerScreen} />
    </Tab.Navigator>
  );
}


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={stackNavigatorScreenOptions}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen
          name="MainApp"
          component={MainTabs}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen name="Details" component={DetailScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="signup" component={SignUpScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
