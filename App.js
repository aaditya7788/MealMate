import React from 'react';
import { useState, useEffect } from 'react';
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
import { getAuthData } from './backend/LocalStorage/auth_store';
import EditProfileScreen from './frontend/screens/EditProfileScreen';
import PostRecipeScreen from './frontend/screens/PostRecipeScreen';
import PostDetailScreen from './frontend/screens/PostDetailScreen';
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={tabNavigatorScreenOptions}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="PostRecipe" component={PostRecipeScreen} />
      <Tab.Screen name="MealPlanner" component={MealPlannerScreen} />
      <Tab.Screen name="Profile" component={profileScreen} />
    </Tab.Navigator>
  );
}


export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);  // Initially null to indicate loading
  const [loading, setLoading] = useState(true);  // Loading state to track when the check is complete

  useEffect(() => {
    // Check if authentication data exists in AsyncStorage
    getAuthData().then((data) => {
      if (data && data.email && data.authToken) {
       // console.log(data.email, data.authToken);
        setIsAuthenticated(true);  // If auth data exists, set authenticated state
      } else {
        setIsAuthenticated(false);  // Otherwise, user is not authenticated
      }
      setLoading(false);  // Set loading to false once the check is done
    });
  }, []);

  // Show a loading screen or a placeholder until authentication check is complete
  if (loading) {
    return null;  // or return a loading spinner/indicator
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? "MainApp" : "Welcome"}  // Navigate to MainApp if authenticated
        screenOptions={stackNavigatorScreenOptions}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen
          name="MainApp"
          component={MainTabs}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen name="Details" component={DetailScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignUpScreen} />
        <Stack.Screen name="Profile" component={profileScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="PostDetails" component={PostDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
