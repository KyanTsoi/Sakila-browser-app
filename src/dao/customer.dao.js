const pool = require('../database/database');

function findCustomerById(id, callback) {
    const query = 'SELECT customer_id, first_name, last_name, email FROM customer WHERE customer_id = ?';
    pool.query(query, [id], (error, results) => {
        if (error) return callback(error, null);
        callback(null, results[0] || null);
    });
}

function findCustomerByEmail(email, callback) {
    const query = 'SELECT * FROM customer WHERE email = ?';
    pool.query(query, [email], (error, results) => {
        if (error) return callback(error, null);
        callback(null, results[0] || null);
    });
}

function createCustomer(customerData, callback) {
    // De query is aangepast om 'create_date' mee te sturen
    const query = 'INSERT INTO customer (store_id, first_name, last_name, email, password, address_id, create_date) VALUES (?, ?, ?, ?, ?, ?, NOW())';
    const params = [
        1, // vaste store_id
        customerData.firstName,
        customerData.lastName,
        customerData.email,
        customerData.hashedPassword,
        1 // vaste address_id
    ];
    pool.query(query, params, (error, results) => {
        if (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return callback(new Error('An account with this email already exists.'), null);
            }
            return callback(error, null);
        }
        callback(null, results.insertId);
    });
}

function updateCustomer(customerId, customerData, callback) {
    const query = 'UPDATE customer SET first_name = ?, last_name = ?, email = ? WHERE customer_id = ?';
    const params = [
        customerData.firstName,
        customerData.lastName,
        customerData.email,
        customerId
    ];
    pool.query(query, params, (error, results) => {
        if (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return callback(new Error('An account with this email already exists.'), null);
            }
            return callback(error, null);
        }
        callback(null, results);
    });
}

function countFavoriteMovies(customerId, callback) {
    const query = 'SELECT COUNT(*) AS total FROM customer_favorites WHERE customer_id = ?';
    pool.query(query, [customerId], (error, results) => {
        if (error) return callback(error, null);
        callback(null, results[0].total);
    });
}

function getFavoriteMovies(customerId, limit, offset, callback) {
    const query = `
        SELECT f.film_id, f.title, f.description, f.release_year 
        FROM film f
        JOIN customer_favorites cf ON f.film_id = cf.film_id
        WHERE cf.customer_id = ?
        ORDER BY cf.created_at DESC
        LIMIT ? OFFSET ?
    `;
    pool.query(query, [customerId, limit, offset], (error, results) => {
        if (error) return callback(error, null);
        callback(null, results);
    });
}

function isMovieInFavorites(customerId, filmId, callback) {
    const query = 'SELECT * FROM customer_favorites WHERE customer_id = ? AND film_id = ?';
    pool.query(query, [customerId, filmId], (error, results) => {
        if (error) return callback(error, null);
        callback(null, results.length > 0);
    });
}

function addFavoriteMovie(customerId, filmId, callback) {
    const query = 'INSERT INTO customer_favorites (customer_id, film_id) VALUES (?, ?)';
    pool.query(query, [customerId, filmId], (error, results) => {
        if (error) return callback(error);
        callback(null, results);
    });
}

function removeFavoriteMovie(customerId, filmId, callback) {
    const query = 'DELETE FROM customer_favorites WHERE customer_id = ? AND film_id = ?';
    pool.query(query, [customerId, filmId], (error, results) => {
        if (error) return callback(error);
        callback(null, results);
    });
}

function deleteCustomerById(id, callback) {
    // We moeten gerelateerde data in de juiste volgorde verwijderen
    // om foreign key errors te voorkomen.

    // Stap 1: Verwijder favorieten
    pool.query('DELETE FROM customer_favorites WHERE customer_id = ?', [id], (err1) => {
        if (err1) return callback(err1);

        // Stap 2: Verwijder betalingen
        pool.query('DELETE FROM payment WHERE customer_id = ?', [id], (err2) => {
            if (err2) return callback(err2);

            // Stap 3: Verwijder huurgeschiedenis
            pool.query('DELETE FROM rental WHERE customer_id = ?', [id], (err3) => {
                if (err3) return callback(err3);

                // Stap 4: Verwijder de klant zelf
                pool.query('DELETE FROM customer WHERE customer_id = ?', [id], (err4, results) => {
                    if (err4) return callback(err4);
                    callback(null, results);
                });
            });
        });
    });
}

module.exports = { 
    findCustomerById,
    findCustomerByEmail,
    createCustomer,
    updateCustomer,
    getFavoriteMovies,
    isMovieInFavorites,
    addFavoriteMovie,
    removeFavoriteMovie,
    countFavoriteMovies,
    deleteCustomerById
};