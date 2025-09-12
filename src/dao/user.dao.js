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
function getFavoriteMovies(userId, limit, offset, callback) {
    const query = `
        SELECT f.film_id, f.title, f.description, f.release_year 
        FROM film f
        JOIN user_favorites uf ON f.film_id = uf.film_id
        WHERE uf.user_id = ?
        ORDER BY uf.created_at DESC
        LIMIT ? OFFSET ?
    `;
    pool.query(query, [userId, limit, offset], (error, results) => {
        if (error) return callback(error, null);
        callback(null, results);
    });
}

function isMovieInFavorites(userId, filmId, callback) {
    const query = 'SELECT * FROM user_favorites WHERE user_id = ? AND film_id = ?';
    pool.query(query, [userId, filmId], (error, results) => {
        if (error) return callback(error, null);
        callback(null, results.length > 0);
    });
}

function addFavoriteMovie(userId, filmId, callback) {
    const query = 'INSERT INTO user_favorites (user_id, film_id) VALUES (?, ?)';
    pool.query(query, [userId, filmId], (error, results) => {
        if (error) return callback(error);
        callback(null, results);
    });
}

function removeFavoriteMovie(userId, filmId, callback) {
    const query = 'DELETE FROM user_favorites WHERE user_id = ? AND film_id = ?';
    pool.query(query, [userId, filmId], (error, results) => {
        if (error) return callback(error);
        callback(null, results);
    });
}

function countFavoriteMovies(userId, callback) {
    const query = 'SELECT COUNT(*) AS total FROM user_favorites WHERE user_id = ?';
    pool.query(query, [userId], (error, results) => {
        if (error) {
            return callback(error, null);
        }
        callback(null, results[0].total);
    });
}


module.exports = { 
    findUserById,
    findUserByEmail,
    createUser,
    getFavoriteMovies,
    isMovieInFavorites,
    addFavoriteMovie,
    removeFavoriteMovie,
    countFavoriteMovies
};
