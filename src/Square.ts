import { Boat, BoatID } from './Boat';
import { SquareHitError, SquareMissError } from './errors';

/** The different possible status of a Square */
export enum SquareStatus {
  Empty,
  Boat,
  Hit,
  Miss
}

/** The possible content of a Square */
export type SquareContent = BoatID | undefined;

/**
 * A Square is a container on the Grid
 * It can be hit, miss or empty and have a boat on it
 */
export class Square {
  /** The status of the square */
  status: SquareStatus;

  /** Can be empty or a boat (it's ID) */
  content: SquareContent;

  /**
   * @param initialStatus the initial status of the square (default empty)
   */
  constructor(initialStatus?: SquareStatus) {
    this.status = initialStatus || SquareStatus.Empty;
  }

  /**
   * Put the square into the miss status
   * Can't miss a square with a boat
   */
  miss(): void {
    if (this.hasABoat())
      throw new SquareMissError("Can't miss a square with a boat");
    this.status = SquareStatus.Miss;
  }

  /**
   * Put the square into the hit status
   */
  hit(force = false): void {
    if (!force && !this.hasABoat())
      throw new SquareHitError("Can't hit a square that doesn't have a boat");
    this.status = SquareStatus.Hit;
  }

  /**
   * Put a boat on the square
   * @param boat the boat to put
   */
  placeBoat(boat: Boat): void {
    this.status = SquareStatus.Boat;
    this.content = boat.id;
  }

  /**
   * @returns true if has been hit
   */
  hasBeenHit(): boolean {
    return this.status === SquareStatus.Hit;
  }

  /**
   * @returns true if it can be hit (there's a boat and it's empty)
   */
  canBeHit(): boolean {
    return this.status === SquareStatus.Empty || this.hasABoat();
  }

  /**
   * @returns true if it has a boat meaning its content is not undefined
   */
  hasABoat(): boolean {
    return this.status === SquareStatus.Boat && this.content !== undefined;
  }

  /**
   * @returns true if it's empty
   */
  isEmpty(): boolean {
    return this.status === SquareStatus.Empty && this.content === undefined;
  }

  /**
   * Return the string representation of a Square
   */
  toString(): string {
    switch (this.status) {
      case SquareStatus.Empty:
        return ' ';
      case SquareStatus.Hit:
        return 'X';
      case SquareStatus.Miss:
        return 'O';
      case SquareStatus.Boat:
        if (this.content === undefined) return 'B';
        return this.content.toString();
    }
  }
}
