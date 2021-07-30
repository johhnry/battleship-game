import { Grid } from './Grid';
import { Player } from './Player';

const player = new Player(10);
player.placeBoats();

console.log(player.grid.toString());
