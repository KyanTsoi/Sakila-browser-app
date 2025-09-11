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

function createUser(userData, callback) {
    const query = 'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)';
    const params = [
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.hashedPassword // Ontvangt het al gehashte wachtwoord van de service
    ];
    pool.query(query, params, (error, results) => {
        if (error) {
            // Als de e-mail al bestaat, geeft de database een 'ER_DUP_ENTRY' fout
            if (error.code === 'ER_DUP_ENTRY') {
                return callback(new Error('Een account met dit e-mailadres bestaat al.'), null);
            }
            return callback(error, null);
        }
        callback(null, results.insertId);
    });
}

module.exports = { 
    findUserById,
    findUserByEmail,
    createUser
};
