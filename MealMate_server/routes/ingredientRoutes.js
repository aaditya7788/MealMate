const express = require('express');
const router = express.Router();
const Ingredient = require('../models/Ingredient'); // Import the Ingredient model

// Search ingredients by alphabet
router.get('/search/:alphabet', async (req, res) => {
  const { alphabet } = req.params;

  try {
    const ingredients = await Ingredient.find({ name: new RegExp(`^${alphabet}`, 'i') });

    const results = ingredients.map(ingredient => ({
      name: ingredient.name,
      image: ingredient.image ? `/storage/ingredients/${ingredient.image}` : null
    }));

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving ingredients', error: error.message });
  }
});

module.exports = router;