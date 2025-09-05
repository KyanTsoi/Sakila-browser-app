var express = require("express");
var router = express.Router();
const movieService = require("../services/movie.service");

function GetAllMovies(req, res, next) {
    const model = { title: "Movies" };

    movieService.getMovies( (movies) => {
        // hier komt data van service terug -> model
        const model = { 
            title: "Movielist", 
            movies: movies 
        };
        const view = "movie/index";
        res.render(view, model);
    });
}

module.exports = { GetAllMovies };