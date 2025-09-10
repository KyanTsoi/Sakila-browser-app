// Simuleert database-interactie
function findUserById(id, callback) {
  // Simulatie van een database call
  setTimeout(() => {
    const users = [
      { id: '1', name: 'Mees van Dam' },
      { id: '2', name: 'Anna de Vries' }
    ];

    const user = users.find(u => u.id === id);

    if (!user) {
      return callback(new Error('Gebruiker niet gevonden'), null);
    }

    callback(null, user);
  }, 500);
}

module.exports = { findUserById };