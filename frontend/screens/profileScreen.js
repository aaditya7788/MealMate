import React, { useState, useCallback, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  FlatList,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { fetch_UserData } from '../../backend/components/request';
import { Basic_url } from '../../backend/config/config';
import { Platform } from 'react-native';
import { getRecipePosts, getLikedPosts, getSpecificPost, getFeedPosts, getNumberOfReviewedPosts,deletePostByIdAndUid } from '../../backend/components/postRequest';
import * as Notifications from 'expo-notifications';
const ProfileScreen = () => {
  const [userData, setUserData] = useState({
    username: '',
    profilePic: '',
    bio: '',
    stats: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [reviewPosts, setreviewPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const navigation = useNavigation();
  const route = useRoute();
  const { type } = route.params || {};





  const handleFetchUserData = async () => {
    try {
      const response = await fetch_UserData();
      console.log("Fetched user Data:", response);
      setUserData({
        id: response._id,
        username: response.name || 'User',
        profilePic: `${Basic_url}${response.profilepic}`,
        bio: response.description || 'Food enthusiast 🍳',
        stats: response.stats || [],
      });

      const postsResponse = await getRecipePosts(response._id);
      setPosts(postsResponse);
      const reviewpostresponse = await getNumberOfReviewedPosts(response._id);
      setreviewPosts(reviewpostresponse.numberOfReviewedPosts);
      //console.log("Review Post Response:", reviewpostresponse);

      if (type !== 'search') {
        const likedPostsResponse = await getLikedPosts(response._id);
        const likedPostsDetails = await Promise.all(
          likedPostsResponse.likedPosts.map(async (likedPost) => {
            const postDetails = await getSpecificPost(likedPost.postId);
            return postDetails;
          })
        );
        setLikedPosts(likedPostsDetails);
      }
    } catch (error) {
      //console.error("Error fetching user data:", error);
      setError('Failed to fetch user data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await handleFetchUserData();
  };

  useFocusEffect(
    useCallback(() => {
      handleFetchUserData();
    }, [])
  );



  

  const getTotalPosts = () => {
    return posts.length;
  };

  const stats = [
    { label: 'Posts', value: getTotalPosts() },
    { label: 'Liked', value: likedPosts.length },
    { label: 'Reviewed', value: reviewPosts },
  ];

  const renderMealPost = ({ item }) => {
    const img_url = `${Basic_url}${item.image}`;
  
    const handleDeletePost = async (postId) => {
      console.log("Post ID to delete:", postId);
      console.log("User ID:", userData.id);
      Alert.alert(
        'Delete Post',
        'Are you sure you want to delete this post?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              try {
                await deletePostByIdAndUid(postId, userData.id); // Call deletePost function
                setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId)); // Remove the deleted post from the list
                Alert.alert('Success', 'Post deleted successfully');
              } catch (error) {
                console.error('Error deleting post:', error);
                Alert.alert('Error', 'Failed to delete the post');
              }
            },
          },
        ]
      );
    };
  
    return (
      <TouchableOpacity
        style={styles.mealPost}
        onPress={() => navigation.navigate('PostDetails', { postId: item._id })}
        onLongPress={activeTab === 'posts' ? () => handleDeletePost(item._id) : null} // Only enable long press in "My Posts" tab
      >
        <Image source={{ uri: img_url }} style={styles.mealImage} />
      </TouchableOpacity>
    );
  };

  const shareProfileOnWhatsApp = () => {
    const message = `🔗 **Check out my profile:** ${userData.username} 👀✨    

🍽️ **Explore delicious recipes & reviews** on the **MEALMATE** app! 📲🔥  

🚀 **Download now & dive into a world of flavors!** 🍛🍕🥗`;
    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'WhatsApp is not installed on your device');
    });
  };

  const renderProfileInfo = () => (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        {type !== 'search' && (
          <TouchableOpacity>
            <Ionicons name="pencil-sharp" size={24} color="black" onPress={() => navigation.navigate('EditProfile')} />
          </TouchableOpacity>
        )}
      </View>

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

        {type !== 'search' && (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditProfile')}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton} onPress={shareProfileOnWhatsApp}>
              <Text style={styles.shareButtonText}>Share Profile</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'posts' && styles.activeTab]} 
          onPress={() => setActiveTab('posts')}
        >
          <Ionicons name="grid-outline" size={24} color={activeTab === 'posts' ? "#F59E0B" : "black"} />
        </TouchableOpacity>
        {type !== 'search' && (
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'likes' && styles.activeTab]} 
            onPress={() => setActiveTab('likes')}
          >
            <Ionicons name="heart-outline" size={24} color={activeTab === 'likes' ? "#F59E0B" : "black"} />
          </TouchableOpacity>
        )}
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
      data={activeTab === 'posts' ? posts : likedPosts}
      renderItem={renderMealPost}
      numColumns={3}
      keyExtractor={(item) => item._id}
      ListHeaderComponent={renderProfileInfo}
      contentContainerStyle={styles.container}
      onRefresh={handleRefresh}
      refreshing={isRefreshing}
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
    borderWidth: 3,
    borderColor: '#fbbf24',
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
    backgroundColor: '#ddd',
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