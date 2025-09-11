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

function showCreateMovieForm(req, res, next) {
    movieService.getAllLanguages((err, languages) => {
        if (err) {
            return next(err);
        }
        res.render("movie/create", { 
            title: "Nieuwe Film Toevoegen",
            languages: languages // Geef de talenlijst door aan de view
        });
    });
}

function createMovie(req, res, next) {
    // SPION 1: Wordt deze functie überhaupt aangeroepen?
    logger.debug("createMovie controller-functie is aangeroepen.");

    // SPION 2: Wat zit er in de formulierdata (req.body)?
    const movieData = req.body;
    logger.debug("Ontvangen formulierdata:", movieData);

    // Controleer of de data wel binnenkomt
    if (!movieData.title) {
        logger.error("Fout: Titel ontbreekt in de formulierdata.");
        return next(new Error("De titel is een verplicht veld."));
    }

    movieService.createMovie(movieData, (err, insertId) => {
        // SPION 3: Is er een fout vanuit de service/database?
        if (err) {
            logger.error('Fout ontvangen van de movieService:', err.message);
            return next(err);
        }

        // SPION 4: Wat is de ID van de nieuwe film?
        logger.debug(`Film succesvol aangemaakt met ID: ${insertId}`);
        
        // Als alles goed is, stuur door
        res.redirect(`/movies/${insertId}`);
    });
}





module.exports = { 
    getAllMovies,
    getMovieById,
    createMovie,
    showCreateMovieForm
};