const crypto = require('crypto');

// Hash configuration parameters (can be moved to config)
const hashConfig = {
    algorithm: 'scrypt',
    base64_signer_key: 'Jdx+m5/VW8Anh7jSTuSHAkfVXIpa/DqZyrG2Vg3gD+x/LPK+MCavvs7jXMLNpHjZzlyNFUPl5n5qM4ZlsRkezg==',
    base64_salt_separator: 'Bw==',
    rounds: 8,
    mem_cost: 14
};

// Function to encrypt (hash) the password
function encryptPassword(password) {
    return new Promise((resolve, reject) => {
        // Salt separator (decoded)
        const saltSeparator = Buffer.from(hashConfig.base64_salt_separator, 'base64');

        // Generate a random salt
        const salt = crypto.randomBytes(16);

        // Hash the password using SCRYPT
        crypto.scrypt(password, Buffer.concat([salt, saltSeparator]), 64, {
            N: 2 ** hashConfig.mem_cost,  // Memory cost (2^14)
            r: hashConfig.rounds,
            p: 1,  // Parallelization factor
        }, (err, derivedKey) => {
            if (err) reject(err);
            // Return the hashed password and salt as base64
            resolve({
                hashedPassword: derivedKey.toString('base64'),
                salt: salt.toString('base64')
            });
        });
    });
}

// Function to verify the password
function verifyPassword(enteredPassword, storedSalt, storedHash) {
    return new Promise((resolve, reject) => {
        // Salt separator (decoded)
        const saltSeparator = Buffer.from(hashConfig.base64_salt_separator, 'base64');

        // Decode the stored salt
        const salt = Buffer.from(storedSalt, 'base64');

        // Hash the entered password with the stored salt
        crypto.scrypt(enteredPassword, Buffer.concat([salt, saltSeparator]), 64, {
            N: 2 ** hashConfig.mem_cost,
            r: hashConfig.rounds,
            p: 1,
        }, (err, derivedKey) => {
            if (err) reject(err);
            // Compare the derived key with the stored hash
            if (derivedKey.toString('base64') === storedHash) {
                resolve(true); // Passwords match
            } else {
                resolve(false); // Passwords don't match
            }
        });
    });
}

module.exports = {
    encryptPassword,
    verifyPassword
};

