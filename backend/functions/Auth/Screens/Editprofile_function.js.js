import axios from 'axios';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getAuthData } from '../../../LocalStorage/auth_store';
import { Basic_url } from '../../../config/config';
export const pickImage = async () => {
  try {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result.assets[0]);
      return result.assets[0].uri;
    } else {
      Alert.alert('No image selected', 'You did not select any image.');
      return null;
    }
  } catch (error) {
    console.error('Error picking image:', error);
    return null;
  }
};





export const updateProfilePhoto = async (imageUri, setFirebaseError, navigation) => {
  const formData = new FormData();
  const authData = await getAuthData();

  if (!authData || !authData._id) {
    setFirebaseError('User ID not found');
    return;
  }

  formData.append('profilepic', {
    uri: imageUri,
    type: 'image/png', // Adjust the type based on your image format
    name: `${authData._id}.png`, // Use _id from authData for the name
  });

  try {
    const response = await fetch(`${Basic_url}/api/users/updateProfile/${authData._id}`, {
      method: 'PUT',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to update profile photo');
    }

    const result = await response.json();
    console.log('Profile photo updated successfully:', result);
    navigation.navigate('Profile'); // Navigate to the Profile screen after successful update
  } catch (error) {
    console.error('Error updating profile photo:', error);
    setFirebaseError(error.message);
  }
};

