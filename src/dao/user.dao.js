const pool = require('../database/database');

// NOTE: Ik ga ervan uit dat je de 'user' functionaliteit wilt en niet 'customer'.
// Zorg ervoor dat je een 'users' tabel hebt, en niet 'customers'.

function findUserById(id, callback) {
    const query = 'SELECT user_id, first_name, last_name, email FROM users WHERE user_id = ?';
    pool.query(query, [id], (error, results) => {
        if (error) return callback(error, null);
        callback(null, results[0] || null);
    });
}

/**
 * Vindt een gebruiker op basis van zijn e-mailadres.
 * We selecteren hier ook het wachtwoord, omdat we dat nodig hebben om te vergelijken.
 */
function findUserByEmail(email, callback) {
    const query = 'SELECT * FROM users WHERE email = ?';
    pool.query(query, [email], (error, results) => {
        if (error) {
            return callback(error, null);
        }
        callback(null, results[0] || null);
    });
}

// createUser functie zou hier ook moeten zijn voor registratie.
// Voor nu focussen we op inloggen.

module.exports = { 
    findUserById,
    findUserByEmail
};
