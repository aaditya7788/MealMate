import AsyncStorage from '@react-native-async-storage/async-storage';

const IS_VEG_KEY = 'isVeg';

export const setIsVeg = async (value) => {
  try {
    await AsyncStorage.setItem(IS_VEG_KEY, JSON.stringify(value));
  } catch (error) {
    console.error('Error setting isVeg value:', error);
  }
};

export const getIsVeg = async () => {
  try {
    const value = await AsyncStorage.getItem(IS_VEG_KEY);
    return value !== null ? JSON.parse(value) : false;
  } catch (error) {
    console.error('Error getting isVeg value:', error);
    return false;
  }
};