# Starwars themed war-like card game

This project was build using data from  [SWAPI](https://swapi.dev/);

All images used are AI Generated [Adobe Firefly](https://firefly.adobe.com/);

The main purpose was to recreate 'war' card game experience, where users get unique card decks.

On the beginning of each round, each user takes first card from top of his card deck which remains hidden till this point, and reveal it.

In this phase of the game users compare their card stats (Mass | Diameter | Cost - depends od entity type we chose for current gameplay).

User with highest value WINS round.

If values are equal then round ends wit a DRAW.

When all cards been used, means it's the end of the bout, and points form previous round are calculated to point a winner.

User with highest number of won rounds is mentioned in summary and his total score increments depending on multiplier (1000 pts per win by default).

On cases where all players won equal amount of rounds, game is called a DRAW, and none of the players is rewarded with prize points

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.
