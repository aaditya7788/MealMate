const mongoose = require('mongoose');

const MealSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Link to a user
  day: { type: String, required: true }, // E.g., 'Mon'
  date: { type: String, required: true }, // E.g., '2023-10-01'
  type: { type: String, required: true }, // 'breakfast', 'lunch', etc.
  title: { type: String, required: true },
  mealType: { type: String, required: true },
  time: { type: String, required: true },
  image: { type: String, required: false }, // URL of image
recipeid: { type: String, required: true }, // Make it required
  status: { type: String, required: true }, // 'upcoming', 'completed', etc.
});

module.exports = mongoose.model('Meal', MealSchema);