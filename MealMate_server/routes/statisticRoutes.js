const express = require('express');
const router = express.Router();
const Statistic = require('../models/Statistic'); // Import the Statistic model

// Increment likes for a post
router.post('/incrementLike/:postId', async (req, res) => {
  const { postId } = req.params;

  try {
    let statistic = await Statistic.findOne({ postId });

    if (!statistic) {
      statistic = new Statistic({ postId, likes: 0, reviews: 0 });
    }

    statistic.likes += 1;
    await statistic.save();

    res.status(200).json({ message: 'Like incremented successfully', statistic });
  } catch (error) {
    res.status(500).json({ message: 'Error incrementing like', error: error.message });
  }
});

// Decrement likes for a post
router.post('/decrementLike/:postId', async (req, res) => {
  const { postId } = req.params;

  try {
    let statistic = await Statistic.findOne({ postId });

    if (!statistic) {
      return res.status(404).json({ message: 'Statistic not found for this post' });
    }

    statistic.likes = Math.max(0, statistic.likes - 1); // Ensure likes do not go below 0
    await statistic.save();

    res.status(200).json({ message: 'Like decremented successfully', statistic });
  } catch (error) {
    res.status(500).json({ message: 'Error decrementing like', error: error.message });
  }
});

// Increment reviews for a post
router.post('/incrementReview/:postId', async (req, res) => {
  const { postId } = req.params;

  try {
    let statistic = await Statistic.findOne({ postId });

    if (!statistic) {
      statistic = new Statistic({ postId, likes: 0, reviews: 0 });
    }

    statistic.reviews += 1;
    await statistic.save();

    res.status(200).json({ message: 'Review incremented successfully', statistic });
  } catch (error) {
    res.status(500).json({ message: 'Error incrementing review', error: error.message });
  }
});

// Decrement reviews for a post
router.post('/decrementReview/:postId', async (req, res) => {
  const { postId } = req.params;

  try {
    let statistic = await Statistic.findOne({ postId });

    if (!statistic) {
      return res.status(404).json({ message: 'Statistic not found for this post' });
    }

    statistic.reviews = Math.max(0, statistic.reviews - 1); // Ensure reviews do not go below 0
    await statistic.save();

    res.status(200).json({ message: 'Review decremented successfully', statistic });
  } catch (error) {
    res.status(500).json({ message: 'Error decrementing review', error: error.message });
  }
});

// Retrieve total likes and reviews for a post
router.get('/totalStats/:postId', async (req, res) => {
  const { postId } = req.params;

  try {
    let statistic = await Statistic.findOne({ postId });

    if (!statistic) {
      statistic = new Statistic({ postId, likes: 0, reviews: 0 });
      await statistic.save();
    }

    res.status(200).json({ likes: statistic.likes, reviews: statistic.reviews });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving statistics', error: error.message });
  }
});

module.exports = router;