/**
 * Dit is een placeholder authenticatie middleware.
 * Het doet geen echte controle, maar geeft het verzoek altijd door.
 */
function authenticate(req, res, next) {
    // Log een bericht om te zien dat de middleware wordt aangeroepen.
    console.log('Authenticatie middleware werd uitgevoerd... en goedgekeurd!');

    // Roep next() aan om door te gaan naar de volgende functie (de controller).
    next();
}

// Exporteer de functie zodat andere bestanden deze kunnen gebruiken.
module.exports = {
    authenticate
};