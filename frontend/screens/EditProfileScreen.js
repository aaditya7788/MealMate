import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { fetch_UserData, UpdateProfile } from '../../backend/components/request';
import { Basic_url } from '../../backend/config/config';

const EditProfileScreen = () => {
  const [userData, setUserData] = useState({
    username: '',
    profilePic: '',
    bio: '',
  });
  const navigation = useNavigation();

  const handleFetchuserData = async () => {
    try {
      const response = await fetch_UserData();
      setUserData({
        username: response.name || 'User',
        profilePic: `${Basic_url}${response.profilepic}`,
        bio: response.description || 'Food enthusiast 🍳',
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    handleFetchuserData();
  }, []);

  const handleSaveChanges = async () => {
    const data = {
      name: userData.username,
      description: userData.bio,
    }
    console.log("Data to update:", data);
    try {
      const updateProfile_response = await UpdateProfile(data);
      console.log("Updated Profile:", updateProfile_response);
      navigation.goBack();
    } catch (error) {
      console.error("Error updating profile:", error);
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
        <TouchableOpacity onPress={handleSaveChanges}>
          <Ionicons name="checkmark-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Profile Picture Section */}
      <View style={styles.profileSection}>
        <View style={styles.profilePictureContainer}>
          <Image
            source={{ uri: userData.profilePic }}
            style={styles.profileImage}
          />
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor="#ccc"
              value={userData.username}
              onChangeText={(text) => setUserData({ ...userData, username: text })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, styles.bioInput]}
              multiline
              placeholder="Stay strong, and chase their dreams. 💼💪✨"
              placeholderTextColor="#ccc"
              value={userData.bio}
              onChangeText={(text) => setUserData({ ...userData, bio: text })}
            />
          </View>
        </View>
      </View>

      {/* Save Button */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
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
});

export default EditProfileScreen;