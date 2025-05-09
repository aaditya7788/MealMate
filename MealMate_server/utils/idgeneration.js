const crypto = require('crypto');
const User = require('../models/User');

/**
 * Generate a custom UID of 6 hexadecimal characters.
 * If necessary, the function ensures the UID is unique in the database.
 *
 * @returns {Promise<string>} A unique custom UID.
 */
async function generateCustomUID() {
    let customUID;
    let isUnique = false;

    while (!isUnique) {
        customUID = crypto.randomBytes(3).toString('hex'); // Generate a 6-digit hex UID
        const existingUID = await User.findOne({ _id: customUID });
        if (!existingUID) isUnique = true;
    }

    return customUID;
}

module.exports = generateCustomUID;