const pool = require('../config/database');

/**
 * Haalt alle films (films) op uit de database.
 */
function getAllMovies(callback) {
    // We selecteren alleen de kolommen die we nodig hebben.
    // 'LIMIT 20' is een goede gewoonte om te voorkomen dat je per ongeluk duizenden rijen ophaalt.
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