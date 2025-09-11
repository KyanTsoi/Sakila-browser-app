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
    const query = 'SELECT * FROM film WHERE film_id = ?';

    pool.query(query, [id], (error, results) => {
        if (error) {
            return callback(error, null);
        }
        // Geef de eerste (en enige) gevonden film terug, of null
        callback(null, results[0] || null);
    });
}

function createMovie(movieData, callback) {
    const query = 'INSERT INTO film (title, description, release_year, language_id) VALUES (?, ?, ?, ?)';
    
    // De 'language_id' is verplicht in Sakila, dus we gebruiken '1' (Engels) als standaard.
    const params = [
        movieData.title,
        movieData.description,
        movieData.release_year,
        movieData.language_id
    ];

    pool.query(query, params, (error, results) => {
        if (error) {
            return callback(error, null);
        }
        // Geef de ID van de nieuwe film terug
        callback(null, results.insertId);
    });
}

function getAllLanguages(callback) {
    const query = 'SELECT language_id, name FROM language ORDER BY name';

    pool.query(query, (error, results) => {
        if (error) {
            return callback(error, null);
        }
        callback(null, results);
    });
}

module.exports = {
    getMovies,
    countMovies,
    findMovieById,
    createMovie,
    getAllLanguages
};