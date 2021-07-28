import { expect } from 'chai';
import {
  BoatAlreadyHitError,
  BoatPlacementError,
  CardinalDirection,
  Grid,
  InvalidBoatLocationError,
  InvalidGridSizeError,
  InvalidSquareError,
  SquareAlreadyMissError
} from './Grid';
import { GridLocation } from './GridLocation';
import { SquareStatus } from './Square';
import { Battleship, boats, Cruiser, Destroyer, Submarine } from './Boat';

describe('Grid creation', function () {
  it('Create a 10x10 empty grid', function () {
    const grid = new Grid(10);

    expect(grid.size).to.equal(10);
    expect(grid.squares).to.be.lengthOf(10);

    for (const row of grid.squares) {
      expect(row).to.be.lengthOf(10);

      for (const square of row) {
        expect(square).to.have.property('status', SquareStatus.Empty);
      }
    }
  });

  it('Should raise an exception when creating a negative or null grid', function () {
    expect(() => new Grid(0)).to.throw(InvalidGridSizeError);
    expect(() => new Grid(-5)).to.throw(InvalidGridSizeError);
  });
});

describe('Grid behavior', function () {
  it('Gives a random hit location on the grid', function () {
    const grid = new Grid(10);

    for (let i = 0; i < 1000; i++) {
      const hit = grid.getRandomHit();
      expect(hit.col).to.be.lessThan(grid.size);
      expect(hit.row).to.be.lessThan(grid.size);
    }
  });

  it('Should miss when hiting an empty square', function () {
    const grid = new Grid(10);
    const hitLocation: GridLocation = new GridLocation(0, 0);

    grid.hitAt(hitLocation);

    expect(grid.getSquareAtLocation(hitLocation).status).to.be.equal(
      SquareStatus.Miss
    );
  });

  it('Should hit a boat', function () {
    const grid = new Grid(10);
    grid.placeBoat(Cruiser, new GridLocation(0, 0), CardinalDirection.EAST);

    grid.hitAt(new GridLocation(0, 0));
    expect(grid.getSquareAt(0, 0).status).to.be.equal(SquareStatus.Hit);
  });

  it("Can't hit a boat twice", function () {
    const grid = new Grid(10);
    const location = new GridLocation(0, 0);

    grid.placeBoat(Cruiser, location, CardinalDirection.EAST);

    expect(() => {
      for (let i = 0; i < 2; i++) grid.hitAt(location);
    }).to.throw(BoatAlreadyHitError);
  });

  it('Should hit 1000 times randomly on a 10x10 grid and throw an error', function () {
    expect(() => {
      const grid = new Grid(10);
      for (let i = 0; i < 1000; i++) {
        grid.hitAt(grid.getRandomHit());
      }
    }).to.throw(SquareAlreadyMissError);
  });

  it('Should be impossible to hit on an invalid square', function () {
    const grid = new Grid(10);

    expect(() => {
      grid.hitAt(new GridLocation(10, 10));
    }).to.throw(InvalidSquareError);
  });

  it('Should raise an exception when placing a boat outside the grid', function () {
    const grid = new Grid(5);
    expect(() => {
      grid.placeBoat(
        Battleship,
        new GridLocation(-1, 2),
        CardinalDirection.EAST
      );
    }).to.throw(InvalidBoatLocationError);
  });

  it('Should put a boat on the grid', function () {
    const grid = new Grid(4);
    const boatLocation = new GridLocation(0, 0);

    grid.placeBoat(Battleship, boatLocation, CardinalDirection.EAST);

    expect(grid.getSquareAt(0, 0).hasABoat()).to.be.true;
    expect(grid.getSquareAt(0, 1).hasABoat()).to.be.true;
    expect(grid.getSquareAt(0, 2).hasABoat()).to.be.true;
    expect(grid.getSquareAt(0, 3).hasABoat()).to.be.true;
  });

  it("Can't place a boat that is going outside the grid", function () {
    const grid = new Grid(4);
    expect(() => {
      grid.placeBoat(
        Battleship,
        new GridLocation(1, 2),
        CardinalDirection.NORTH
      );
    }).to.throw(BoatPlacementError);
  });

  it("Can't place a boat on another boat", function () {
    const grid = new Grid(5);
    grid.placeBoat(Cruiser, new GridLocation(0, 0), CardinalDirection.SOUTH);

    expect(() => {
      grid.placeBoat(Submarine, new GridLocation(2, 0), CardinalDirection.EAST);
    }).to.throw(BoatPlacementError);

    expect(() => {
      grid.placeBoat(Submarine, new GridLocation(3, 0), CardinalDirection.EAST);
    }).not.to.throw(BoatPlacementError);
  });

  it('Should give all the possible locations for a boat on a grid', function () {
    // For all the possible boats
    for (const boat of boats) {
      const grid = new Grid(boat.size);
      const possibleLocations = grid.getPossibleBoatPlacements(boat);

      // Compute the number of possible locations for a boat
      const expectedNumberOfPossibleLocations = 8 + (grid.size - 2) * 4;

      expect(possibleLocations).to.be.lengthOf(
        expectedNumberOfPossibleLocations
      );

      // Test if we can effectively place the boats on the grid
      for (const { location, direction } of possibleLocations) {
        const tempGrid = new Grid(grid.size);
        expect(() =>
          tempGrid.placeBoat(boat, location, direction)
        ).not.to.throw(Error);
      }
    }
  });

  it('Should give a valid boat placement on a large grid', function () {
    const grid = new Grid(10);

    expect(() => grid.getRandomPossibleBoatPlacement(Cruiser)).not.to.throw(
      Error
    );
  });

  it('Should give an error because there are no available boat space', function () {
    const grid = new Grid(2);
    expect(() => grid.getRandomPossibleBoatPlacement(Cruiser)).to.throw(Error);
  });

  it('Should return the string representation of the grid', function () {
    const grid = new Grid(2);

    grid.placeBoat(Destroyer, new GridLocation(0, 1), CardinalDirection.SOUTH);

    const expectedGridString = `| |5|
                                | |5|`.replace(/  +/g, '');

    expect(grid.toString()).to.be.equal(expectedGridString);
  });
});
