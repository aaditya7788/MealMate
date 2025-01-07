import axios from 'axios';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { updateProfile } from 'firebase/auth';  // Import the updateProfile function from Firebase
import { auth } from '../../../config/firebaseConfig';  // Firebase Auth configuration (Ensure you have Firebase setup)

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

export const uploadImageToCloudinary = async (imageUri) => {
  try {
    const formData = new FormData();
    const uri = imageUri;
    const fileType = uri.split('.').pop();
    const fileName = `${Date.now()}.${fileType}`;

    formData.append('file', {
      uri,
      name: fileName,
      type: `image/${fileType}`,
    });
    formData.append('upload_preset', 'MealMate_Preset'); // Your upload preset name
    formData.append('timestamp', Math.floor(Date.now() / 1000)); // Current timestamp for signing

    // Prepare the API endpoint URL with your Cloud Name
    const cloudinary_Url = `https://api.cloudinary.com/v1_1/mealmate/image/upload`;

    const response = await axios.post(cloudinary_Url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const cloudinaryUrl = response.data.secure_url; // Get the image URL from the response
    console.log('Image uploaded to Cloudinary and available at: ', cloudinaryUrl);

    return cloudinaryUrl;  // Return the Cloudinary URL
  } catch (error) {
    console.error('Error uploading image to Cloudinary: ', error);
    return null;
  }
};

// Function to update the user's profile image in Firebase
export const updateProfilePhoto = async (user, imageUri, setFirebaseError, navigation) => {
  try {
    // Upload the image to Cloudinary
    const cloudinaryUrl = await uploadImageToCloudinary(imageUri);
    if (!cloudinaryUrl) {
      setFirebaseError('Failed to upload image to Cloudinary.');
      return;
    }

    // Update Firebase user profile with the Cloudinary URL
    await updateProfile(user, {
      photoURL: cloudinaryUrl,  // Set the new profile photo URL
    }); 

    console.log('Profile photo updated successfully');

    // Optionally, save the updated data to AsyncStorage or navigate to another screen
    navigation.navigate('MainApp'); // Navigate after successful update
  } catch (error) {
    console.error('Error updating profile photo in Firebase:', error);
    setFirebaseError('Error updating profile photo.');
  }
};

// Function to handle the profile update process
export const handleProfileUpdate = async (navigation, setFirebaseError) => {
  const imageUri = await pickImage(); // Call the pickImage function
  if (imageUri) {
    const user = auth.currentUser; // Get the current logged-in user from Firebase
    updateProfilePhoto(user, imageUri, setFirebaseError, navigation); // Call the updateProfilePhoto function
  }
};
