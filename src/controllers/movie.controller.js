const movieService = require("../services/movie.service");
const customerService = require("../services/customer.service");
const logger = require("../util/logger");

function getAllMovies(req, res, next) {
    const page = parseInt(req.query.page) || 1;
    movieService.getPaginatedMovies(page, (err, data) => {
        if (err) {
            logger.error('Fout bij het ophalen van gepagineerde films:', err);
            return next(err);
        }
        const model = { 
            title: `Films (Pagina ${page})`, 
            movies: data.movies,
            pagination: data.pagination,
            baseUrl: '/movies'
        };
        res.render("movies", model);
    });
}

function getMovieById(req, res, next) {
    const movieId = req.params.id;
    const customerId = req.session.customer ? req.session.customer.customer_id : null;
    movieService.getMovieById(movieId, (err, movie) => {
        if (err) {
            logger.error(`Fout bij ophalen film ${movieId}:`, err.message);
            return next(err);
        }
        if (!movie) {
            return next({ status: 404, message: 'Film niet gevonden' });
        }
        if (!customerId) {
            const model = { title: movie.title, movie: movie, isFavorite: false };
            return res.render("movie/details", model);
        }
        customerService.checkIfMovieIsFavorite(customerId, movieId, (err, isFavorite) => {
            if (err) return next(err);
            const model = { title: movie.title, movie: movie, isFavorite: isFavorite };
            res.render("movie/details", model);
        });
    });
}

module.exports = { 
    getAllMovies,
    getMovieById
};