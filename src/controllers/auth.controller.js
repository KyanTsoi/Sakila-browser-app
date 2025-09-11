const userService = require('../services/user.service'); // We gebruiken de user service

/**
 * Toont de inlogpagina.
 */
function showLoginForm(req, res) {
    res.render('auth/login', { title: 'Inloggen' });
}

/**
 * Verwerkt de inlogpoging.
 */
function loginUser(req, res) {
    const { email, password } = req.body;

    userService.authenticateUser(email, password, (err, user) => {
        if (err || !user) {
            // Als inloggen mislukt, toon het formulier opnieuw met een foutmelding.
            return res.render('auth/login', { title: 'Inloggen', error: 'Ongeldige e-mail of wachtwoord.' });
        }
        
        // SUCCES! Sla de gebruiker op in de sessie.
        req.session.user = user;
        
        // Stuur de gebruiker door naar de homepagina.
        res.redirect('/');
    });
}

/**
 * Logt de gebruiker uit.
 */
function logoutUser(req, res) {
    // Vernietig de sessie.
    req.session.destroy(err => {
        if (err) {
            console.error("Fout bij uitloggen:", err);
        }
        res.redirect('/');
    });
}

module.exports = { showLoginForm, loginUser, logoutUser };
