import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { hp, wp } from '../../helpers/common'; // Assuming you already have these helpers
import { HeartIcon, ChatBubbleLeftEllipsisIcon } from 'react-native-heroicons/solid';

const FeedScreen = ({ backgroundColor = '#fff', homeTextColor = '#fbbf24' }) => {
  const [feedData] = useState([
    {
      id: '1',
      username: 'go_noise',
      profilePic: 'https://via.placeholder.com/60',
      postImage: 'https://via.placeholder.com/400x300',
      description: 'Airwave Max 5 with Hybrid Adaptive ANC',
      likes: 1455,
      comments: 6,
    },
    {
      id: '2',
      username: 'tech_trends',
      profilePic: 'https://via.placeholder.com/60',
      postImage: 'https://via.placeholder.com/400x300',
      description: 'Check out the latest in tech gadgets!',
      likes: 2543,
      comments: 12,
    },
  ]);

  const renderItem = ({ item }) => (
    <View style={styles.postContainer}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <Image source={{ uri: item.profilePic }} style={styles.profilePic} />
        <Text style={styles.username}>{item.username}</Text>
      </View>

      {/* Post Image */}
      <Image source={{ uri: item.postImage }} style={styles.postImage} />

      {/* Post Description */}
      <View style={styles.postDescriptionContainer}>
        <Text style={styles.description}>{item.description}</Text>
        <View style={styles.postStats}>
          <View style={styles.statItem}>
            <HeartIcon color={homeTextColor} size={hp(2.5)} />
            <Text style={styles.statText}>{item.likes}</Text>
          </View>
          <View style={styles.statItem}>
            <ChatBubbleLeftEllipsisIcon color={homeTextColor} size={hp(2.5)} />
            <Text style={styles.statText}>{item.comments}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar style="dark" />
      <ScrollView>
        <FlatList
          data={feedData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: hp(2),
  },
  postContainer: {
    marginBottom: hp(3),
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: wp(2),
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(3),
    borderBottomWidth: 1,
    borderColor: '#fbbf24',
    backgroundColor: '#fbbf24',
  },
  profilePic: {
    height: hp(6),
    width: hp(6),
    borderRadius: hp(3),
    marginRight: wp(3),
  },
  username: {
    fontSize: hp(2),
    fontWeight: 'bold',
    color: '#fff',
  },
  postImage: {
    width: '100%',
    height: hp(30),
    resizeMode: 'cover',
  },
  postDescriptionContainer: {
    padding: wp(3),
    backgroundColor: '#fff',
  },
  description: {
    fontSize: hp(2),
    marginBottom: hp(1),
    color: '#525252',
  },
  postStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(1),
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: hp(1.8),
    color: '#525252',
    marginLeft: wp(1),
  },
});

export default FeedScreen;
