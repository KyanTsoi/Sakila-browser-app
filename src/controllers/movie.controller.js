const movieService = require("../services/movie.service");
const customerService = require("../services/customer.service");
const logger = require("../util/logger");

function getAllMovies(req, res, next) {
    const page = parseInt(req.query.page) || 1;
    const query = req.query.query || null;

    movieService.getPaginatedMovies(page, query, (err, data) => {
        if (err) {
            logger.error('Error fetching paginated movies:', err);
            return next(err);
        }
        
        const title = query 
            ? `Search results for "${query}" (Page ${page})` 
            : `Movies (Page ${page})`;

        // Bepaal de basis-URL voor de paginering
        const baseUrl = query ? `/movies?query=${encodeURIComponent(query)}` : '/movies';

        const model = { 
            title: title, 
            movies: data.movies,
            pagination: data.pagination,
            query: query,
            baseUrl: baseUrl // Geef de baseUrl door aan de view
        };
        res.render("movies", model);
    });
}


function getMovieById(req, res, next) {
    const movieId = req.params.id;
    const customerId = req.session.customer ? req.session.customer.customer_id : null;
    const backUrl = req.header('Referer') || '/movies';
    // Service stuurt nu een object { movie, relatedMovies }
    movieService.getMovieById(movieId, (err, data) => {
        if (err) {
            logger.error('Error fetching movie by ID:', err);
            return next(err);
        }
        if (!data || !data.movie) {
            return next({ status: 404, message: 'Movie not found' });
        }
        
        // Haal de data uit het object
        const { movie, relatedMovies } = data;

        if (!customerId) {
            const model = { 
                title: movie.title, 
                movie: movie, 
                isFavorite: false,
                relatedMovies: relatedMovies,
                backUrl: backUrl
            };
            return res.render("movie/details", model);
        }

        customerService.checkIfMovieIsFavorite(customerId, movieId, (err, isFavorite) => {
            if (err) return next(err);
            const model = { 
                title: movie.title, 
                movie: movie, 
                isFavorite: isFavorite,
                relatedMovies: relatedMovies,
                backUrl: backUrl
            };
            res.render("movie/details", model);
        });
    });
}

module.exports = { 
    getAllMovies,
    getMovieById
};