describe('Profile Management Flow', () => {

  it('should successfully update user information', () => {
    // Stap 1: Log in als de hoofd testgebruiker
    cy.visit('/login');
    cy.get('#email').type(Cypress.env('TEST_USER_EMAIL'));
    cy.get('#password').type(Cypress.env('TEST_USER_PASSWORD'));
    cy.get('button[type="submit"]').click();
    
    // Stap 2: Ga naar de profielpagina en wijzig de data
    cy.visit('/customers/profile');
    const newFirstName = `UpdatedName${Date.now()}`;
    cy.get('#firstName').clear().type(newFirstName);
    cy.get('button[type="submit"]').contains('Update Profile').click();

    // Stap 3: Controleer de resultaten
    cy.get('.alert-success').should('be.visible').and('contain', 'Profile successfully updated!');
    cy.get('#firstName').should('have.value', newFirstName);
    cy.get('#sidebar-toggle-button').click();
    cy.get('#sidebarMenu').should('contain', `Welcome, ${newFirstName}`);
  });

  it('should show an error when trying to update to a duplicate email', () => {
    const duplicateEmail = `existing-user-${Date.now()}@example.com`;

    // Stap 1: Maak een nieuwe gebruiker aan om te garanderen dat het e-mailadres al bestaat.
    cy.visit('/customers/register');
    cy.get('#firstName').type('Other');
    cy.get('#lastName').type('User');
    cy.get('#email').type(duplicateEmail);
    cy.get('#password').type('password123');
    cy.get('button[type="submit"]').contains('Register').click();

    // Na registratie ben je ingelogd als de nieuwe gebruiker. Log uit.
    cy.get('#sidebar-toggle-button').click();
    cy.get('form[action="/logout"] button').click();

    // Stap 2: Log in als de hoofd testgebruiker.
    cy.visit('/login');
    cy.get('#email').type(Cypress.env('TEST_USER_EMAIL'));
    cy.get('#password').type(Cypress.env('TEST_USER_PASSWORD'));
    cy.get('button[type="submit"]').click();

    // Stap 3: Ga naar het profiel en probeer de e-mail te updaten.
    cy.visit('/customers/profile');
    cy.get('#email').clear().type(duplicateEmail);
    cy.get('button[type="submit"]').contains('Update Profile').click();

    // Stap 4: Controleer of de foutmelding verschijnt.
    cy.get('.alert-danger')
      .should('be.visible')
      .and('contain', 'an account with this email already exists');
  });

  it('should successfully delete a user account', () => {
    const email = `deletable-user-${Date.now()}@example.com`;
    const password = 'password123';

    // Stap 1: Registreer een nieuwe gebruiker die we gaan verwijderen.
    // Na deze stap is de gebruiker automatisch ingelogd.
    cy.visit('/customers/register');
    cy.get('#firstName').type('ToDelete');
    cy.get('#lastName').type('User');
    cy.get('#email').type(email);
    cy.get('#password').type(password);
    cy.get('button[type="submit"]').contains('Register').click();

    // Stap 2: Ga direct naar het profiel en verwijder het account.
    cy.visit('/customers/profile');
    cy.get('button').contains('Delete Account').click();
    cy.get('#confirmDeleteModal').should('be.visible');
    cy.get('#confirmDeleteModal form[action="/customers/profile/delete"] button').click();

    // Stap 3: Controleer of de gebruiker is uitgelogd en teruggestuurd.
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.get('#sidebar-toggle-button').click();
    cy.get('#sidebarMenu').should('contain', 'Login').and('not.contain', 'Welcome,');
  });
});
