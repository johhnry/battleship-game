import { Boat, BoatID } from './Boat';

export enum SquareStatus {
  Empty,
  Boat,
  Hit,
  Miss
}
export type SquareContent = BoatID | undefined;

export class Square {
  status: SquareStatus;
  content: SquareContent;

  constructor(initialStatus?: SquareStatus) {
    this.status = initialStatus || SquareStatus.Empty;
  }

  miss(): void {
    this.status = SquareStatus.Miss;
  }

  hit(): void {
    this.status = SquareStatus.Hit;
  }

  placeBoat(boat: Boat): void {
    this.status = SquareStatus.Boat;
    this.content = boat.id;
  }

  hasBeenHit(): boolean {
    return this.status === SquareStatus.Hit;
  }

  canBeHit(): boolean {
    return this.status === SquareStatus.Empty || this.hasABoat();
  }

  hasABoat(): boolean {
    return this.status === SquareStatus.Boat && this.content !== undefined;
  }

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
