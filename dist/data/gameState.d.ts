import type { GameState } from "../types/gameTypes.js";
/**
 * Game state management
 * Contains the main game state object and initialization functions
 */
/**
 * Initialize a fresh game state object
 * @returns Fresh game state
 */
export declare function createInitialGameState(): GameState;
export declare let gameState: GameState;
/**
 * Update the global game state reference
 * Used when loading saved games
 * @param newState - The new game state to use
 */
export declare function setGameState(newState: GameState): void;
//# sourceMappingURL=gameState.d.ts.map