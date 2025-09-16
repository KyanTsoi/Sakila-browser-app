const customerDAO = require('../dao/customer.dao');
const bcrypt = require('bcrypt');
const logger = require('../util/logger');

const saltRounds = 10;
const MOVIES_PER_PAGE = 20;

function getCustomerById(id, callback) {
    return customerDAO.findCustomerById(id, callback);
}

function createCustomer(customerData, callback) {
    bcrypt.hash(customerData.password, saltRounds, (err, hashedPassword) => {
        if (err) return callback(err, null);
        const secureCustomerData = { ...customerData, hashedPassword: hashedPassword };
        customerDAO.createCustomer(secureCustomerData, callback);
    });
}

function authenticateCustomer(email, password, callback) {
    customerDAO.findCustomerByEmail(email, (err, customer) => {
        if (err) return callback(err);

        // --- DEBUG LOG ---
        if (!customer) {
            logger.debug(`[AUTH] No customer found with email: ${email}`);
            return callback(null, null);
        }
        // --- EINDE DEBUG LOG ---

        bcrypt.compare(password, customer.password, (err, isMatch) => {
            if (err) return callback(err);

            // --- DEBUG LOG ---\
            logger.debug(`[AUTH] Customer found with email: ${email}`);
            // --- EINDE DEBUG LOG ---

            if (isMatch) {
                const { password, ...customerWithoutPassword } = customer;
                return callback(null, customerWithoutPassword);
            } else {
                return callback(null, null);
            }
        });
    });
}


function getPaginatedWatchlist(customerId, page, callback) {
    const offset = (page - 1) * MOVIES_PER_PAGE;
    customerDAO.countFavoriteMovies(customerId, (err, totalMovies) => {
        if (err) return callback(err, null);
        customerDAO.getFavoriteMovies(customerId, MOVIES_PER_PAGE, offset, (err, movies) => {
            if (err) return callback(err, null);
            const totalPages = Math.ceil(totalMovies / MOVIES_PER_PAGE);
            const result = {
                movies: movies,
                pagination: { currentPage: page, totalPages: totalPages }
            };
            callback(null, result);
        });
    });
}

function checkIfMovieIsFavorite(customerId, filmId, callback) {
    return customerDAO.isMovieInFavorites(customerId, filmId, callback);
}

function addMovieToWatchlist(customerId, filmId, callback) {
    return customerDAO.addFavoriteMovie(customerId, filmId, callback);
}

function removeMovieFromWatchlist(customerId, filmId, callback) {
    return customerDAO.removeFavoriteMovie(customerId, filmId, callback);
}

module.exports = {
    getCustomerById,
    authenticateCustomer,
    createCustomer,
    getPaginatedWatchlist,
    checkIfMovieIsFavorite,
    addMovieToWatchlist,
    removeMovieFromWatchlist
};