const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./db');
const userRoutes = require('./routes/userRoutes');
const mealRoutes = require('./routes/mealRoutes');
const postRoutes = require('./routes/postRoutes');
const ingredientRoutes = require('./routes/ingredientRoutes'); // Import ingredientRoutes
const statisticRoutes = require('./routes/statisticRoutes'); // Import statisticRoutes
const likeRoutes = require('./routes/likeRoutes'); // Import likeRoutes
const reviewRoutes = require('./routes/reviewRoutes'); // Import reviewRoutes
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Serve static files from the storage/profile and storage/posts directories
app.use('/storage/profile', express.static(path.join(__dirname, 'storage/profile')));
app.use('/storage/posts', express.static(path.join(__dirname, 'storage/posts')));
app.use('/storage/ingredients', express.static(path.join(__dirname, 'storage/ingredients'))); // Serve ingredient images

// Routes
app.use('/api/users', userRoutes); // Base route for user-related APIs
app.use('/api/meals', mealRoutes); // Base route for meal-related APIs
app.use('/api/post', postRoutes); // Base route for post-related APIs
app.use('/api/ingredients', ingredientRoutes); // Base route for ingredient-related APIs
app.use('/api/statistics', statisticRoutes); // Base route for statistic-related APIs
app.use('/api/likes', likeRoutes); // Base route for like-related APIs
app.use('/api/reviews', reviewRoutes); // Base route for review-related APIs


app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});