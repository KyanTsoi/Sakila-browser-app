const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// GET /login -> Toont de inlogpagina
router.get('/login', authController.showLoginForm);

// POST /login -> Verwerkt de inlogpoging
router.post('/login', authController.loginUser);

// POST /logout -> Logt de gebruiker uit
router.post('/logout', authController.logoutUser);

module.exports = router;
