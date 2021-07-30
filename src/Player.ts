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

export class Player {
  /** The initial list of boats the user have to put on the grid */
  initialBoats: Boat[];

  /** The player's grid where the boats are placed */
  grid: Grid;

  /** The target grid is where the player puts the hit and misses of the oponnent's grid */
  targetGrid: Grid;

  /**
   * Create a Player that has two grids (own and target)
   * @param gridSize the size of the grids
   */
  constructor(gridSize: number) {
    this.grid = new Grid(gridSize);
    this.targetGrid = new Grid(gridSize);
    this.initialBoats = [Carrier, Battleship, Cruiser, Submarine, Destroyer];
  }

  /**
   * Place all the player's boats on the grid
   * Throw an error if the grid is not large enough
   */
  placeBoats(): void {
    const numberOfBoats = this.initialBoats.length;

    for (let i = 0; i < numberOfBoats; i++) {
      const boat = this.initialBoats.pop();
      if (boat === undefined) throw new Error("The player can't add a boat");

      const { location, direction } =
        this.grid.getRandomPossibleBoatPlacement(boat);

      this.grid.placeBoat(boat, location, direction);
    }
  }

  play(): void {
    const randomHit: GridLocation = this.grid.getRandomFreeLocation();
    this.grid.hitAt(randomHit);
  }
}
