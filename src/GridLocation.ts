/**
 * A GridLocation is a two dimensional vector like
 * representing a location on a Grid
 */
export class GridLocation {
  row: number;
  col: number;

  constructor(row: number, col: number) {
    this.row = row;
    this.col = col;
  }

  /**
   * Add the given offset to the current location and return a new instance
   * @param rowOffset row offset
   * @param colOffset column offset
   * @returns A new location
   */
  public add(rowOffset: number, colOffset: number): GridLocation {
    return new GridLocation(this.row + rowOffset, this.col + colOffset);
  }

  /**
   *
   * @returns The string representation of a location
   */
  public toString(): string {
    return `(${this.col}, ${this.row})`;
  }
}
