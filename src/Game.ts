import { GameEndedError, InvalidGridSizeError } from './errors';
import { GridLocation } from './GridLocation';
import { Player } from './Player';
import { SquareStatus } from './Square';

/**
 * The Game class is holding the two players
 * and has the ability to make them play turn by turn
 */
export class Game {
  /** The size of the grids */
  static GRID_SIZE = 10;

  /** The number of turns since the beginning */
  turnCount = 0;

  /** The two players */
  players: [Player, Player];

  /** Wether or not the game ended (all the boats of a player were hit) */
  private gameEnded = false;

  /**
   * Creates a new Game instance with two players
   */
  public constructor(gridSize = 10) {
    if (gridSize <= 5) {
      throw new InvalidGridSizeError(
        "Can't create a grid that is less than 5x5 squares"
      );
    }

    this.players = [new Player(gridSize), new Player(gridSize)];
  }

  /**
   * @returns True if the game ended
   */
  public ended(): boolean {
    return this.gameEnded;
  }

  /**
   * Setup the game
   */
  public setup(): void {
    // Make the players place their boats on their respective grid
    this.players.forEach((player) => player.placeBoats());
  }

  /**
   * @returns The current player index
   */
  private getCurrentPlayerIndex(): number {
    return this.turnCount % 2;
  }

  /**
   * @returns The current player
   */
  private getCurrentPlayer(): Player {
    return this.players[this.getCurrentPlayerIndex()];
  }

  /**
   * @returns The player who's not its turn
   */
  private getOtherPlayer(): Player {
    return this.players[this.getCurrentPlayerIndex() === 0 ? 1 : 0];
  }

  /**
   * Play a turn if the game has not ended (throw an exception otherwise)
   * One player declare a hit and fill it's own grid and the opponent's one
   */
  public turn(): void {
    if (!this.ended()) {
      const currentPlayer: Player = this.getCurrentPlayer();
      const otherPlayer: Player = this.getOtherPlayer();

      // The player choose the square he's going to hit
      const playerHit: GridLocation = currentPlayer.getHit();

      // Hit at that location
      const hitResult = otherPlayer.grid.hitAt(playerHit);

      // Mark the target grid as hit if the hit was succesfull
      currentPlayer.targetGrid.hitAt(playerHit, hitResult === SquareStatus.Hit);

      // End the game if the other player lost
      if (otherPlayer.didLoose()) {
        this.gameEnded = true;
      }

      this.turnCount++;
    } else {
      throw new GameEndedError();
    }
  }
}
