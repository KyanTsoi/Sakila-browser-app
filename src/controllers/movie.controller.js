var express = require("express");
var router = express.Router();
const movieService = require("../services/movie.service");

function GetAllMovies(req, res, next) {
    const model = { title: "Movies" };

    movieService.getMovies((err, movies) => {

         if (err) {
            console.error('Fout bij het ophalen van films:', err);
            return next(err); // Stuur de fout door naar de error handler
        }
        const model = { 
            title: "Movielist", 
            movies: movies 
        };
        const view = "movies";
        res.render(view, model);
    });
}

module.exports = { GetAllMovies };