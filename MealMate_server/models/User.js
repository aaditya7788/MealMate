const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  salt: { type: String, required: true },
  authToken: { type: String, required: true }, // Store the authentication token
  profilepic: { type: String, required: false }, // Store the profile picture URL
  description: { type: String, required: false }, // Store the user description
  stats: {
    posts: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 }
  },
  status: { type: String, required: false }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
