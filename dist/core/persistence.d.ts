import type { GameState } from "../types/gameTypes.js";
/**
 * Game Persistence
 * Handles saving and loading game state to/from localStorage
 */
export declare class GamePersistence {
    static SAVE_KEY: string;
    /**
     * Save the current game state to localStorage
     * @returns Whether the save was successful
     */
    static gameSave(): boolean;
    /**
     * Load game state from localStorage
     * @returns The loaded game state or null if no save exists or loading failed
     */
    static gameLoad(): GameState | null;
    /**
     * Load and apply saved game state
     * @returns Whether a save was successfully loaded and applied
     */
    static loadSavedGame(): boolean;
    /**
     * Clear the saved game from localStorage
     * @returns Whether the save was successfully cleared
     */
    static clearSave(): boolean;
    /**
     * Save the current game state to a downloadable file
     */
    static saveToFile(): void;
    /**
     * Load game state from a file
     * This function creates a file input element and handles the file selection
     */
    static loadFromFile(): void;
}
export declare const gameSave: typeof GamePersistence.gameSave;
export declare const gameLoad: typeof GamePersistence.gameLoad;
export declare const saveToFile: typeof GamePersistence.saveToFile;
export declare const loadFromFile: typeof GamePersistence.loadFromFile;
//# sourceMappingURL=persistence.d.ts.map