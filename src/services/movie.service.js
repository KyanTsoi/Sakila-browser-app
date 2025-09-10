const movieDAO = require('../dao/movie.dao');

const MOVIES_PER_PAGE = 20; // Stel het maximum aantal films per pagina in

/**
 * Haalt alle benodigde data op voor de film-paginering.
 */
function getPaginatedMovies(page, callback) {
    const offset = (page - 1) * MOVIES_PER_PAGE;

    // Haal eerst het totale aantal films op
    movieDAO.countMovies((err, totalMovies) => {
        if (err) {
            return callback(err, null);
        }

        // Haal daarna de films voor de huidige pagina op
        movieDAO.getMovies(MOVIES_PER_PAGE, offset, (err, movies) => {
            if (err) {
                return callback(err, null);
            }

            const totalPages = Math.ceil(totalMovies / MOVIES_PER_PAGE);

            // Bundel alle data in één resultaatobject
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
    getMovieById
};