const pool = require('../database/database');

function getAllMovies(callback) {
    const query = 'SELECT film_id, title, description, release_year FROM film LIMIT 20';

    pool.query(query, (error, results) => {
        if (error) {
            return callback(error, null);
        }
        // Geef de array met resultaten direct terug.
        callback(null, results);
    });
}

module.exports = {
    getAllMovies
};