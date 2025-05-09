const express = require('express');
const User = require('../models/User');
const { encryptPassword, verifyPassword } = require('../utils/encryption');
const { generateToken } = require('../utils/tokenUtils');
const upload = require('../utils/storage');  // Import storage configuration
const getRandomProfilePic = require('../utils/randomProfilePic'); // Import random profile pic function
const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const { hashedPassword, salt } = await encryptPassword(password);
        const profilepic = getRandomProfilePic(); // Get a random profile picture

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            salt: salt,
            profilepic: profilepic, // Set the random profile picture
            description: 'Stay strong, and chase their dreams. 💼💪✨', // Initialize description
            stats: { posts: 0, likes: 0, reviews: 0 }, // Initialize stats
            status: 'active' // Initialize status
        });

        const authToken = generateToken(newUser._id);
        newUser.authToken = authToken;
        await newUser.save();

        res.status(201).json({ 
            message: 'User registered successfully', 
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                profilepic: newUser.profilepic,
                description: newUser.description,
                stats: newUser.stats,
                authToken: newUser.authToken,
                status: newUser.status
            } 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});



// Login a user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email }).collation({ locale: 'en', strength: 2 });

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await verifyPassword(password, user.salt, user.password);

        if (isPasswordValid) {
            const authToken = generateToken(user._id);
            res.status(200).json({
                message: 'Login successful',
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    authToken: user.authToken,
                    profilepic: user.profilepic, // Include the profile picture URL
                    status: user.status
                }
            });
        } else {
            res.status(400).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});


// Update profile
router.put('/updateProfile', async (req, res) => {
    const authToken = req.headers.authorization;
    const {profilepic, name, description, stats, status } = req.body;

    if (!authToken) {
        return res.status(401).json({ message: 'Authorization token is required' });
    }

    try {
        const user = await User.findOne({ authToken });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updateData = {};
        if (profilepic) updateData.profilepic = profilepic;
        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (stats) updateData.stats = stats;
        if (status) updateData.status = status;
        

        const updatedUser = await User.findByIdAndUpdate(user._id, updateData, { new: true });

        res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
});

// Retrieve user info
router.get('/userinfo', async (req, res) => {
    const authToken = req.headers.authorization;

    if (!authToken) {
        return res.status(401).json({ message: 'Authorization token is required' });
    }

    try {
        const user = await User.findOne({ authToken });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            _id: user._id,
            name: user.name,
            profilepic: user.profilepic,
            description: user.description,
            stats: user.stats,
            status: user.status,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user info', error: error.message });
    }

});

// Retrieve user info by _id
router.get('/user/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const user = await User.findById(id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({
        _id: user._id,
        name: user.name,
        profilepic: user.profilepic,
        description: user.description,
        stats: user.stats,
        status: user.status,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving user info', error: error.message });
    }
  });
  
  // Retrieve user info by name (contains at least one letter of the provided name)
  router.get('/user/search/:name', async (req, res) => {
    const { name } = req.params;
  
    try {
      const users = await User.find({ name: new RegExp(name, 'i') });
  
      if (users.length === 0) {
        return res.status(404).json({ message: 'No users found' });
      }
  
      const userInfo = users.map(user => ({
        _id: user._id,
        name: user.name,
        profilepic: user.profilepic,
        description: user.description,
        stats: user.stats,
        status: user.status,
      }));
  
      res.status(200).json(userInfo);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving user info', error: error.message });
    }
  });

module.exports = router;