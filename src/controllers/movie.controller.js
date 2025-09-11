const movieService = require("../services/movie.service");
const logger = require("../util/logger");

function getAllMovies(req, res, next) {
    // Haal het paginanummer uit de URL, met 1 als standaardwaarde.
    const page = parseInt(req.query.page) || 1;

    movieService.getPaginatedMovies(page, (err, data) => {
        if (err) {
            logger.error('Fout bij het ophalen van gepagineerde films:', err);
            return next(err);
        }

        const model = { 
            title: `Films (Pagina ${page})`, 
            movies: data.movies,
            pagination: data.pagination // Geef het nieuwe pagination-object door
        };
        
        res.render("movies", model);
    });
}

function getMovieById(req, res, next) {
    const movieId = req.params.id;

    movieService.getMovieById(movieId, (err, movie) => {
        if (err) {
            logger.error(`Fout bij ophalen film ${movieId}:`, err.message);
            return next(err);
        }
        // Als de film niet gevonden is, maak een 404-fout
        if (!movie) {
            return next({ status: 404, message: 'Film niet gevonden' });
        }

        const model = {
            title: movie.title,
            movie: movie
        };
        
        res.render("movie/details", model);
    });
}


module.exports = { 
    getAllMovies,
    getMovieById
};