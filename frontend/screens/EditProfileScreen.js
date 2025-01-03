import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { pickImage, uploadImageToCloudinary } from '../../backend/functions/Auth/Screens/EditProfileFunctions'; // Import the pickImage and uploadImageToCloudinary functions
import { updateProfile } from 'firebase/auth';
import { auth } from '../../backend/config/firebaseConfig'; // Firebase config

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const [profileImage, setProfileImage] = useState(null); // State for profile image
  const [firebaseError, setFirebaseError] = useState(''); // State for handling Firebase errors

  const handlePickAndUploadImage = async () => {
    const imageUri = await pickImage(); // Let user pick image
    if (imageUri) {
      // Upload the image to Cloudinary
      const downloadUrl = await uploadImageToCloudinary(imageUri);
      if (downloadUrl) {
        // Update the local profile image
        setProfileImage(downloadUrl);
        
        // Update the Firebase profile with the Cloudinary URL
        try {
          const user = auth.currentUser; // Get the current user from Firebase
          if (user) {
            await updateProfile(user, { photoURL: downloadUrl }); // Update profile photo URL in Firebase
            Alert.alert('Success', 'Profile picture updated successfully.');
          } else {
            setFirebaseError('No user logged in.');
          }
        } catch (error) {
          console.error('Error updating Firebase profile:', error);
          setFirebaseError('Failed to update profile picture.');
        }
      } else {
        setFirebaseError('Failed to upload image to Cloudinary.');
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity>
          <Ionicons name="checkmark-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Profile Picture Section */}
      <View style={styles.profileSection}>
        <View style={styles.profilePictureContainer}>
          <Image
            source={
              profileImage
                ? { uri: profileImage }
                : require('../../assets/images/avatar.png')
            }
            style={styles.profileImage}
          />
          <TouchableOpacity onPress={handlePickAndUploadImage}>
            <Text style={styles.editPictureText}>Edit picture or avatar</Text>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor="#ccc"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, styles.bioInput]}
              multiline
              placeholder="Stay strong, and chase their dreams. 💼💪✨"
              placeholderTextColor="#ccc"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Gender</Text>
            <TextInput
              style={styles.input}
              placeholder="Prefer not to say"
              placeholderTextColor="#ccc"
            />
          </View>
        </View>
      </View>

      {/* Firebase error display */}
      {firebaseError ? <Text style={styles.errorText}>{firebaseError}</Text> : null}

      {/* Save Button */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginTop: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileSection: {
    padding: 15,
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  editPictureText: {
    marginTop: 10,
    color: '#F59E0B',
    fontSize: 14,
    fontWeight: '500',
  },
  form: {
    paddingHorizontal: 10,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    backgroundColor: '#f9f9f9',
    color: '#333',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  bioInput: {
    height: 60,
    textAlignVertical: 'top',
  },
  actionButtons: {
    padding: 15,
  },
  saveButton: {
    backgroundColor: '#F59E0B',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default EditProfileScreen;
