const pool = require('../database/database');

function createUser(userData, callback) {
    const query = 'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)';
    const params = [
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.hashedPassword
    ];
    pool.query(query, params, (error, results) => {
        if (error) return callback(error, null);
        callback(null, results.insertId);
    });
}

function findUserById(id, callback) {
    const query = 'SELECT user_id, first_name, last_name, email FROM users WHERE user_id = ?';
    pool.query(query, [id], (error, results) => {
        if (error) return callback(error, null);
        callback(null, results[0] || null);
    });
}

module.exports = { createUser, findUserById };