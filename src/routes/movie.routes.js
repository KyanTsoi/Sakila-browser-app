var express = require("express");
var router = express.Router();

const movieController = require("../controllers/movie.controller");

// get home page

router.get("/", movieController.GetAllMovies);

module.exports = router;