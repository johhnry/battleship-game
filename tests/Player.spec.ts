import { expect } from 'chai';
import { BoatPlacementError } from '../src/errors';
import { GridLocation } from '../src/GridLocation';
import { Player, PlayerDidNotPlaceBoatsError } from '../src/Player';

describe('Player tests', function () {
  it("Place the player's boats on the grid", function () {
    const player = new Player(10);

    player.placeBoats();

    expect(player.initialBoats).to.be.empty;
    expect(player.placedBoats).to.be.true;
  });

  it('Gives a random hit location on the grid', function () {
    const player = new Player(10);
    player.placeBoats();

    const hit = player.getHit();
    expect(hit).not.to.be.null;

    expect(hit.col).to.be.greaterThanOrEqual(0);
    expect(hit.col).to.be.lessThanOrEqual(player.grid.size);

    expect(hit.row).to.be.greaterThanOrEqual(0);
    expect(hit.row).to.be.lessThanOrEqual(player.grid.size);
  });

  it("Throws an error the player didn't place his boats", function () {
    const player = new Player(2);
    expect(() => player.getHit()).to.throw(PlayerDidNotPlaceBoatsError);
  });

  it('Looses when all of his boats were hit', function () {
    const player = new Player(10);
    player.placeBoats();

    for (let i = 0; i < player.grid.size; i++) {
      for (let j = 0; j < player.grid.size; j++) {
        player.grid.hitAt(new GridLocation(i, j));
      }
    }

    expect(player.didLoose()).to.be.true;
  });

  it('Should print out the thow grids', function () {
    const player = new Player(2);
    player.grid.hitAt(new GridLocation(0, 1));

    const expectedPlayerString = `| | |
                                  | | |
                                  
                                  | |O|
                                  | | |`.replace(/  +/g, '');

    expect(player.toString()).equal(expectedPlayerString);
  });
});
