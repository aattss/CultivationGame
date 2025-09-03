import { CONSTANTS } from "../config/constants.js";
import { gameState } from "../data/gameState.js";
import { GameInitializer } from "../logic/gameInitializer.js";
import { GameLogic } from "../logic/gameLogic.js";
import { UISystem } from "../ui/uiSystem.js";

/**
 * Game Loop
 * Handles the main game loop and timing
 */
export class GameLoop {
  static intervalId = null;

  /**
   * Start the main game loop
   */
  static start() {
    // Clear any existing interval
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.intervalId = window.setInterval(() => {
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
    }, CONSTANTS.GAME_TICK_INTERVAL);
  }

  /**
   * Pause the game loop
   */
  static pause() {
    gameState.pauseState = !gameState.pauseState;
  }
}
