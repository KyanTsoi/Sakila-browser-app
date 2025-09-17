describe('Login and Logout Flow', () => {

  it('should successfully log in a user', () => {
    // Ga naar de login-pagina
    cy.visit('/login');

    // Vul de inloggegevens in uit cypress.env.json
    cy.get('#email').type(Cypress.env('TEST_USER_EMAIL'));
    cy.get('#password').type(Cypress.env('TEST_USER_PASSWORD'));

    // Klik op de login-knop
    cy.get('button[type="submit"]').click();

    // Controleer of we zijn doorgestuurd naar de homepagina
    cy.url().should('not.include', '/login');

    // Controleer of de welkomstboodschap zichtbaar is
    cy.get('#sidebarMenu').should('contain', 'Welcome,');
  });

  it('should show an error on failed login', () => {
    // Ga naar de login-pagina
    cy.visit('/login');

    // Vul foute gegevens in
    cy.get('#email').type('wrong@email.com');
    cy.get('#password').type('wrongpassword');

    // Klik op de login-knop
    cy.get('button[type="submit"]').click();

    // Controleer of we op de login-pagina blijven
    cy.url().should('include', '/login');

    // Controleer of de foutmelding wordt getoond
    cy.get('.alert-danger').should('be.visible');
  });

  it('should successfully log out a user', () => {
    // Eerst inloggen om de test te kunnen uitvoeren
    cy.visit('/login');
    cy.get('#email').type(Cypress.env('TEST_USER_EMAIL'));
    cy.get('#password').type(Cypress.env('TEST_USER_PASSWORD'));
    cy.get('button[type="submit"]').click();

    // Klik op de menuknop om de sidebar te openen
    cy.get('#sidebar-toggle-button').click();

    // Wacht tot de homepagina is geladen en de sidebar de welkomstboodschap bevat
    cy.contains('#sidebarMenu', 'Welcome,').should('be.visible');

    // Zoek de uitlogknop en klik erop
    cy.get('form[action="/logout"] button').click();

    // Controleer of de welkomstboodschap weg is
    cy.get('#sidebarMenu').should('not.contain', 'Welcome,');

    // Controleer of de "Login" link weer zichtbaar is
    cy.get('#sidebarMenu').should('contain', 'Login');
  });

});