// Hit errors
abstract class HitError extends Error {}
export class BoatAlreadyHitError extends HitError {}
export class SquareAlreadyMissError extends HitError {}
export class InvalidSquareError extends HitError {}

export class BoatPlacementError extends Error {}
export class InvalidBoatLocationError extends Error {}
export class InvalidGridSizeError extends Error {}
export class NoMoreFreeLocationOnTheGridError extends Error {}
export class NoMoreAvailableBoatPlacementError extends Error {}

// Square errors
export class SquareMissError extends Error {}
export class SquareHitError extends Error {}

// Game errors
export class GameEndedError extends Error {}
