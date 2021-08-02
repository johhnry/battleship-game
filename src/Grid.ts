import { Boat } from './Boat';
import { GridLocation } from './GridLocation';
import { Square, SquareStatus } from './Square';
import {
  chooseRandomFrom,
  flattenTwoDimensionalArray,
  initializeTwoDimensionalArray
} from './utils';
import {
  SquareAlreadyMissError,
  InvalidSquareError,
  BoatPlacementError,
  InvalidBoatLocationError,
  InvalidGridSizeError,
  NoMoreFreeLocationOnTheGridError,
  NoMoreAvailableBoatPlacementError,
  BoatAlreadyHitError
} from './errors';

/**
 * Enum for cardinal directions
 * Used to position the boats on the grid
 */
export enum CardinalDirection {
  NORTH,
  EAST,
  SOUTH,
  WEST
}

/**
 * The array of possible directions
 */
const cardinalDirections = [
  CardinalDirection.NORTH,
  CardinalDirection.EAST,
  CardinalDirection.SOUTH,
  CardinalDirection.WEST
];

/**
 * Represents the information to put a boat on the grid
 */
type BoatPlacement = {
  location: GridLocation;
  direction: CardinalDirection;
};

/**
 * The Grid class is essentially a two dimensional array
 * It contains useful methods to put boats and hit on the grid
 */
export class Grid {
  size: number;
  squares: Square[][] = [];

  /**
   * Construct an empty grid
   * @param size the size of the grid
   */
  constructor(size: number) {
    if (size <= 0) {
      throw new InvalidGridSizeError(
        "Can't create a grid with negative or empty size"
      );
    }

    this.size = size;
    this.squares = initializeTwoDimensionalArray(this.size, this.size, Square);
  }

  /**
   * Return a free location on the grid
   * @returns the location associated to that free square
   */
  getRandomFreeLocation(): GridLocation {
    const freeLocations: GridLocation[] = [];

    // Go through all the squares
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const square = this.getSquareAt(i, j);

        // If the square is empty, add it to the list
        if (square.canBeHit()) {
          freeLocations.push(new GridLocation(i, j));
        }
      }
    }

    // Throw an error when there's no free locations
    if (freeLocations.length === 0) {
      throw new NoMoreFreeLocationOnTheGridError();
    }

    return chooseRandomFrom(freeLocations);
  }

  /**
   * @param location the location to query
   * @returns the queried square
   */
  getSquareAtLocation(location: GridLocation): Square {
    return this.squares[location.col][location.row];
  }

  /**
   * @param col the column to query
   * @param row the row to query
   * @returns the queried square
   */
  getSquareAt(col: number, row: number): Square {
    return this.getSquareAtLocation(new GridLocation(col, row));
  }

  /**
   * Return wether a GridLocation is valid according to the grid size
   * If false, it's out of the bounds
   * @param location the location to query
   * @returns true if valid
   */
  isLocationValid(location: GridLocation): boolean {
    return (
      location.col >= 0 &&
      location.col < this.size &&
      location.row >= 0 &&
      location.row < this.size
    );
  }

  /**
   * Return true if the location is valid and empty
   * @param location the location to query
   * @returns true if it's empty
   */
  isLocationFree(location: GridLocation): boolean {
    return (
      this.isLocationValid(location) &&
      this.getSquareAtLocation(location).isEmpty()
    );
  }

  /**
   * @param locations the array of locations to check
   * @returns true if all the locations are free
   */
  areLocationsFree(locations: GridLocation[]): boolean {
    return locations
      .map((loc) => this.isLocationFree(loc))
      .every((valid) => valid === true);
  }

  /**
   * Compute the locations of a boat at a certain position
   * and direction on the grid
   * @param boat the boat to query
   * @param location the origin location of the boat
   * @param direction the direction of the boat
   * @returns the array of locations that the boat is going to take
   */
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
   * @param forceHit if true, hit the square
   * @returns the result of the hit, either hit or miss
   */
  hitAt(
    hitLocation: GridLocation,
    forceHit = false
  ): SquareStatus.Hit | SquareStatus.Miss {
    if (!this.isLocationValid(hitLocation)) throw new InvalidSquareError();

    const squareHit: Square = this.getSquareAtLocation(hitLocation);

    // When we want to mark the target grid, we force the hit
    if (forceHit) {
      squareHit.hit(true);
      return SquareStatus.Hit;
    }

    switch (squareHit.status) {
      case SquareStatus.Empty:
        squareHit.miss();
        return SquareStatus.Miss;
      case SquareStatus.Boat:
        squareHit.hit();
        return SquareStatus.Hit;
      case SquareStatus.Hit:
        throw new BoatAlreadyHitError(`Boat already hit at ${hitLocation}`);
      case SquareStatus.Miss:
        throw new SquareAlreadyMissError(`Already miss at ${hitLocation}`);
    }
  }

  /**
   * Return all the possible boat placement
   * @param boat the boat to query
   * @returns an array of locations and directions
   */
  getAllPossibleBoatPlacements(boat: Boat): BoatPlacement[] {
    const boatPossiblePlacements: BoatPlacement[] = [];

    // Go through the grid
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        // For each direction
        for (const cardinalDirection of cardinalDirections) {
          const currentLocation = new GridLocation(i, j);

          // Get boat squares
          const boatLocations = this.getBoatSquaresWithDirection(
            boat,
            new GridLocation(i, j),
            cardinalDirection
          );

          // Test if the squares are free to use
          const placementValid = boatLocations.every((loc) =>
            this.isLocationFree(loc)
          );

          // Add the placement if successfull
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
    const placements = this.getAllPossibleBoatPlacements(boat);

    if (placements.length === 0) {
      throw new NoMoreAvailableBoatPlacementError(
        `No more valid places to put a boat ${boat.id} of size ${
          boat.size
        }\n${this.toString()}`
      );
    }

    return chooseRandomFrom(placements);
  }

  /**
   * @returns the array of squares flatten
   */
  getSquares(): Square[] {
    return flattenTwoDimensionalArray(this.squares);
  }

  /**
   * @returns the string representation of the Grid
   */
  toString(): string {
    let result = '';

    for (let i = 0; i < this.size; i++) {
      result += '|';
      for (let j = 0; j < this.size; j++) {
        result += this.getSquareAt(i, j).toString() + '|';
      }
      if (i < this.size - 1) result += '\n';
    }

    return result;
  }
}
