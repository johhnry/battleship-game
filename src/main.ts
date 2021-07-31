import { Game } from './Game';

const game = new Game(20);
game.setup();

async function run() {
  while (!game.ended()) {
    game.turn();

    if (game.turnCount % 5 == 0) {
      console.clear();

      console.log(`Turn n°${game.turnCount}\n`);
      console.log(game.players[0].toString());
    }

    await new Promise((resolve) => setTimeout(resolve, 20));
  }
}

run();

console.log('GAME ENDED');
