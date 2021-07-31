abstract class HitError extends Error {}
export class BoatAlreadyHitError extends HitError {}
export class SquareAlreadyMissError extends HitError {}
export class InvalidSquareError extends HitError {}

// Grid errors
export class BoatPlacementError extends Error {}
export class InvalidBoatLocationError extends Error {}
export class InvalidGridSizeError extends Error {}
export class NoMoreFreeLocationOnTheGridError extends Error {}
export class NoMoreAvailableBoatPlacementError extends Error {}

// Game errors
export class GameEndedError extends Error {}
