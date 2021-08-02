/* eslint-disable max-len */
import { expect } from 'chai';
import { Grid, CardinalDirection } from '../src/Grid';
import {
  BoatAlreadyHitError,
  BoatPlacementError,
  InvalidBoatLocationError,
  InvalidGridSizeError,
  InvalidSquareError,
  NoMoreFreeLocationOnTheGridError,
  SquareAlreadyMissError
} from '../src/errors';
import { GridLocation } from '../src/GridLocation';
import { Square, SquareStatus } from '../src/Square';
import { Battleship, boats, Cruiser, Destroyer, Submarine } from '../src/Boat';

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
  it('Gives a random free location on the grid', function () {
    const grid = new Grid(10);

    for (let i = 0; i < 100; i++) {
      const hit = grid.getRandomFreeLocation();

      expect(hit.col).to.be.greaterThanOrEqual(0);
      expect(hit.col).to.be.lessThan(grid.size);

      expect(hit.row).to.be.greaterThanOrEqual(0);
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

  it("Can't miss a square two times", function () {
    const grid = new Grid(5);

    const location = new GridLocation(1, 3);
    grid.hitAt(location);

    expect(() => grid.hitAt(location)).to.throw(SquareAlreadyMissError);
  });

  it('Should hit 1000 times randomly on a 10x10 grid and throw an error', function () {
    expect(() => {
      const grid = new Grid(10);
      for (let i = 0; i < 1000; i++) {
        grid.hitAt(grid.getRandomFreeLocation());
      }
    }).to.throw(NoMoreFreeLocationOnTheGridError);
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
      const possibleLocations = grid.getAllPossibleBoatPlacements(boat);

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

  it('Should force the hit', function () {
    const grid = new Grid(5);
    grid.hitAt(new GridLocation(4, 2), true);
    expect(grid.getSquareAt(4, 2).hasBeenHit()).to.be.true;
  });

  it('Should return the flattened list of squares', function () {
    const grid = new Grid(2);

    grid.hitAt(new GridLocation(1, 1), true);
    grid.hitAt(new GridLocation(0, 1), false);

    const expectedSquares = [
      new Square(),
      new Square(),
      new Square(SquareStatus.Miss),
      new Square(SquareStatus.Hit)
    ];

    expect(grid.getSquares()).deep.equal(expectedSquares);
  });
});
