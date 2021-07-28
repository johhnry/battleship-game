import { expect } from 'chai';
import { Grid } from './Grid';
import { Player } from './Player';

describe('Player tests', function () {
  it("Place the player's boats on the grid", function () {
    const grid = new Grid(10);
    const player = new Player(grid);

    player.placeBoats();

    expect(player.initialBoats).to.be.empty;
  });
});
