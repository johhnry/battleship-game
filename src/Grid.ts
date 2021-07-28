import { Boat } from './Boat';
import { GridLocation } from './GridLocation';
import { Square, SquareStatus } from './Square';

abstract class HitError extends Error {}
export class BoatAlreadyHitError extends HitError {}
export class SquareAlreadyMissError extends HitError {}
export class InvalidSquareError extends HitError {}

export class BoatPlacementError extends Error {}
export class InvalidBoatLocationError extends Error {}
export class InvalidGridSizeError extends Error {}
export class NoMoreAvailableBoatPlacement extends Error {}

export enum CardinalDirection {
  NORTH,
  EAST,
  SOUTH,
  WEST
}

const cardinalDirections = [
  CardinalDirection.NORTH,
  CardinalDirection.EAST,
  CardinalDirection.SOUTH,
  CardinalDirection.WEST
];

type BoatPlacement = {
  location: GridLocation;
  direction: CardinalDirection;
};

export class Grid {
  size: number;
  squares: Square[][] = [];

  /**
   * Construct an empty grid
   * @param size the size of the grid
   */
  constructor(size: number) {
    if (size <= 0) throw new InvalidGridSizeError();
    this.size = size;
    this.initializeSquares();
  }

  /**
   * Initialize the two dimensionnal array of squares
   */
  private initializeSquares(): void {
    for (let i = 0; i < this.size; i++) {
      this.squares[i] = [];
      for (let j = 0; j < this.size; j++) {
        this.squares[i][j] = new Square();
      }
    }
  }

  getRandomHit(): GridLocation {
    const randint = (max: number) => Math.floor(Math.random() * max);

    const col = randint(this.size);
    const row = randint(this.size);

    return new GridLocation(col, row);
  }

  getSquareAtLocation(location: GridLocation): Square {
    return this.squares[location.col][location.row];
  }

  getSquareAt(col: number, row: number): Square {
    return this.getSquareAtLocation(new GridLocation(col, row));
  }

  isLocationValid(location: GridLocation): boolean {
    return (
      location.col >= 0 &&
      location.col < this.size &&
      location.row >= 0 &&
      location.row < this.size
    );
  }

  isLocationFree(location: GridLocation): boolean {
    return (
      this.isLocationValid(location) &&
      !this.getSquareAtLocation(location).hasABoat()
    );
  }

  areLocationsFree(locations: GridLocation[]): boolean {
    return locations
      .map((loc) => this.isLocationFree(loc))
      .every((valid) => valid === true);
  }

  getBoatSquaresWithDirection(
    boat: Boat,
    location: GridLocation,
    direction: CardinalDirection
  ): GridLocation[] {
    const boatLocations: GridLocation[] = [];

    // Check future squares of the boat
    for (let i = 0; i < boat.size; i++) {
      let loc: GridLocation;

      switch (direction) {
        case CardinalDirection.EAST:
          loc = location.add(0, i);
          break;
        case CardinalDirection.NORTH:
          loc = location.add(-i, 0);
          break;
        case CardinalDirection.SOUTH:
          loc = location.add(i, 0);
          break;
        case CardinalDirection.WEST:
          loc = location.add(0, -i);
          break;
      }

      boatLocations.push(loc);
    }

    return boatLocations;
  }

  /**
   * Place a boat on the grid
   * @param boat The boat to be put
   * @param location The location of the grid of the boat (its origin point)
   * @param direction The cardinal direction from the origin point
   */
  placeBoat(
    boat: Boat,
    location: GridLocation,
    direction: CardinalDirection
  ): void {
    if (!this.isLocationValid(location))
      throw new InvalidBoatLocationError(location.toString());

    const boatLocations = this.getBoatSquaresWithDirection(
      boat,
      location,
      direction
    );

    // Check if the location is valid
    if (!this.areLocationsFree(boatLocations)) {
      throw new BoatPlacementError(
        `Can't place a boat at invalid location: ${location}`
      );
    }

    // Place a boat on each square
    for (const l of boatLocations) {
      this.getSquareAtLocation(l).placeBoat(boat);
    }
  }

  /**
   * Hit on the grid at a specific location
   * @param hitLocation the position to hit
   */
  hitAt(hitLocation: GridLocation): void {
    if (!this.isLocationValid(hitLocation)) throw new InvalidSquareError();

    const squareHit: Square = this.getSquareAtLocation(hitLocation);

    switch (squareHit.status) {
      case SquareStatus.Empty:
        squareHit.miss();
        break;
      case SquareStatus.Boat:
        squareHit.hit();
        break;
      case SquareStatus.Hit:
        throw new BoatAlreadyHitError();
      case SquareStatus.Miss:
        throw new SquareAlreadyMissError();
    }
  }

  getPossibleBoatPlacements(boat: Boat): BoatPlacement[] {
    const boatPossiblePlacements: BoatPlacement[] = [];

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        for (const cardinalDirection of cardinalDirections) {
          const currentLocation = new GridLocation(i, j);

          const boatLocations = this.getBoatSquaresWithDirection(
            boat,
            new GridLocation(i, j),
            cardinalDirection
          );

          const placementValid = boatLocations.every((loc) =>
            this.isLocationFree(loc)
          );

          if (placementValid) {
            boatPossiblePlacements.push({
              location: currentLocation,
              direction: cardinalDirection
            });
          }
        }
      }
    }

    return boatPossiblePlacements;
  }

  /**
   * Return a random free position and direction on the grid where to put a boat
   * @param boat the boat to place
   * @returns a random available placement for the boat
   */
  getRandomPossibleBoatPlacement(boat: Boat): BoatPlacement {
    const placements = this.getPossibleBoatPlacements(boat);
    if (placements.length === 0)
      throw new NoMoreAvailableBoatPlacement(
        `No more valid places to put a ${boat}`
      );
    return placements[Math.floor(Math.random() * placements.length)];
  }

  toString(): string {
    let result = '';

    for (let i = 0; i < this.size; i++) {
      result += '|';
      for (let j = 0; j < this.size; j++) {
        result += this.getSquareAt(i, j).toString() + '|';
      }
      result += '\n';
    }

    return result;
  }
}
