const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.get("/register", userController.showRegisterForm);
router.post("/register", userController.registerUser);
router.get("/:id", userController.getUser);

module.exports = router;