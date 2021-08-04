import { Grid } from './Grid';
import {
  Boat,
  Carrier,
  Battleship,
  Cruiser,
  Submarine,
  Destroyer
} from './Boat';
import { GridLocation } from './GridLocation';

export class PlayerDidNotPlaceBoatsError extends Error {}

/**
 * The Player class is responsible for keeping two grids,
 * one for itself and one for the opponent's reference
 */
export class Player {
  /** The initial list of boats the user have to put on the grid */
  initialBoats: Boat[];

  /** The player's grid where the boats are placed */
  grid: Grid;

  /**
   * The target grid is where the player puts the hit
   * and misses of the oponnent's grid
   */
  targetGrid: Grid;

  /** Wether or not the player placed his boats */
  placedBoats = false;

  /**
   * Create a Player that has two grids (own and target)
   * @param gridSize the size of the grids
   */
  public constructor(gridSize: number) {
    this.grid = new Grid(gridSize);
    this.targetGrid = new Grid(gridSize);
    this.initialBoats = [Carrier, Battleship, Cruiser, Submarine, Destroyer];
  }

  /**
   * Place all the player's boats on the grid
   * Throw an error if the grid is not large enough
   */
  public placeBoats(): void {
    const numberOfBoats = this.initialBoats.length;

    for (let i = 0; i < numberOfBoats; i++) {
      const boat = this.initialBoats.pop();
      if (boat === undefined) throw new Error("The player can't add a boat");

      const { location, direction } =
        this.grid.getRandomPossibleBoatPlacement(boat);

      this.grid.placeBoat(boat, location, direction);
    }

    this.placedBoats = true;
  }

  /**
   * Makes the player choose a hit on the opponent's grid
   * @returns the choosen hit location
   */
  public getHit(): GridLocation {
    if (!this.placedBoats)
      throw new PlayerDidNotPlaceBoatsError(
        "Can't play without placing the boats on the grid\n" +
          'You might want to call player.placeBoats() before'
      );

    // Get a random square on the opponent's grid
    const randomHit: GridLocation = this.targetGrid.getRandomFreeLocation();

    return randomHit;
  }

  /**
   * Returns wether the player lost the game
   * It happens when all of his boats are hit
   * @returns True if the player lost, false otherwise
   */
  public didLoose(): boolean {
    return this.grid
      .getSquares()
      .filter((s) => s.hasABoat())
      .every((s) => s.hasBeenHit());
  }

  /**
   * @returns The string representation of the Player, it's two grids
   */
  public toString(): string {
    return this.targetGrid.toString() + '\n\n' + this.grid.toString();
  }
}
