import React, { useState, useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Screens & Components
import WelcomeScreen from './frontend/screens/WelcomeScreen';
import HomeScreen from './frontend/screens/HomeScreen';
import profileScreen from './frontend/screens/profileScreen';
import SearchScreen from './frontend/screens/SearchScreen';
import LoginScreen from './frontend/Auth/LoginScreen';
import SignUpScreen from './frontend/Auth/SignUpScreen';
import DetailScreen from './frontend/screens/DetailScreen';
import MealPlannerScreen from './frontend/screens/MealPlannerScreen';
import EditProfileScreen from './frontend/screens/EditProfileScreen';
import PostRecipeScreen from './frontend/screens/PostRecipeScreen';
import PostDetailScreen from './frontend/screens/PostDetailScreen';
import FeedScreen from './frontend/screens/FeedScreen';
import searchUserProfile from './frontend/screens/searchUserProfile';

import { getAuthData } from './backend/LocalStorage/auth_store';
import { tabNavigatorScreenOptions, stackNavigatorScreenOptions } from './styles';
import Toast from 'react-native-toast-message';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


const toastConfig = {
  success: ({ text1, text2 }) => (
    <View style={{ backgroundColor: '#fbbf24', padding: 10, borderRadius: 99, margin: 40 }}>
      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>{text1}</Text>
      {text2 ? <Text style={{ color: '#fff', fontSize: 14 }}>{text2}</Text> : null}
    </View>
  ),
  error: ({ text1, text2 }) => (
    <View style={{ backgroundColor: '#ef4444', padding: 10, borderRadius: 99,marginBottom: 40 }}>
      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>{text1}</Text>
      {text2 ? <Text style={{ color: '#fff', fontSize: 14 }}>{text2}</Text> : null}
    </View>
  ),
};

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={tabNavigatorScreenOptions}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="PostRecipe" component={PostRecipeScreen} />
      <Tab.Screen name="MealPlanner" component={MealPlannerScreen} />
      <Tab.Screen name="Profile" component={profileScreen} />
    </Tab.Navigator>
  );
}

// Configure how notifications behave
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // Authentication check
    getAuthData().then((data) => {
      setIsAuthenticated(!!(data && data.email && data.authToken));
      setLoading(false);
    });

    // Request permission & register listeners
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Toast.show({
          type: 'error',
          text1: 'Permission Denied',
          text2: 'Notification permission not granted!',
        });
      }
    })();

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
      Toast.show({
        type: 'info',
        text1: 'New Notification',
        text2: notification.request.content.body || 'You have a new notification.',
      });
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification tapped:', response);
      Toast.show({
        type: 'info',
        text1: 'Notification Tapped',
        text2: 'You interacted with a notification.',
      });
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  if (loading) return null;

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={isAuthenticated ? "MainApp" : "Welcome"}
          screenOptions={stackNavigatorScreenOptions}
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="MainApp" component={MainTabs} options={{ gestureEnabled: false }} />
          <Stack.Screen name="Details" component={DetailScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignUpScreen} />
          <Stack.Screen name="Profile" component={profileScreen} />
          <Stack.Screen name="SearchProfile" component={searchUserProfile} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="PostDetails" component={PostDetailScreen} />
          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="MealPlanner" component={MealPlannerScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast config={toastConfig}/>
    </>
  );
}