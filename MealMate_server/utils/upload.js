const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../storage/posts');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true }); // Create 'posts' folder if it doesn't exist
    }
    cb(null, uploadDir); // Save file to 'posts' folder
  },
  filename: (req, file, cb) => {
    const postid = req.postId; // Get the post ID from the request object
    cb(null, `${postid}.png`); // Save the file as postId.png
  }
});

const upload = multer({ storage: storage });

module.exports = upload;