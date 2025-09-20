# Sakila Movie Browser

Welkom bij de Sakila Movie Browser! Dit is een webapplicatie, gebouwd met Node.js en Express, die gebruikers in staat stelt om de filmcollectie uit de Sakila-database te doorzoeken, te bekijken en persoonlijke favorietenlijsten bij te houden.

De applicatie is opgezet volgens de MVC-architectuur en maakt gebruik van server-side rendering met de Pug template engine.

## ✨ Features

- **Filmoverzicht**: Blader door de volledige filmcollectie met paginering.
- **Zoekfunctionaliteit**: Zoek films op titel.
- **Film Details**: Bekijk gedetailleerde informatie over elke film, inclusief genre en gerelateerde films.
- **Gebruikersaccounts**: Gebruikers kunnen zich registreren en inloggen.
- **Persoonlijke Watchlist**: Ingelogde gebruikers kunnen films toevoegen aan en verwijderen uit hun persoonlijke watchlist.
- **Responsive Design**: De interface is gebouwd met Bootstrap 5 en is volledig responsive voor gebruik op verschillende apparaten.

## 🛠️ Technologie Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL (met de `mysql2` package)
- **Sessies**: `express-session` voor het beheren van gebruikerssessies.
- **Authenticatie**: Wachtwoorden worden veilig gehasht met `bcrypt`.
- **Logging**: `winston` voor gestructureerde logging.

### Frontend

- **View Engine**: Pug (voor server-side rendering)
- **Styling**: Bootstrap 5 en een aangepast stylesheet (`style.css`).

### DevOps & Testing

- **Testing**: End-to-end tests geschreven met Cypress.
- **CI/CD**: Geautomatiseerde build, en deployment via GitHub Actions.
- **Hosting**: De applicatie wordt gedeployed naar Microsoft Azure.

## 📁 Projectstructuur

Het project volgt een Model-View-Controller (MVC) architectuur om de code georganiseerd en onderhoudbaar te houden:

- **`src/routes`**: Definieert de URL-eindpunten van de applicatie en koppelt ze aan de juiste controller-functies.
- **`src/controllers`**: Verwerkt de inkomende verzoeken, roept de benodigde services aan en rendert de uiteindelijke view.
- **`src/services`**: Bevat de business logic van de applicatie.
- **`src/dao` (Data Access Object)**: Is verantwoordelijk voor alle communicatie met de database. Hier worden de SQL-queries geschreven en uitgevoerd.
- **`views`**: Bevat de Pug-templates voor het genereren van de HTML-pagina's.
- **`public`**: Bevat alle statische bestanden zoals stylesheets, afbeeldingen en client-side JavaScript.
