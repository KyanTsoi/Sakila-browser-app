const userService = require('../services/user.service');

function showRegisterForm(req, res) {
    res.render("user/register", { title: "Nieuwe Gebruiker Registreren" });
}

function registerUser(req, res, next) {
    userService.createUser(req.body, (err, newUserId) => {
        if (err) return next(err);
        // De 'redirect' is hier aangepast van "/user/" naar "/users/"
        res.redirect(`/users/${newUserId}`);
    });
}

function getUser(req, res, next) {
    const userId = req.params.id;
    userService.getUserById(userId, (err, user) => {
        if (err || !user) {
            return next({ status: 404, message: 'Gebruiker niet gevonden' });
        }
        
        // Maak het model aan voor de view
        const model = {
            title: `Details voor ${user.first_name}`,
            user: {
                id: user.user_id,
                // Combineer voor- en achternaam voor weergave
                name: `${user.first_name} ${user.last_name}`
            }
        };
        res.render("user/details", model);
    });
}

function showWatchlist(req, res, next) {
    if (!req.session.user) return res.redirect('/login');

    const page = parseInt(req.query.page) || 1;
    const userId = req.session.user.user_id;

    userService.getPaginatedWatchlist(userId, page, (err, data) => {
        if (err) return next(err);

        const model = { 
            title: `Favoriete Films (Pagina ${page})`, 
            movies: data.movies,
            pagination: data.pagination,
            baseUrl: '/users/watchlist' // BaseUrl voor de paginatie links
        };
        res.render('movies', model); 
    });
}

function addFavorite(req, res, next) {
    if (!req.session.user) return res.redirect('/login');
    const userId = req.session.user.user_id;
    const filmId = req.body.filmId;
    userService.addMovieToWatchlist(userId, filmId, (err) => {
        if (err) return next(err);
        res.redirect('back'); // Stuurt gebruiker terug naar vorige pagina
    });
}

function removeFavorite(req, res, next) {
    if (!req.session.user) return res.redirect('/login');
    const userId = req.session.user.user_id;
    const filmId = req.body.filmId;
    userService.removeMovieFromWatchlist(userId, filmId, (err) => {
        if (err) return next(err);
        res.redirect('back'); // Stuurt gebruiker terug naar vorige pagina
    });
}


module.exports = { 
    showRegisterForm, 
    registerUser, 
    getUser, 
    showWatchlist,
    addFavorite,
    removeFavorite
 };