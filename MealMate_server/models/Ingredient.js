const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: false } // Optional field for image path
});

const Ingredient = mongoose.model('Ingredient', ingredientSchema);
module.exports = Ingredient;