const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = '../MealMate_server/storage/profile';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true }); // Create 'profile' folder if it doesn't exist
    }
    cb(null, uploadDir); // Save file to 'profile' folder
  },
  filename: (req, file, cb) => {
    const userId = req.params.id; // Get the user ID from the request parameters
    cb(null, `${userId}.png`); // Save the file as userId.png
  }
});

const upload = multer({ storage: storage });

module.exports = upload;