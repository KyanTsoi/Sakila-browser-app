const crypto = require('crypto'); // Ingebouwde Node.js module voor cryptografie
const sessionStore = require('../util/session-store');

function customSession(req, res, next) {
    // 1. Lees de sessie-ID uit de cookies.
    let sessionId = req.cookies.sessionId;

    // 2. Als er geen sessie-ID is, of de ID is onbekend...
    if (!sessionId || !sessionStore[sessionId]) {
        // Maak een nieuw, uniek en willekeurig ID aan.
        sessionId = crypto.randomUUID();
        // Maak een lege "lade" voor deze nieuwe sessie in onze store.
        sessionStore[sessionId] = {};
    }

    // 3. Plaats een cookie met dit ID op de browser van de gebruiker.
    res.cookie('sessionId', sessionId, { httpOnly: true });

    // 4. Maak de sessiedata beschikbaar voor alle volgende routes via `req.session`.
    req.session = sessionStore[sessionId];
    
    // 5. Zorg ervoor dat de sessie kan worden vernietigd (voor uitloggen).
    req.session.destroy = (callback) => {
        delete sessionStore[sessionId];
        res.clearCookie('sessionId');
        if (callback) callback();
    };

    next();
}

module.exports = customSession;