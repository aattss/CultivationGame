import { CONSTANTS } from "../config/constants.js";
import { gameState } from "../data/gameState.js";
import { GameInitializer } from "../logic/gameInitializer.js";
import { GameLogic } from "../logic/gameLogic.js";
import { UISystem } from "../ui/uiSystem.js";
import { Utility } from "../utils/utility.js";

/**
 * Game Loop
 * Handles the main game loop and timing
 */
export class GameLoop {
  static intervalId: number | null = null;

  /**
   * Start the main game loop
   */
  static start(): void {
    // Clear any existing interval
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.intervalId = window.setInterval(() => {
      try {
        if (gameState.dead) {
          if (gameState.restartOnDeath) {
            GameInitializer.startLife();
          } else {
            gameState.pauseState = true;
          }
          return;
        }

        if (gameState.pauseState) {
          return;
        }

        GameLogic.oneYearPass(true);
        UISystem.refreshClient();
      } catch (error) {
        console.log("Error in game loop:", error);
      }
    }, CONSTANTS.GAME_TICK_INTERVAL);
  }

  /**
   * Pause the game loop
   */
  static pause(): void {
    gameState.pauseState = !gameState.pauseState;
  }
}
