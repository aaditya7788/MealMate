import AsyncStorage from '@react-native-async-storage/async-storage';

// Save authentication data to AsyncStorage
export const saveAuthData = async (email, password, accessToken, displayName, uid) => {
  try {
    await AsyncStorage.setItem('email', email);
    await AsyncStorage.setItem('password', password);
    await AsyncStorage.setItem('accessToken', accessToken);
    await AsyncStorage.setItem('displayName', displayName);
    await AsyncStorage.setItem('uid', uid);
    console.log("Auth data saved to AsyncStorage");
  } catch (error) {
    console.error("Error saving auth data to AsyncStorage:", error);
  }
};

// Retrieve authentication data from AsyncStorage and display in JSON format
export const getAuthData = async () => {
  try {
    const email = await AsyncStorage.getItem('email');
    const password = await AsyncStorage.getItem('password');
    const accessToken = await AsyncStorage.getItem('accessToken');
    const displayName = await AsyncStorage.getItem('displayName');
    const uid = await AsyncStorage.getItem('uid');

    const authData = { email, password, accessToken, displayName, uid };

    // Display the data in JSON format
    console.log("Saved Auth Data: ", JSON.stringify(authData, null, 2));  // JSON.stringify formats the output

    return authData;
  } catch (error) {
    console.error("Error getting auth data from AsyncStorage:", error);
  }
};

// Clear authentication data from AsyncStorage (for logout)
export const clearAuthData = async () => {
  try {
    await AsyncStorage.removeItem('email');
    await AsyncStorage.removeItem('password');
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('displayName');
    await AsyncStorage.removeItem('uid');
    console.log("Auth data cleared from AsyncStorage");
  } catch (error) {
    console.error("Error clearing auth data from AsyncStorage:", error);
  }
};
