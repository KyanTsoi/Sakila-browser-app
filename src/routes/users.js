const express = require('express');
const router = express.Router();
const mw = require('../middleware/auth.js');
const userController = require('../controllers/user.controller');

router.get('/user/:id', mw.authenticate, userController.getUser);

module.exports = router;