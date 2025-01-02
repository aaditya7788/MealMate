// Import statements
import React from 'react';
import { Button, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

// Separate function for Image Picker
export const pickImage = async () => {
  try {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Corrected the mediaTypes syntax
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result.assets[0]); // Access the selected image
    } else {
      Alert.alert('No image selected', 'You did not select any image.');
    }
  } catch (error) {
    console.error('Error picking image:', error);
  }
};


