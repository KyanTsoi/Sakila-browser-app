const pool = require('../database/database');
const logger = require('../util/logger');
/**
 * Haalt een specifiek aantal films op voor een bepaalde pagina (met LIMIT en OFFSET).
 */
function getMovies(limit, offset, callback) {
    const query = 'SELECT film_id, title, description, release_year FROM film ORDER BY release_year DESC LIMIT ? OFFSET ?';

    pool.query(query, [limit, offset], (error, results) => {
        if (error) {
            return callback(error, null);
        }
        callback(null, results);
    });
}

/**
 * Telt het totale aantal films in de database.
 */
function countMovies(callback) {
    const query = 'SELECT COUNT(*) AS total FROM film';

    pool.query(query, (error, results) => {
        if (error) {
            return callback(error, null);
        }
        // We geven alleen het totale getal terug
        callback(null, results[0].total);
    });
}

function findMovieById(id, callback) {
    const query = `
        SELECT f.*, c.name AS category_name 
        FROM film f
        JOIN film_category fc ON f.film_id = fc.film_id
        JOIN category c ON fc.category_id = c.category_id
        WHERE f.film_id = ?`;

    pool.query(query, [id], (error, results) => {
        if (error) {
            return callback(error, null);
        }
        // Geef de eerste (en enige) gevonden film terug, of null
        callback(null, results[0] || null);
    });
}

function searchMovies(query, limit, offset, callback) {
    const sqlQuery = 'SELECT film_id, title, description, release_year FROM film WHERE title LIKE ? ORDER BY release_year DESC LIMIT ? OFFSET ?';
    // De '%' tekens zorgen ervoor dat we zoeken naar titels die de query bevatten.
    const searchQuery = `%${query}%`; 

    pool.query(sqlQuery, [searchQuery, limit, offset], (error, results) => {
        if (error) {
            return callback(error, null);
        }
        callback(null, results);
    });
}

/**
 * Telt het totale aantal films dat overeenkomt met een zoekopdracht.
 */
function countSearchedMovies(query, callback) {
    const sqlQuery = 'SELECT COUNT(*) AS total FROM film WHERE title LIKE ?';
    const searchQuery = `%${query}%`;

    pool.query(sqlQuery, [searchQuery], (error, results) => {
        if (error) {
            return callback(error, null);
        }
        callback(null, results[0].total);
    });
}


module.exports = {
    getMovies,
    countMovies,
    findMovieById,
    searchMovies,
    countSearchedMovies
};