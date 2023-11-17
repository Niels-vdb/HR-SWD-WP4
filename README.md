# Venv

Venv opstarten op de root van de directory

# Frontend

De frontend draait op React

## Om de frontend te laten draaien.

De frontend draait op port 3000
De frontend verwacht dat de backend op port 5000 draait

### In de terminal

1. cd frontend/
2. Bij het eerste keer opstarten: npm install   
3. npm start

# Backend

De backend draait op Python Flask, de API punten worden vanuit hier geregeld.
Ook staat de database setup hier om de database op te zetten en te vullen(meer hier over later).
Bij het aanmaken van een venv word er aangeraden om deze in de root dir te maken en niet in de backend dir

## Om de backend te laten draaien.

### In een tweede terminal

1. Bij het eerste keer opstarten: pip install -r requirements.txt
2. cd backend/
3. python run.py

## Database

De database draait op SQLite, deze kan worden opgezet via database_setup.py,
Hier staat code geschreven om de database op te bouwen, tafels aan te maken en te vullen bij
uitvoeren van de file. Deze kan worden aangeschreven door in de terminal de volgende stappen te volgen (in de venv):

1. cd backend/
2. python database_setup.py  
   Hierna zal de code draaien om de database op te zetten, bij fouten zullen deze op de terminal verschijnen.  
   Bij elke stap zal er een bericht verschijnen dat de stap volbracht is.

Type datatypes voor vragen zijn 0 voor openvragen en 1 voor mulitple choice vragen.
Deze zijn verplicht om mee te geven bij het aanmaken en opslaan van een vraag.

Het id van de gebruiker die de vraag heeft aangemaakt moet ook mee gegeven worden bij aanmaak en opslaan vraag.

## bcrypt_init.py

Initializeerd bcrypt (om wachtwoorden te versleutelen), kan worden geimoporteerd in andere
files doormiddel van 'from bcrypt_init import bcrypt'

## query_model.py

Verwerkt queries. Import in file en initalizeer met database file.

### select_query

haalt data op uit database

### insert_query

Stopt nieuwe data in database

# CSV files

Dit stukje gaat over de compatibaliteit van de CSV files.  
Er zijn twee CSV files toegevoegd in de Extra directory om mee te testen.  
- users.csv voor 3 nieuwe gebruikers.
- usersForGroups.csv voor gebruikers in een groep te stoppen.

## Nieuwe gebruikers

Voor nieuwe gebruikers moet de csv file er als volgt uit zien.  
voornaam,achternaam,email,adminBoolean

## Gebruikers in groep

voor gebruikers via csv in een groep doen word als volgt gedaan.  
email,email,email.....  
Dit werkt alleen voor email adressen die al in de database staan.

# Inloggen

## Admin

Admin users kunnen vragenlijsten aanmaken en hier de resultaten van bekijken.
Ook kan een admin nieuwe gebruikers aanmaken en admin users maken.
De inlog codes voor de basis admin zijn:  
email: admin@email.com  
wachtwoord: werkplaats4

## User

Normale dummy users kunnen inloggen op basis van hun voornaam en achternaam.
Normale users kunnen vragenlijsten invullen die voor hun zijn gemaakt.
De inloigcodes voor basis users zijn opgebouwd als volgt:  
email: 'voornaam'.'achternaam'@email.com  
wachtwoord: werkplaats4

# Pages uitleg

## Layout

Basis voor elk scherm

## Make survey

Scherm waar de surveys doior gebruiker in worden gevuld

### Components

- OpenQuestion
- MCQuestion

## Questions

Scherm waar vragen vanuit de database kunnen worden aangepast.  
Ook kunnen hier nieuwe MC en open vragen worden aangemaakt

### Components

- NavBar
- CustomAlert
- OpenQuestion
- MCQuestion

## Survey

Scherm waar per vragenlijst de beantwoorde vragen worden afgebeeld met de opgehaalde data.

### Components

- NavBar
- PieChart
- CustomTable

## Surveys

Scherm waar via iframes de opgehaalde van alle vragenlijsten kan worden ingezien.  
Hier kan verder worden geklikt naar speciafieke vragenlijsten

### Components

- NavBar

## SurveyMaker

Scherm waar nieuwe vragenlijsten kunnen worden aangemaakt

### Components

- NavBar
- CustomAlert
- OpenQuestion
- MCQuestion
- QuestionFinder

## Users

Scherm waar nieuwe gebruikers kunnen worden aangemaakt en verwijderd.  
Ook kunnen hier nieuwe groepen worden aangemaakt.  
Het maken van nieuwe groepen en gebruikers kan ook met csv files, hierover meer eerder in dit README bestand.

### Components

- NavBar
- CustomAlert
- UserCard
- CreateUserCard
- GroupCard
- GroupMakerModal


# Trello, ERD & Wireframe
Wireframe en ERD zijn in de map Extra als screenshot mee gelevert.  
De link naar het Trello bord is:  
https://trello.com/invite/b/AsISlRsi/ATTI064a796a91f456f61237430b8e37740eFF5F5E5D/werkplaats-4
# Code gebruikt van:

material ui templates voor inlog en menu scherm
