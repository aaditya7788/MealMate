const express = require('express');
const router = express.Router();
const Meal = require('../models/meal');

// Get meals for a specific day
router.get('/meals/:day', async (req, res) => {
  const { userId } = req.query; // Get userId from query (or JWT)
  const { day } = req.params;
  try {
    const meals = await Meal.find({ userId, day });
    res.status(200).json(meals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new meal
router.post('/meals', async (req, res) => {
  const mealData = req.body; // Ensure body contains userId, day, type, etc.
  try {
    const meal = new Meal(mealData);
    await meal.save();
    res.status(201).json(meal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update meal status using GET
// Update meal status to "completed" using GET
router.get('/meals/:id/completed', async (req, res) => {
  const { id } = req.params;
  const status = req.query.status || 'completed'; // Default status to "completed"

  try {
    const updatedMeal = await Meal.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedMeal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    res.status(200).json({ message: 'Meal status updated to completed successfully', meal: updatedMeal });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Delete a meal using GET
router.get('/meals/:id/delete', async (req, res) => {
  const { id } = req.params;
  console.log(`Deleting meal with id: ${id}`); // Log the id for debugging
  try {
    const deletedMeal = await Meal.findByIdAndDelete(id);
    if (!deletedMeal) {
      return res.status(404).json({ message: 'Meal not found' });
    }
    res.status(200).json({ message: 'Meal deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;