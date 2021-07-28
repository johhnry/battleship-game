export class GridLocation {
  row: number;
  col: number;

  constructor(row: number, col: number) {
    this.row = row;
    this.col = col;
  }

  add(rowOffset: number, colOffset: number): GridLocation {
    return new GridLocation(this.row + rowOffset, this.col + colOffset);
  }

  public toString(): string {
    return `(${this.col}, ${this.row})`;
  }
}
