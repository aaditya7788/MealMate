import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  FlatList 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
  const navigation = useNavigation();

  // Dummy data for meal posts
  const mealPosts = [
    { id: '1', image: require('../../assets/images/logo.png') },
    { id: '2', image: require('../../assets/images/logo.png') },
    { id: '3', image: require('../../assets/images/logo.png') },
    // Add more meal posts as needed
  ];

  const stats = [
    { label: 'Posts', value: '3' },
    { label: 'Followers', value: '358' },
    { label: 'Following', value: '287' },
  ];

  const renderMealPost = ({ item }) => (
    <TouchableOpacity style={styles.mealPost}>
      <Image source={item.image} style={styles.mealImage} />
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Profile Info Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileInfo}>
          <Image 
            source={require('../../assets/images/avatar.png')} 
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
          <Text style={styles.username}>Aaditya Sahani</Text>
          <Text style={styles.bioText}>Food enthusiast 🍳</Text>
          <Text style={styles.bioText}>Sharing healthy and delicious meals</Text>
          <Text style={styles.bioText}>Follow for daily meal inspiration! 🥗</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.editButton}  onPress={() => navigation.navigate('EditProfile')}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton}>
            <Text style={styles.shareButtonText}>Share Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Meal Highlights */}
      <View style={styles.highlightsContainer}>
        <FlatList
          data={[
            { id: 'new', title: 'New', isNew: true },
            { id: 'breakfast', title: 'Breakfast', image: require('../../assets/images/logo.png') },
            { id: 'lunch', title: 'Lunch', image: require('../../assets/images/logo.png') },
            { id: 'dinner', title: 'Dinner', image: require('../../assets/images/logo.png') },
          ]}
          horizontal
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.highlightItem}>
              {item.isNew ? (
                <View style={styles.highlightCircle}>
                  <Text style={styles.plusIcon}>+</Text>
                </View>
              ) : (
                <Image 
                  source={item.image} 
                  style={styles.highlightImage}
                />
              )}
              <Text style={styles.highlightText}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Tab Navigation */}
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

  return (
    <FlatList
      data={mealPosts}
      renderItem={renderMealPost}
      numColumns={3}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={renderHeader}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
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
});

export default ProfileScreen;
