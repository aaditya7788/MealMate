const path = require('path');

function getRandomProfilePic() {
    const randomIndex = Math.floor(Math.random() * 5) + 1; // Random number between 1 and 5
    return path.join('/storage/profile', `${randomIndex}.png`);
}

module.exports = getRandomProfilePic;