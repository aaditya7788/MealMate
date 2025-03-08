import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import { reviewPost, getReviews, incrementReviewCount } from "../../backend/components/postRequest";
import { getAuthData } from "../../backend/LocalStorage/auth_store";

const StarRating = ({ rating, setRating }) => {
  return (
    <View style={styles.starContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => setRating(star)}>
          <Ionicons
            name={star <= rating ? "star" : "star-outline"}
            size={30}
            color="#F59E0B"
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const CommentContainer = ({ visible, onClose, postId }) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const authdata = getAuthData();
  const uid = authdata.uid;

  useEffect(() => {
    if (visible) {
      fetchComments();
    }
  }, [visible]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await getReviews(postId);
      console.log("Post ID:", postId);
      console.log("Reviews response:", response);
      setComments(response.reviews);
      setHasReviewed(response.reviewed);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (comment.trim() !== "") {
      try {
        const response = await reviewPost(postId, rating, comment);
        console.log("commentabc:", rating);
        const increment = await incrementReviewCount(postId);
        console.log("Increment response:", increment);
        
        console.log("Review response:", response);
        setComments((prev) => [
          { id: Math.random().toString(), username: "You", text: comment, rating },
          ...prev,
        ]);
        setComment("");
        setRating(0);
        setHasReviewed(true);
      } catch (error) {
        console.error("Error adding review:", error);
      }
    }
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      style={styles.modal}
    >
      <View style={styles.commentBox}>
        <View style={styles.header}>
          <Text style={styles.commentTitle}>Reviews</Text>
          <TouchableOpacity onPress={onClose}>
            {/* <Ionicons name="close" size={24} color="black" /> */}
          </TouchableOpacity>
        </View>
        
        {loading ? (
          <ActivityIndicator size="large" color="#F59E0B" />
        ) : (
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id + Math.random().toString()}
            renderItem={({ item }) => (
              <View style={styles.commentItem}>
                <Text style={styles.commentUsername}>{item.username || item.userId}:</Text>
                <Text style={styles.commentText}>{item.comment}</Text>
                <StarRating rating={item.rating} setRating={() => {}} />
              </View>
            )}
            style={styles.commentList}
          />
        )}
        
        {!hasReviewed ? (
          <>
            <StarRating rating={rating} setRating={setRating} />
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Write a comment..."
                value={comment}
                onChangeText={setComment}
                onSubmitEditing={handleAddComment}
              />
              <TouchableOpacity onPress={handleAddComment}>
                <Ionicons name="send" size={24} color="#F59E0B" />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <Text style={styles.alreadyReviewedText}>Already reviewed</Text>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  commentBox: {
    backgroundColor: "white",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: "80%",
  },
  commentTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  commentItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  commentUsername: {
    fontWeight: "bold",
    marginRight: 5,
  },
  commentText: {
    fontSize: 14,
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    paddingTop: 8,
    marginTop: 8,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 8,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  commentList: {
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  starContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  alreadyReviewedText: {
    textAlign: "center",
    color: "red",
    marginTop: 10,
    fontSize: 16,
  },
});

export default CommentContainer;