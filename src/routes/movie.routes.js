var express = require("express");
var router = express.Router();
const movieController = require("../controllers/movie.controller");

// Route voor de lijst met alle films (bestaand)
router.get("/", movieController.getAllMovies);

// NIEUW: Route voor één specifieke film
router.get("/:id", movieController.getMovieById);

module.exports = router;