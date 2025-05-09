const express = require('express');
const router = express.Router();
const Post = require('../models/Post'); // Import the Post model
const upload = require('../utils/upload'); // Import the upload middleware
const fs = require('fs');
const path = require('path');

// Create a new post
router.post('/createPost', async (req, res) => {
  const { uid, name, dietType, mealType, ingredients, instructions } = req.body;

  if (!uid || !dietType || !mealType || !ingredients || !instructions) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const post = new Post({
      uid,
      name,
      dietType,
      mealType,
      ingredients,
      instructions
    });

    await post.save();

    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
});

// Upload recipe image
router.post('/uploadRecipeImage/:postId', upload.single('image'), async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (req.file) {
      const oldPath = req.file.path;
      const newPath = path.join(__dirname, `../storage/posts/${postId}.png`);
      fs.renameSync(oldPath, newPath);
      post.image = `/storage/posts/${postId}.png`;
      await post.save();
    } else {
      return res.status(400).json({ message: 'Image is required' });
    }

    res.status(200).json({ message: 'Image uploaded successfully', post });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading image', error: error.message });
  }
});

// Retrieve posts by uid
router.get('/posts/:uid', async (req, res) => {
  const { uid } = req.params;

  try {
    const posts = await Post.find({ uid });

    if (!posts) {
      return res.status(404).json({ message: 'No posts found for this user' });
    }

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving posts', error: error.message });
  }
});




// // Retrieve random posts filtered by diet type
// router.get('/randomPosts/:dietType', async (req, res) => {
//   const { dietType } = req.params;

//   try {
//     const posts = await Post.aggregate([
//       { $match: { dietType } },
//       { $sample: { size: 10 } }
//     ]);

//     res.status(200).json(posts);
//   } catch (error) {
//     res.status(500).json({ message: 'Error retrieving posts', error: error.message });
//   }
// });


router.get('/randomPosts/:dietType', async (req, res) => {
  const { dietType } = req.params;

  try {
    let matchCondition = {};

    if (dietType === 'Veg') {
      matchCondition = { dietType: 'Veg' };
    }

    const posts = await Post.aggregate([
      { $match: matchCondition },
      { $sample: { size: 10 } }
    ]);

    // Ensure posts are unique
    const uniquePosts = Array.from(new Set(posts.map(post => post._id)))
      .map(id => posts.find(post => post._id.equals(id)));

    res.status(200).json(uniquePosts);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving posts', error: error.message });
  }
});


// Retrieve specific post by id
router.get('/post/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving post', error: error.message });
  }
});

// Delete a post by ID and UID using GET
router.get('/deletePost/:id/:uid', async (req, res) => {
  const { id, uid } = req.params;

  try {
    // Find the post by ID and UID
    const post = await Post.findOneAndDelete({ _id: id, uid });

    if (!post) {
      return res.status(404).json({ message: 'Post not found or unauthorized' });
    }

    // Optionally, delete the associated image file if it exists
    if (post.image) {
      const imagePath = path.join(__dirname, `../${post.image}`);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error: error.message });
  }
});


module.exports = router;