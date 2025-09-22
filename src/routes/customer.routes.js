const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');

router.get("/watchlist", customerController.showWatchlist);
router.get("/register", customerController.showRegisterForm);
router.get("/:id", customerController.getCustomer);

router.post("/watchlist/add", customerController.addFavorite);
router.post("/watchlist/remove", customerController.removeFavorite);
router.post("/register", customerController.registerCustomer);

router.get("/profile", customerController.showProfile);
router.post("/profile/update", customerController.updateProfile);

module.exports = router;