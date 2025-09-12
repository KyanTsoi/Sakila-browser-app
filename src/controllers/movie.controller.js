const movieService = require("../services/movie.service");
const userService = require("../services/user.service");
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
            baseUrl: '/movies' // BaseUrl voor de paginatie links
        };
        res.render("movies", model);
    });
}

function getMovieById(req, res, next) {
    const movieId = req.params.id;
    const userId = req.session.user ? req.session.user.user_id : null;

    movieService.getMovieById(movieId, (err, movie) => {
        if (err) {
            logger.error(`Fout bij ophalen film ${movieId}:`, err.message);
            return next(err);
        }
        if (!movie) {
            return next({ status: 404, message: 'Film niet gevonden' });
        }

        // Als gebruiker niet is ingelogd, is de film nooit favoriet
        if (!userId) {
            const model = { title: movie.title, movie: movie, isFavorite: false };
            return res.render("movie/details", model);
        }

        // Controleer of de film favoriet is voor de ingelogde gebruiker
        userService.checkIfMovieIsFavorite(userId, movieId, (err, isFavorite) => {
            if (err) return next(err);

            const model = {
                title: movie.title,
                movie: movie,
                isFavorite: isFavorite
            };
            res.render("movie/details", model);
        });
    });
}


module.exports = { 
    getAllMovies,
    getMovieById
};


