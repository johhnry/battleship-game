export type BoatID = 1 | 2 | 3 | 4 | 5;

export interface Boat {
  id: BoatID;
  size: number;
}

const Carrier: Boat = { id: 1, size: 5 };
const Battleship: Boat = { id: 2, size: 4 };
const Cruiser: Boat = { id: 3, size: 3 };
const Submarine: Boat = { id: 4, size: 3 };
const Destroyer: Boat = { id: 5, size: 2 };

export { Carrier, Battleship, Cruiser, Submarine, Destroyer };
