// Importeer de nieuwe DAO
const movieDAO = require('../dao/movie.dao');

/**
 * De service-laag voor films.
 */
function getMovies(callback) {
    // Roep de DAO aan om de films op te halen
    movieDAO.getAllMovies((err, movies) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, movies);
    });
}

module.exports = {
    getMovies
};