describe('Favorite Movies (Watchlist) Flow', () => {

  // Voordat elke test in dit bestand wordt uitgevoerd, loggen we eerst in.
  // Dit voorkomt dat we de inlogstappen in elke test moeten herhalen.
  beforeEach(() => {
    cy.visit('/login');
    cy.get('#email').type(Cypress.env('TEST_USER_EMAIL'));
    cy.get('#password').type(Cypress.env('TEST_USER_PASSWORD'));
    cy.get('button[type="submit"]').click();
    cy.url().should('not.include', '/login');
  });

  it('should add a movie to the watchlist and then remove it', () => {
    // Ga naar de filmoverzichtspagina
    cy.visit('/movies');

    // Klik op de allereerste film in de lijst om naar de detailpagina te gaan
    // We slaan de titel van deze film op om later te kunnen controleren.
    cy.get('.movie-card-link h5').first().invoke('text').as('firstMovieTitle');
    cy.get('.movie-card-link').first().click();

    // Klik op de knop "Add to Watchlist"
    cy.get('form[action="/customers/watchlist/add"] button').click();

    // Ga naar de favorietenpagina via de link in de sidebar
    cy.get('#sidebar-toggle-button').click();
    cy.get('a[href="/customers/watchlist"]').click();

    // Controleer of de URL nu klopt
    cy.url().should('include', '/customers/watchlist');

    // Controleer of de titel van de film die we hebben opgeslagen,
    // nu zichtbaar is op de favorietenpagina.
    cy.get('@firstMovieTitle').then(movieTitle => {
      cy.get('.movie-card-link h5').should('contain', movieTitle);
    });

    // --- Verwijder de film weer ---

    // Klik opnieuw op de filmkaart om terug te gaan naar de detailpagina
    cy.get('.movie-card-link').first().click();

    // Klik nu op de knop "Delete from Watchlist"
    cy.get('form[action="/customers/watchlist/remove"] button').click();

    // Ga opnieuw naar de favorietenpagina
    cy.get('#sidebar-toggle-button').click();
    cy.get('a[href="/customers/watchlist"]').click();

    // Controleer of de pagina nu de melding "No movies found" toont.
    cy.get('.alert-info').should('contain', 'No movies found');
  });

});