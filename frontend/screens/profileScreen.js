import React, { useState, useCallback } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  FlatList,
  ActivityIndicator 
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SetProfilePic } from '../components/SetProfilePic';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState({
    username: '',
    profilePic: null,
    bio: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [name, bio] = await Promise.all([
        AsyncStorage.getItem('name'),
        AsyncStorage.getItem('bio'),
      ]);
      const profileUrl = await SetProfilePic(Date.now());

      setUserData({
        username: name || 'User',
        profilePic: profileUrl,
        bio: bio || 'Food enthusiast 🍳',
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load profile data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchUserData();
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [fetchUserData])
  );

  const mealPosts = [
    { id: '1', image: require('../../assets/images/logo.png') },
    { id: '2', image: require('../../assets/images/logo.png') },
    { id: '3', image: require('../../assets/images/logo.png') },
  ];

  const stats = [
    { label: 'Posts', value: '3' },
    { label: 'Likes', value: '358' },
    { label: 'Reviews', value: '287' },
  ];

  const highlights = [
    { id: 'new', title: 'New', isNew: true },
    { id: 'breakfast', title: 'Breakfast', image: require('../../assets/images/logo.png') },
    { id: 'lunch', title: 'Lunch', image: require('../../assets/images/logo.png') },
    { id: 'dinner', title: 'Dinner', image: require('../../assets/images/logo.png') },
  ];

  const renderMealPost = ({ item }) => (
    <TouchableOpacity style={styles.mealPost}>
      <Image source={item.image} style={styles.mealImage} />
    </TouchableOpacity>
  );

  const renderProfileInfo = () => (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <View style={styles.profileSection}>
        <View style={styles.profileInfo}>
          <Image 
            source={userData.profilePic ? { uri: userData.profilePic } : require('../../assets/images/avatar.png')} 
            style={styles.profileImage}
          />
          <View style={styles.statsContainer}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statItem}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.bioSection}>
          <Text style={styles.username}>{userData.username}</Text>
          <Text style={styles.bioText}>{userData.bio}</Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.editButton} 
          >
            <Text style={styles.editButtonText}>Follow</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton}>
            <Text style={styles.shareButtonText}>Share Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.highlightsContainer}>
        <FlatList
          data={highlights}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.highlightItem}>
              {item.isNew ? (
                <View style={styles.highlightCircle}>
                  <Text style={styles.plusIcon}>+</Text>
                </View>
              ) : (
                <Image source={item.image} style={styles.highlightImage} />
              )}
              <Text style={styles.highlightText}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Ionicons name="grid-outline" size={24} color="#F59E0B" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Ionicons name="bookmark-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Ionicons name="heart-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </>
  );

  if (isLoading && !isRefreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F59E0B" />
      </View>
    );
  }

  return (
    <FlatList
      data={mealPosts}
      renderItem={renderMealPost}
      numColumns={3}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={renderProfileInfo}
      contentContainerStyle={styles.container}
      onRefresh={handleRefresh}
      refreshing={isRefreshing}
    />
  );
};







const styles = StyleSheet.create({
  // Styles remain unchanged
  container: {
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
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#666',
  },
  bioSection: {
    marginTop: 15,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  bioText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 10,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#F59E0B',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  shareButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  highlightsContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  highlightItem: {
    alignItems: 'center',
    marginRight: 15,
  },
  highlightCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  highlightText: {
    marginTop: 5,
    fontSize: 12,
    color: '#666',
  },
  plusIcon: {
    fontSize: 24,
    color: '#666',
  },
  tabContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#F59E0B',
  },
  mealPost: {
    flex: 1 / 3,
    aspectRatio: 1,
    padding: 1,
  },
  mealImage: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    margin: 10,
    padding: 10,
  },
});

export default ProfileScreen;
