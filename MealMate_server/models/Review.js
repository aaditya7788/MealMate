const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  rating: { type: Number, required: true },
  comment: { type: String, required: true }
});

const postReviewSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  review: { type: reviewSchema, default: null }
});

const userReviewSchema = new mongoose.Schema({
  uid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  profilepic: { type: String, required: true },
  posts: { type: Map, of: postReviewSchema, default: {} }
});

const Review = mongoose.model('Review', userReviewSchema);
module.exports = Review;