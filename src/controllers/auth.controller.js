const customerService = require('../services/customer.service');

function showLoginForm(req, res) {
    res.render('auth/login', { title: 'Login' });
}

function loginUser(req, res, next) {
    const { email, password } = req.body;
    customerService.authenticateCustomer(email, password, (err, customer) => {
        if (err) {
            return next(err);
        }
        if (!customer) {
            const model = {
                title: 'Login',
                error: 'Wrong login credentials, please try again.',    
                email: email // Behoud het ingevoerde e-mailadres
            };
            return res.render('auth/login', model);
        }
        
        // CRUCIAAL: Sla het klantobject op in de sessie
        req.session.customer = customer;
        
        res.redirect('/');
    });
}

function logoutUser(req, res) {
    req.session.destroy(err => {
        if (err) {
            console.error("Error with logging in:", err);
        }
        res.redirect('/');
    });
}

module.exports = { showLoginForm, loginUser, logoutUser };