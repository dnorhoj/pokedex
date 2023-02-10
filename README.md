# Pokedex

**Hjemmesiden er hostet på [https://pokedex.dnorhoj.me/](https://pokedex.dnorhoj.me/)**

Kildekode til Pokedex opgaven i programmering.

## Struktur

I mappen `src` ligger koden til opgaven. Her er det delt op i 3 mapper:

* `battle` - Koden til "battle" siden
  * Her er kun et komponent som styrer hele siden
* `my-pokemon` - Koden til "my pokemon" siden
  * Her har jeg lavet et komponent til hver af de forskellige dele af siden:
    * `catch-pokemon` - Komponentet der styrer at fange pokemon
    * `pokemon-list` - Komponentet der styrer at vise listen af pokemon i bunden
* `start` - Koden til "start" siden
  * Her har jeg selve startsiden og "auth" komponentet som styrer login og logout

## Persistering

Jeg har valgt at bruge `localStorage` til at persitere data. Det er en simpel måde at gemme data i browseren, som er nem at bruge. Jeg har valgt at gemme dataen som JSON, da det er nemt at gemme og hente igen.

## Services

Jeg gør brug af 2 services i opgaven:

* `pokeapi` - Service der håndterer at hente pokemon fra PokeAPI
* `users` - Service der håndterer at hente brugere fra localstorage.

## Holdning til Angular

Projektet har givet mig en dybere forståelse af Angular. Det skal dog ikke være nogen hemmelighed at jeg ikke er den største fan af Angular.

Jeg synes også at Angular er meget tungt og kræver meget kode for at få lavet noget simpelt. For eksempel synes jeg at det har været meget besværligere end det behøves at subscribe til opdateringer i data. Her har jeg brugt `RxJS` som er et tredjepartsbibliotek som sørger for at gøre det nemmere at håndtere asynkronitet.

