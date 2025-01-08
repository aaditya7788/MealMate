import AsyncStorage from '@react-native-async-storage/async-storage';

// Save authentication data to AsyncStorage
export const saveAuthData = async (authToken, email, name, _id, profilepic) => {
  try {
    const userData = {
      authToken,
      email,
      name,
      _id,  // Use _id instead of uid
      profilepic, // Add profilepic
    };
    console.log("User Data:", userData);  // Log the user data to be saved

    // Loop over each property of userData and save it individually
    for (const key in userData) {
      await AsyncStorage.setItem(key, userData[key]);
    }
    console.log("Auth data saved to AsyncStorage");
  } catch (error) {
    console.error("Error saving auth data to AsyncStorage:", error);
  }
};

// Retrieve authentication data from AsyncStorage and display in JSON format
export const getAuthData = async () => {
  try {
    // Retrieve all individual user data
    const authToken = await AsyncStorage.getItem('authToken');
    const email = await AsyncStorage.getItem('email');
    const name = await AsyncStorage.getItem('name');
    const _id = await AsyncStorage.getItem('_id');  // Use _id instead of uid
    const profilepic = await AsyncStorage.getItem('profilepic'); // Retrieve profilepic

    const authData = { authToken, email, name, _id, profilepic };

    // Check if the data exists, if not return null
    if (!authData.authToken || !authData.email) {
      console.log("No saved auth data found.");
      return null;
    }

    console.log("Saved Auth Data: ", JSON.stringify(authData, null, 2));  // JSON.stringify formats the output
    return authData;
  } catch (error) {
    console.error("Error getting auth data from AsyncStorage:", error);
  }
};

// Clear authentication data from AsyncStorage (for logout)
export const clearAuthData = async () => {
  try {
    // Clear all auth data by removing the individual items
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('email');
    await AsyncStorage.removeItem('name');
    await AsyncStorage.removeItem('_id');  // Remove _id instead of uid
    await AsyncStorage.removeItem('profilepic'); // Remove profilepic
    console.log("Auth data cleared from AsyncStorage");
  } catch (error) {
    console.error("Error clearing auth data from AsyncStorage:", error);
  }
};
