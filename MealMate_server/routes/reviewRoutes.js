const express = require('express');
const router = express.Router();
const Review = require('../models/Review'); // Import the Review model
const User = require('../models/User');

// Review a post
router.post('/reviewPost/:postId', async (req, res) => {
  const { postId } = req.params;
  const { userId, rating, comment } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let review = await Review.findOne({ uid: userId });

    if (!review) {
      review = new Review({ uid: userId, username: user.name, profilepic: user.profilepic, posts: new Map() });
    }

    review.posts.set(postId, { postId, review: { rating, comment } });

    await review.save();

    const response = {
      uid: {
        [userId]: {
          username: user.name,
          profilepic: user.profilepic,
          [postId]: {
            review: { rating, comment },
            _id: review._id
          }
        },
        __v: review.__v
      }
    };

    res.status(200).json({ message: 'Post reviewed successfully', review: response });
  } catch (error) {
    res.status(500).json({ message: 'Error reviewing post', error: error.message });
  }
});

// Delete a review
router.delete('/deleteReview/:postId', async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
    const review = await Review.findOne({ uid: userId });

    if (review && review.posts.has(postId)) {
      const postReview = review.posts.get(postId);
      postReview.review = null;
      review.posts.set(postId, postReview);
      await review.save();
    }

    const response = {
      uid: {
        [userId]: {
          [postId]: {
            review: null,
            _id: review._id
          }
        },
        __v: review.__v
      }
    };

    res.status(200).json({ message: 'Review deleted successfully', review: response });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review', error: error.message });
  }
});


// Retrieve all reviews for a post
router.get('/reviews/:postId', async (req, res) => {
  const { postId } = req.params;

  try {
    const reviews = await Review.find({ [`posts.${postId}.postId`]: postId });

    if (!reviews || reviews.length === 0) {
      return res.status(200).json({ message: 'No reviews available for this post', reviews: [] });
    }

    const postReviews = [];
    reviews.forEach(review => {
      const postReview = review.posts.get(postId);
      if (postReview && postReview.review) {
        postReviews.push({
          userId: review.uid,
          postId: postReview.postId,
          username: review.username,
          profilepic: review.profilepic,
          rating: postReview.review.rating,
          comment: postReview.review.comment
        });
      }
    });

    res.status(200).json({ message: 'Post reviews retrieved successfully', reviews: postReviews });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving reviews', error: error.message, reviews: [] });
  }
});

// Check if a post is reviewed by a user
router.get('/isReviewed/:postId', async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.query;

  try {
    const review = await Review.findOne({ uid: userId });

    if (review && review.posts.has(postId)) {
      const postReview = review.posts.get(postId);
      if (postReview && postReview.review) {
        return res.status(200).json({ reviewed: true});
      }
      else {
        return res.status(200).json({ reviewed: false });
      }
    }

    res.status(200).json({ reviewed: false });
  } catch (error) {
    res.status(500).json({ message: 'Error checking review status', error: error.message });
  }
});

// Retrieve the number of posts reviewed by a user
router.get('/numberOfReviewedPosts/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const review = await Review.findOne({ uid: userId });

    if (!review) {
      return res.status(200).json({ message: 'No reviews found for this user', numberOfReviewedPosts: 0 });
    }

    const numberOfReviewedPosts = Array.from(review.posts.values()).filter(post => post.review).length;

    res.status(200).json({ message: 'Number of reviewed posts retrieved successfully', numberOfReviewedPosts });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving number of reviewed posts', error: error.message });
  }
});

module.exports = router;