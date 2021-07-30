import { expect } from 'chai';
import { Player } from '../src/Player';

describe('Player tests', function () {
  it("Place the player's boats on the grid", function () {
    const player = new Player(10);

    player.placeBoats();

    expect(player.initialBoats).to.be.empty;
  });
});
