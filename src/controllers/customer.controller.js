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

        // Haal eventuele succes- of foutberichten op uit de sessie
        const successMessage = req.session.success_message;
        const errorMessage = req.session.error_message;

        // Verwijder de berichten direct, zodat ze maar één keer worden getoond
        delete req.session.success_message;
        delete req.session.error_message;

        const model = {
            title: 'My Profile',
            customer: customer,
            success: successMessage,
            error: errorMessage
        };
        res.render('customer/profile', model);
    });
}


function updateProfile(req, res, next) {
    if (!req.session.customer) {
        return res.redirect('/login');
    }

    const customerId = req.session.customer.customer_id;
    const customerData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
    };

    customerService.updateCustomer(customerId, customerData, (err, result) => {
        // Dit is het basis model dat we gebruiken om de pagina opnieuw te renderen.
        // We vullen het formulier opnieuw met de zojuist ingevulde data.
        const model = {
            title: 'My Profile',
            customer: {
                customer_id: customerId,
                first_name: customerData.firstName,
                last_name: customerData.lastName,
                email: customerData.email
            }
        };

        if (err) {
            // Als de query mislukt (bv. e-mailadres bestaat al), voeg een foutmelding toe aan het model.
            if (err.message.includes('already exists')) {
                model.error = 'Failed to update: an account with this email already exists.';
                return res.render('customer/profile', model);
            }
            // Voor andere, onverwachte fouten, ga naar de algemene foutafhandeling.
            return next(err);
        }

        // Als de update succesvol was, werk de sessie bij.
        req.session.customer.first_name = customerData.firstName;
        req.session.customer.last_name = customerData.lastName;
        req.session.customer.email = customerData.email;

        // Voeg een succesbericht toe aan het model.
        model.success = 'Profile successfully updated!';
        
        // Render de profielpagina opnieuw met het succesbericht.
        res.render('customer/profile', model);
    });
}

function deleteProfile(req, res, next) {
    if (!req.session.customer) {
        return res.redirect('/login');
    }
    const customerId = req.session.customer.customer_id;
    customerService.deleteCustomer(customerId, (err, result) => {
        if (err) {
            return next(err);
        }
        req.session.destroy(err => {
            if (err) {
                return next(err);
            }
            res.redirect('/');
        });
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
    updateProfile,
    deleteProfile
};