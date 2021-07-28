import { Grid } from './Grid';
import { Player } from './Player';

const player = new Player(new Grid(10));
player.placeBoats();

console.log(player.grid.toString());
