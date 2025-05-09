const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: String, required: true }
});

const postSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String, required: false }, // Make image field optional
  dietType: { type: String, required: true },
  mealType: { type: String, required: true },
  ingredients: [ingredientSchema],
  instructions: { type: String, required: true }
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;