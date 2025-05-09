const express = require('express');
const router = express.Router();
const Like = require('../models/Like'); // Import the Like model

// Like a post
router.post('/likePost/:postId', async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
    let like = await Like.findOne({ uid: userId });

    if (!like) {
      like = new Like({ uid: userId, posts: new Map() });
    }

    like.posts.set(postId, { postId, like: true });

    await like.save();

    const response = {
      uid: {
        [userId]: {
          [postId]: {
            like: true,
            _id: like._id
          }
        },
        __v: like.__v
      }
    };

    res.status(200).json({ message: 'Post liked successfully', like: response });
  } catch (error) {
    res.status(500).json({ message: 'Error liking post', error: error.message });
  }
});

// Unlike a post
router.post('/unlikePost/:postId', async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
    const like = await Like.findOne({ uid: userId });

    if (like && like.posts.has(postId)) {
      like.posts.set(postId, { postId, like: false });
      await like.save();
    }

    const response = {
      uid: {
        [userId]: {
          [postId]: {
            like: false,
            _id: like._id
          }
        },
        __v: like.__v
      }
    };

    res.status(200).json({ message: 'Post unliked successfully', like: response });
  } catch (error) {
    res.status(500).json({ message: 'Error unliking post', error: error.message });
  }
});


// Check if a post is liked
router.get('/isPostLiked/:postId', async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.query;

  try {
    const like = await Like.findOne({ uid: userId });

    if (like && like.posts.has(postId)) {
      const postLike = like.posts.get(postId);
      return res.status(200).json({ liked: postLike.like });
    }

    res.status(200).json({ liked: false });
  } catch (error) {
    res.status(500).json({ message: 'Error checking like status', error: error.message });
  }
});

// Retrieve all posts liked by a user
router.get('/likedPosts/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const like = await Like.findOne({ uid: userId });

    if (!like) {
      return res.status(404).json({ message: 'No liked posts found for this user' });
    }

    const likedPosts = [];
    like.posts.forEach((post, postId) => {
      if (post.like) {
        likedPosts.push({ postId: postId.toString() });
      }
    });

    res.status(200).json({ likedPosts });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving liked posts', error: error.message });
  }
});


module.exports = router;