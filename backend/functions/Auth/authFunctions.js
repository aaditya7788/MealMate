 import { Basic_url } from "../../config/config";
import { saveAuthData } from "../../LocalStorage/auth_store";
import Toast from "react-native-toast-message";

const API_URL = Basic_url + '/api/users';
// Email Validation
export const validateEmail = (text, setEmail, setEmailError) => {
  setEmail(text);
  if (!text) {
    setEmailError("Email is required");
  } else if (!/\S+@\S+\.\S+/.test(text)) {
    setEmailError("Invalid email format");
  } else {
    setEmailError("");
  }
};

// Password Validation
export const validatePassword = (text, setPassword, setPasswordError) => {
  setPassword(text);
  if (!text) {
    setPasswordError("Password is required");
  } else {
    setPasswordError("");
  }
};

// Name Validation
export const validateName = (text, setName, setNameError) => {
  setName(text);
  if (!text) {
    setNameError("Name is required");
  } else if (text.length < 2) {
    setNameError("Name must be at least 2 characters");
  } else {
    setNameError("");
  }
};

export const signup = async (name, email, password) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      Toast.show({
        type: 'error',
        text1: 'Signup Failed',
        text2: data.message || 'Something went wrong',
        visibilityTime: 3000, // Show toast for 3 seconds
        position: 'bottom',
      });
      throw new Error(data.message || 'Something went wrong');
    }

    Toast.show({
      type: 'success',
      text1: 'Signup Successful',
      text2: 'Welcome to MealMate!',
      visibilityTime: 7000, // Show toast for 3 seconds
      position: 'bottom',
    });

    // Save authentication data to AsyncStorage after successful signup
    const { authToken, email: userEmail, name: userName, _id, profilepic } = data.user; // Include profilepic
    await saveAuthData(authToken, userEmail, userName, _id, profilepic);

    return data;
  } catch (error) {
    console.error('Error during signup:', error);
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log('Login Response:', response);

    if (!response.ok) {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: data.message || 'Something went wrong',
        visibilityTime: 3000, // Show toast for 3 seconds
        position: 'bottom',
      });
      throw new Error(data.message || 'Something went wrong');
    }

    Toast.show({
      type: 'success',
      text1: 'Login Successful',
      text2: 'Welcome to MealMate!',
      visibilityTime: 3000, // Show toast for 3 seconds
      position: 'bottom',
    });

    // Save authentication data to AsyncStorage after successful login
    const { authToken, email: userEmail, name: userName, _id, profilepic } = data.user; // Include profilepic
    await saveAuthData(authToken, userEmail, userName, _id, profilepic);

    return data;
  } catch (error) {
    console.error('Error during Login:', error);
    throw error;
  }
};