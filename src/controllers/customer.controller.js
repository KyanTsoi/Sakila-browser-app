const customerService = require('../services/customer.service');
const logger = require('../util/logger');

function showRegisterForm(req, res) {
    res.render("customer/register", { title: "Registering new customer" });
}

function registerCustomer(req, res, next) {
    customerService.createCustomer(req.body, (err, newCustomerId) => {
        // Als er een fout is...
        if (err) {
            // Controleer of het de specifieke foutmelding is die we willen tonen
            if (err.message.includes('already exists')) {
                const model = {
                    title: "Registering new customer",
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
            return next({ status: 404, message: 'customer not found' });
        }
        const model = {
            title: `Details for ${customer.first_name}`,
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
            title: `Favorite Movies (Page ${page})`, 
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

function showProfile(req, res, next) {
    if (!req.session.customer) {
        return res.redirect('/login');
    }
    const customerId = req.session.customer.customer_id;
    customerService.getCustomerById(customerId, (err, customer) => {
        if (err || !customer) {
            return next({ status: 404, message: 'Customer not found' });
        }
        const model = {
            title: 'My Profile',
            customer: customer
        };
        res.render('customer/profile', model);
    });
}

function updateProfile(req, res, next) {
    if (!req.session.customer) {
        return res.redirect('/login');
    }
    const customerId = req.session.customer.customer_id;
    customerService.updateCustomer(customerId, req.body, (err, result) => {
        if (err) {
            if (err.message.includes('already exists')) {
                // Herlaad de profielpagina met een foutmelding
                return customerService.getCustomerById(customerId, (fetchErr, customer) => {
                    const model = {
                        title: 'My Profile',
                        customer: customer,
                        error: err.message
                    };
                    res.render('customer/profile', model);
                });
            }
            return next(err);
        }
        // Update de sessie met de nieuwe gegevens
        req.session.customer.first_name = req.body.firstName;
        req.session.customer.last_name = req.body.lastName;
        req.session.customer.email = req.body.email;
        res.redirect('/customers/profile');
    });
}

module.exports = { 
    showRegisterForm, 
    registerCustomer, 
    getCustomer, 
    showWatchlist, 
    addFavorite, 
    removeFavorite,
    showProfile,
    updateProfile
};