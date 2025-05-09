const jwt = require('jsonwebtoken');

const JWT_SECRET = '48e18afafd15dca1002ab325bbb6bfb1ec6e464d743ad07486a7cb5042f01527';  // Replace with your own secret

const generateToken = (userId) => {
    // Generate a token that never expires
    return jwt.sign({ userId }, JWT_SECRET);  // No expiresIn means the token never expires
};

module.exports = { generateToken };
