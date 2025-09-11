const userDAO = require('../dao/user.dao');
const bcrypt = require('bcrypt');

function getUserById(id, callback) {
    return userDAO.findUserById(id, callback);
}
function createUser(userData, callback) {
    bcrypt.hash(userData.password, saltRounds, (err, hashedPassword) => {
        if (err) {
            return callback(err, null);
        }
        const secureUserData = { ...userData, hashedPassword: hashedPassword };
        userDAO.createUser(secureUserData, callback);
    });
}
/**
 * Authenticeert een gebruiker door het wachtwoord te vergelijken.
 */
function authenticateUser(email, password, callback) {
    userDAO.findUserByEmail(email, (err, user) => {
        if (err) return callback(err);
        if (!user) return callback(null, null); // Gebruiker niet gevonden

        // Vergelijk het ingevoerde wachtwoord met de veilige hash in de database
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return callback(err);
            if (isMatch) {
                // Wachtwoorden komen overeen, geef de gebruiker terug (zonder het wachtwoord)
                const { password, ...userWithoutPassword } = user;
                return callback(null, userWithoutPassword);
            } else {
                // Wachtwoorden komen niet overeen
                return callback(null, null);
            }
        });
    });
}

// createUser functie zou hier ook moeten zijn voor registratie.

module.exports = { 
    getUserById,
    authenticateUser,
    createUser
};
