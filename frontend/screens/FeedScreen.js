import React from 'react';
import { View, Button,StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';

const FeedScreen = () => {

  // Set the notification handler
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
       
    }),
  });

  // Function to trigger notification
  const triggerNotification = () => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: 'Look at that notification',
        body: "I'm so proud of myself!",
  
      },
      trigger: null, // Trigger immediately
    });
  };

  return (
    <View style={styles.container}>
      <Button
        title="Trigger Notification"
        onPress={triggerNotification}
        style={[{flex:1}]}
      />
    </View>
  );
};

styles= StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
  }
})
export default FeedScreen;
