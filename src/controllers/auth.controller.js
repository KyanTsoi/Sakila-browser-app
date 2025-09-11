const userService = require('../services/user.service');
const logger = require('../util/logger');

function showLoginForm(req, res) {
    res.render('auth/login', { title: 'Inloggen' });
}

function loginUser(req, res) {
    const { email, password } = req.body;

    userService.authenticateUser(email, password, (err, user) => {
        if (err || !user) {
            // Als inloggen mislukt, toon het formulier opnieuw met een foutmelding
            return res.render('auth/login', { title: 'Inloggen', error: 'Ongeldige e-mail of wachtwoord.' });
        }
        
        // SUCCES! Sla de gebruiker op in de sessie
        req.session.user = user;
        
        // Stuur de gebruiker door naar de homepagina
        res.redirect('/');
    });
}

function logoutUser(req, res) {
    // Vernietig de sessie
    req.session.destroy(err => {
        if (err) {
            logger.error("Fout bij uitloggen:", err);
        }
        // Stuur de gebruiker door naar de homepagina
        res.redirect('/');
    });
}

module.exports = { showLoginForm, loginUser, logoutUser };