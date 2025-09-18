const movieDAO = require('../dao/movie.dao');

const MOVIES_PER_PAGE = 20; // Stel het maximum aantal films per pagina in

/**
 * Haalt alle benodigde data op voor de film-paginering.
 */
function getPaginatedMovies(page, query, callback) {
    const offset = (page - 1) * MOVIES_PER_PAGE;

    // Kies welke DAO-functie we gebruiken om het totaal te tellen
    const countFunction = query 
        ? (cb) => movieDAO.countSearchedMovies(query, cb)
        : movieDAO.countMovies;

    // Kies welke DAO-functie we gebruiken om de films op te halen
    const getFunction = query 
        ? (limit, offset, cb) => movieDAO.searchMovies(query, limit, offset, cb)
        : movieDAO.getMovies;

    // Haal eerst het totale aantal films op
    countFunction((err, totalMovies) => {
        if (err) {
            return callback(err, null);
        }

        // Haal daarna de films voor de huidige pagina op
        getFunction(MOVIES_PER_PAGE, offset, (err, movies) => {
            if (err) {
                return callback(err, null);
            }

            const totalPages = Math.ceil(totalMovies / MOVIES_PER_PAGE);

            const result = {
                movies: movies,
                pagination: {
                    currentPage: page,
                    totalPages: totalPages
                }
            };

            callback(null, result);
        });
    });
}


function getMovieById(id, callback) {
    movieDAO.findMovieById(id, (err, movie) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, movie);
    });
}


module.exports = {
    getPaginatedMovies,
    getMovieById,
};