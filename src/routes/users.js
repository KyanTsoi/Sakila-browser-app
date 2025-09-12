const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.get("/watchlist", userController.showWatchlist);
router.get("/register", userController.showRegisterForm);
router.get("/:id", userController.getUser);

router.post("/watchlist/add", userController.addFavorite);
router.post("/watchlist/remove", userController.removeFavorite);

router.post("/register", userController.registerUser);

module.exports = router;