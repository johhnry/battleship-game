export type BoatID = 1 | 2 | 3 | 4 | 5;

export interface Boat {
  id: BoatID;
  size: number;
}

export const Carrier: Boat = { id: 1, size: 5 };
export const Battleship: Boat = { id: 2, size: 4 };
export const Cruiser: Boat = { id: 3, size: 3 };
export const Submarine: Boat = { id: 4, size: 3 };
export const Destroyer: Boat = { id: 5, size: 2 };

export const boats: Boat[] = [
  Carrier,
  Battleship,
  Cruiser,
  Submarine,
  Destroyer
];
