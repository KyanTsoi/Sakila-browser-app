const customerService = require('../services/customer.service');
const logger = require('../util/logger');

function showRegisterForm(req, res) {
    res.render("customer/register", { title: "Nieuwe Klant Registreren" });
}

function registerCustomer(req, res, next) {
    customerService.createCustomer(req.body, (err, newCustomerId) => {
        // Als er een fout is...
        if (err) {
            // Controleer of het de specifieke foutmelding is die we willen tonen
            if (err.message.includes('bestaat al')) {
                const model = {
                    title: "Nieuwe Klant Registreren",
                    error: err.message,
                    // Stuur de ingevulde data terug, zodat de gebruiker het niet opnieuw hoeft in te vullen
                    formData: req.body 
                };
                // Toon het registratieformulier opnieuw met de foutmelding
                return res.render('customer/register', model);
            }
            // Voor alle andere, onverwachte fouten, ga naar de algemene foutpagina
            return next(err);
        }
        // Als het succesvol was, stuur door naar de detailpagina
        res.redirect(`/`);
    });
}

function getCustomer(req, res, next) {
    const customerId = req.params.id;
    customerService.getCustomerById(customerId, (err, customer) => {
        if (err || !customer) {
            return next({ status: 404, message: 'Klant niet gevonden' });
        }
        const model = {
            title: `Details voor ${customer.first_name}`,
            customer: { id: customer.customer_id, name: `${customer.first_name} ${customer.last_name}` }
        };
        res.render("customer/details", model);
    });
}

function showWatchlist(req, res, next) {
    if (!req.session.customer) {
        return res.redirect('/login');
    }
    const page = parseInt(req.query.page) || 1;
    const customerId = req.session.customer.customer_id;
    customerService.getPaginatedWatchlist(customerId, page, (err, data) => {
        if (err) {
            return next(err);
        }
        const model = { 
            title: `Favoriete Films (Pagina ${page})`, 
            movies: data.movies,
            pagination: data.pagination,
            baseUrl: '/customers/watchlist'
        };
        res.render('movies', model); 
    });
}

function addFavorite(req, res, next) {
    if (!req.session.customer) return res.redirect('/login');
    const customerId = req.session.customer.customer_id;
    const filmId = req.body.filmId;
    customerService.addMovieToWatchlist(customerId, filmId, (err) => {
        if (err) return next(err);
        // Gebruik de nieuwe, aanbevolen methode voor redirect
        const backURL = req.header('Referer') || '/';
        res.redirect(backURL);
    });
}

function removeFavorite(req, res, next) {
    if (!req.session.customer) return res.redirect('/login');
    const customerId = req.session.customer.customer_id;
    const filmId = req.body.filmId;
    customerService.removeMovieFromWatchlist(customerId, filmId, (err) => {
        if (err) return next(err);
        // Gebruik de nieuwe, aanbevolen methode voor redirect
        const backURL = req.header('Referer') || '/';
        res.redirect(backURL);
    });
}



module.exports = { 
    showRegisterForm, 
    registerCustomer, 
    getCustomer, 
    showWatchlist, 
    addFavorite, 
    removeFavorite 
};