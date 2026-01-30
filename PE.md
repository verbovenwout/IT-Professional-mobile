# Permanente evaluatie

**Vul hieronder verder aan zoals beschreven in de [projectopgave](https://javascript.pit-graduaten.be/evaluatie/mobile/pe.html).**

## Scherm 1 — Receptenlijst

screenshot toegevoegd in assets/screenshots

Dit scherm toont een overzicht van alle beschikbare recepten die opgeslagen zijn in de applicatie. De gebruiker kan door de lijst scrollen en een recept selecteren om meer details te bekijken of om het te bewerken. De recepten worden later dynamisch geladen uit een lokale database. Er is een floating action button aanwezig om een nieuw recept aan te maken. In een volgende versie wil ik filtering en sorteeropties toevoegen, bijvoorbeeld op moeilijkheidsgraad of bereidingstijd. Navigatie gebeurt via React Navigation.

---


## Scherm 2 — Nieuw recept toevoegen

screenshot toegevoegd in assets/screenshots

In dit scherm kan de gebruiker een nieuw recept invoeren via een formulier. Velden die ingevuld kunnen worden zijn de titel, ingrediënten, bereidingstijd en moeilijkheidsgraad. Daarnaast kan de gebruiker een foto toevoegen via de camera of via de fotogalerij; hiervoor maak ik gebruik van een native mediapicker module. Nadat het formulier wordt opgeslagen, wordt het recept toegevoegd aan de database en wordt de gebruiker teruggestuurd naar de receptenlijst. Validatie wordt voorzien zodat belangrijke velden niet leeg blijven.

---

## Scherm 3

_Beschrijving van de functionaliteiten in het eerste scherm van je app._

## Scherm 4

_Beschrijving van de functionaliteiten in het eerste scherm van je app._

## Native modules

1. **Camera / Image picker**
   - Gebruikt voor het toevoegen van een foto aan een recept.  
   - Dit kan via de camera of via de galerij.  
   - Hiervoor gebruik ik een native module zoals `react-native-image-picker` of `expo-image-picker`.

2. **Local Storage / Database module**
   - Om recepten op te slaan gebruik ik een databasemodule zoals `SQLite` of `AsyncStorage` (later eventueel Firebase of IndexedDB).
   - Deze module zorgt ervoor dat gegevens lokaal bewaard worden en nadien opnieuw geladen kunnen worden.

---

## Online services


Ik plan om één online service te gebruiken in de toekomst, bijvoorbeeld Firebase, Supabase of een REST API. Deze service zal gebruikt worden om recepten in de cloud op te slaan zodat ze gesynchroniseerd kunnen worden tussen verschillende toestellen. Dit betekent dat gebruikers niet enkel lokaal, maar ook online hun data terugvinden. Mochten features uitbreiden, wil ik een API integreren voor het automatisch ophalen van voedingswaarden of recepten-inspiratie.

---

## Gestures & animaties

- **Gesture:**  
  Ik voeg swipe-acties toe bij items in de receptenlijst (bijvoorbeeld: swipe links om te verwijderen en swipe rechts om te bewerken).
  
- **Animatie:**  
  Bij het openen van een recept of navigeren tussen schermen gebruik ik overgangsanimaties. De floating action button krijgt een lichte scaling-animatie wanneer de gebruiker scrollt of wanneer een nieuw recept opgeslagen wordt.

---

# Feedback

Voor aan de minimum vereisten te voldoen heb je 4 pagina's nodig. Momenteel heb je enkel 2 beschreven, dus kan ik alleen hier op oordelen. 
De 2 pagina's en het topic vind ik wel in orde. 
Om wat extra complexiteit toe te voegen kan je gestures en animaties combineren. Speel hier gerust wat mee. 

Om je goed te kunnen beoordelen en feedback te kunnen geven, heb ik dus nog veel meer informatie nodig. 
Maak daarom zeker als je het project indient nog een overzicht van alle functionaliteiten. 




