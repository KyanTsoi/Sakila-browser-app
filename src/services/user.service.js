const userDAO = require('../dao/user.dao');
const bcrypt = require('bcrypt');

const saltRounds = 10; // wachtwoord hash complexiteit
const MOVIES_PER_PAGE = 20; // Aantal films per pagina voor de watchlist

function getUserById(id, callback) {
    return userDAO.findUserById(id, callback);
}

function createUser(userData, callback) {
    bcrypt.hash(userData.password, saltRounds, (err, hashedPassword) => {
        if (err) {
            return callback(err, null);
        }
        const secureUserData = { ...userData, hashedPassword: hashedPassword };
        userDAO.createUser(secureUserData, callback);
    });
}

/**
 * Authenticeert een gebruiker door het wachtwoord te vergelijken.
 */
function authenticateUser(email, password, callback) {
    userDAO.findUserByEmail(email, (err, user) => {
        if (err) return callback(err);
        if (!user) return callback(null, null); // Gebruiker niet gevonden

        // Vergelijk het ingevoerde wachtwoord met de veilige hash in de database
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return callback(err);
            if (isMatch) {
                // Wachtwoorden komen overeen, geef de gebruiker terug (zonder het wachtwoord)
                const { password, ...userWithoutPassword } = user;
                return callback(null, userWithoutPassword);
            } else {
                // Wachtwoorden komen niet overeen
                return callback(null, null);
            }
        });
    });
}

function getPaginatedWatchlist(userId, page, callback) {
    const offset = (page - 1) * MOVIES_PER_PAGE;

    userDAO.countFavoriteMovies(userId, (err, totalMovies) => {
        if (err) {
            return callback(err, null);
        }

        userDAO.getFavoriteMovies(userId, MOVIES_PER_PAGE, offset, (err, movies) => {
            if (err) {
                return callback(err, null);
            }

            const totalPages = Math.ceil(totalMovies / MOVIES_PER_PAGE);

            const result = {
                movies: movies,
                pagination: {
                    currentPage: page,
                    totalPages: totalPages
                }
            };
            callback(null, result);
        });
    });
}


function checkIfMovieIsFavorite(userId, filmId, callback) {
    return userDAO.isMovieInFavorites(userId, filmId, callback);
}

function addMovieToWatchlist(userId, filmId, callback) {
    return userDAO.addFavoriteMovie(userId, filmId, callback);
}

function removeMovieFromWatchlist(userId, filmId, callback) {
    return userDAO.removeFavoriteMovie(userId, filmId, callback);
}

module.exports = {
    getUserById,
    authenticateUser,
    createUser,
    getPaginatedWatchlist,
    checkIfMovieIsFavorite,
    addMovieToWatchlist,
    removeMovieFromWatchlist
};