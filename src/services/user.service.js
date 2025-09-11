const userDAO = require('../dao/user.dao');
const bcrypt = require('bcrypt');
const saltRounds = 10;

function createUser(userData, callback) {
    bcrypt.hash(userData.password, saltRounds, (err, hashedPassword) => {
        if (err) return callback(err, null);
        const secureUserData = { ...userData, hashedPassword: hashedPassword };
        userDAO.createUser(secureUserData, callback);
    });
}

function getUserById(id, callback) {
    return userDAO.findUserById(id, callback);
}

module.exports = { createUser, getUserById };