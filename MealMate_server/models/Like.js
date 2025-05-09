const mongoose = require('mongoose');

const postLikeSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  like: { type: Boolean, default: false }
});

const likeSchema = new mongoose.Schema({
  uid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  posts: { type: Map, of: postLikeSchema, default: {} }
});

const Like = mongoose.model('Like', likeSchema);
module.exports = Like;