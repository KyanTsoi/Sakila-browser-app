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

module.exports = { showRegisterForm, registerUser, getUser };