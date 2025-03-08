import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Switch,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { getFeedPosts, likePost, unlikePost, isPostLiked, incrementLikeCount, decrementLikeCount, getTotalStats } from "../../backend/components/postRequest"; // Assumed import
import { useNavigation } from "@react-navigation/native";
import { fetch_UserData, fetch_UserData_id } from "../../backend/components/request";
import { Basic_url } from "../../backend/config/config";
import CommentContainer from "../components/CommentContainer";
import { getIsVeg, setIsVeg } from "../../backend/LocalStorage/isVeg_Store";
const FeedScreen = () => {
  const [posts, setPosts] = useState([]);
  const [userData, setUserData] = useState({});
  const [likedPosts, setLikedPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [commentVisible, setCommentVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isVeg, setIsVegState] = useState(getIsVeg());
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const lastTap = useRef({});




  useEffect(() => {
    const fetchIsVeg = async () => {
      const value = await getIsVeg();
      setIsVegState(value);
    };
    fetchIsVeg();
  }, []);

  
  const fetchUserProfileData = async () => {
    try {
      const response = await fetch_UserData();
      setUserData({
        id: response._id,
        username: response.name || "User",
        profilePic: `${Basic_url}${response.profilepic}`,
        bio: response.description || "Food enthusiast 🍳",
        stats: response.stats || [],
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchFeedPosts = async () => {
    try {
      setLoading(true);
      const dietType = isVeg ? 'Veg' : 'Any';
      console.log("Diet Type:", dietType);
      const response = await getFeedPosts(dietType);
      const postsWithUserData = await Promise.all(
        response.map(async (post) => {
          const userResponse = await fetch_UserData_id(post.uid);
          const likedResponse = await isPostLiked(post._id, userData.id);

          if (likedResponse.liked) {
            setLikedPosts((prevLikedPosts) => [...prevLikedPosts, post._id]);
          }
          return {
            ...post,
            user: {
              username: userResponse.name || "Unknown User",
              profilePic: `${Basic_url}${userResponse.profilepic}`,
              dietType: userResponse.dietType || post.dietType,
              liked: post.liked,
              likes: post.likes,
              reviews: post.reviews,
              _id: post.uid,
            },
          };
        })
      );
      setPosts((prevPosts) => [...prevPosts, ...postsWithUserData]);
      setHasMore(response.length > 0);
    } catch (error) {
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfileData();
    fetchFeedPosts();
  }, [page], isVeg);

  const handleLike = async (id) => {
    const userId = userData.id; // Assuming userData contains the user's ID
    const isLiked = likedPosts.includes(id);

    setLikedPosts((prevLikedPosts) =>
      isLiked ? prevLikedPosts.filter((postId) => postId !== id) : [...prevLikedPosts, id]
    );

    try {
      if (isLiked) {
        await unlikePost(id, userId);
        decrementLikeCount(id);
      } else {
        await likePost(id, userId);
        incrementLikeCount(id);
      }
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setPosts([]);
    setLikedPosts([]);
    setPage(1);
    fetchFeedPosts().then(() => setRefreshing(false));
  };

  const renderPost = ({ item }) => {
    const postUser = item.user || {};
    //console.log("Post User:", postUser);

    return (
      <View style={styles.postContainer}>
        <View style={styles.postHeader}>
          <View style={styles.userInfo} onTouchEnd={() => navigation.navigate("SearchProfile", { uid: postUser._id })}>
            <Image
              source={{ uri: postUser.profilePic || "https://picsum.photos/200" }}
              style={styles.userAvatar}
            />
            <View>
              <Text style={styles.username}>{postUser.username}</Text>
              <Text style={styles.location}>{postUser.dietType}</Text>
            </View>
          </View>
          {/* <Ionicons name="ellipsis-vertical" size={20} color="gray" /> */}
        </View>

        <View
          style={styles.imageContainer}
          onTouchEnd={() => {
            const now = new Date().getTime();
            if (!lastTap.current[item._id]) lastTap.current[item._id] = 0;

            if (now - lastTap.current[item._id] < 300) {
              handleLike(item._id);
            }
            lastTap.current[item._id] = now;
          }}
        >
          <TouchableOpacity onPress={() => navigation.navigate("PostDetails", { postId: item._id })}>
            <Image 
              source={{ uri: `${Basic_url}${item.image}` }}
              style={styles.postImage}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.actionsRow}>
          <View style={styles.actionsLeft}>
            <TouchableOpacity onPress={() => handleLike(item._id)}>
              <Ionicons
                name={likedPosts.includes(item._id) ? "heart" : "heart-outline"}
                size={30}
                color={likedPosts.includes(item._id) ? "#F59E0B" : "black"}
              />
            </TouchableOpacity>
            {item.likes > 0 && <Text style={styles.likes}>{item.likes} </Text>}
            <TouchableOpacity onPress={() => {
              setSelectedPostId(item._id);
              setCommentVisible(true);
            }}>
              <Ionicons name="chatbubble-outline" size={30} color="black" style={styles.actionIcon} />
            </TouchableOpacity>
            {item.reviews > 0 && <Text style={styles.reviews}>{item.reviews}</Text>}
          </View>
        </View>

        <View style={styles.postDetails}>
          <Text style={styles.likes}>{likedPosts.includes(item._id) ? "Liked" : "Like"}</Text>
          <Text style={[styles.postname]}>{item.name}</Text>
          <Text style={styles.caption}>
            {item.instructions && item.instructions.length > 40 
              ? item.instructions.substring(0, 40) + "..." 
              : item.instructions}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar  style="dark" backgroundColor="transparent" />

      <View style={styles.header}>
        <TouchableOpacity onPress={onRefresh}>
          <Ionicons name="refresh" size={25} color="black" />
        </TouchableOpacity>
        <Text style={styles.logo}>MealMate</Text>
        <Text style={styles.text}>{isVeg ? 'Veg' : 'veg mode'}</Text>
        <Switch
            trackColor={{ false: '#767577', true: '#fbbf24' }}
            thumbColor={isVeg ? '#fff' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={(value) => {
              setIsVegState(value);
              setIsVeg(value);
              onRefresh();
            }}
            value={isVeg}
          />
    

        <View style={styles.headerIcons}>
          {/* <Ionicons name="heart-outline" size={25} color="black" />
          <Ionicons
            name="chatbubble-outline"
            size={25}
            color="black"
            style={styles.headerIcon}
          /> */}
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item._id.toString() + Math.random()}
        ListHeaderComponent={
          <View style={styles.profileSection} onTouchEnd={() => navigation.navigate("Profile")}>
            <Image
              source={{ uri: userData.profilePic }}
              style={styles.profilePicture}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{userData.username}</Text>
              <Text style={styles.profileBio}>{userData.bio}</Text>
            </View>
          </View>
        }
        onEndReached={() => setPage((prevPage) => prevPage + 1)}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator size='large' color="#F59E0B" /> : null}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <CommentContainer
        visible={commentVisible}
        onClose={() => setCommentVisible(false)}
        postId={selectedPostId}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: "#fff",
    marginBottom: 60,
  },
  imageContainer: {
    position: "relative",
  },
  text: {
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 10,
  },
  header: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  logo: {
    fontFamily: "Georgia",
    fontSize: 22,
    fontWeight: "bold",
    color: "#F59E0B",
  },
  headerIcons: {
    flexDirection: "row",
  },
  headerIcon: {
    marginLeft: 20,
  },
  postContainer: {
    marginBottom: 20,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontWeight: "bold",
    color: "#333",
  },
  location: {
    fontSize: 12,
    color: "gray",
  },
  postImage: {
    width: "100%",
    height: 300,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  actionsLeft: {
    flexDirection: "row",
  },
  actionIcon: {
    marginLeft: 10,
  },
  postDetails: {
    padding: 10,
  },
  likes: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
    paddingTop: 5,
  },
  reviews: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
    paddingTop: 5,
  },
  caption: {
    marginBottom: 5,
  },
  comments: {
    color: "gray",
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
    color: "gray",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  profilePicture: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#f59E0B",
  },
  profileInfo: {
    marginLeft: 10,
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  profileBio: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    flexWrap: "wrap",
  },
});

export default FeedScreen;