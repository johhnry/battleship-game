import { Grid } from './Grid';
import {
  Boat,
  Carrier,
  Battleship,
  Cruiser,
  Submarine,
  Destroyer
} from './Boat';

export class Player {
  initialBoats: Boat[];
  grid: Grid;

  constructor(grid: Grid) {
    this.grid = grid;
    this.initialBoats = [Carrier, Battleship, Cruiser, Submarine, Destroyer];
  }

  /**
   * Place all the player's boats on the grid
   * Throw an error if the grid is not large enough
   */
  placeBoats(): void {
    const numberOfBoats = this.initialBoats.length;

    for (let m = 0; m < numberOfBoats; m++) {
      const boat = this.initialBoats.pop();
      if (boat === undefined) throw new Error("The player can't add a boat");

      const { location, direction } =
        this.grid.getRandomPossibleBoatPlacement(boat);

      this.grid.placeBoat(boat, location, direction);
    }
  }

  /*play(): void {
    const randomHit: GridLocation = this.grid.getRandomHit();
    this.grid.hitAt(randomHit);
  }*/
}
