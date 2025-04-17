import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Schedule a one-time notification
export const scheduleNotification = async ({ year, month, day, hour, minute, type, title }) => {
  console.log('Scheduling notification:', { year, month, day, hour, minute, type, title });
  const trigger = new Date(year, month - 1, day, hour, minute); // month is 0-indexed

  try {
    

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `🍽️ Meal Reminder`,
        body: `Time to eat or check your meal plan! ${type} - ${title}`,
        data: { type, title },
        sound: 'notification.wav',
        color: '#fbbf24',
        // Icon setup is handled in app.json through the plugin config
      },
      trigger,
    });

    console.log('🔔 Notification scheduled for', trigger.toString());
  } catch (error) {
    console.error('Failed to schedule notification:', error);
  }
};
