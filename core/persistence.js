import { gameState, setGameState } from "../data/gameState.js";
/**
 * Game Persistence
 * Handles saving and loading game state to/from localStorage
 */
export class GamePersistence {
    /**
     * Save the current game state to localStorage
     * @returns Whether the save was successful
     */
    static gameSave() {
        try {
            localStorage.setItem(this.SAVE_KEY, JSON.stringify(gameState));
            return true;
        }
        catch (error) {
            console.error("Failed to save game:", error);
            return false;
        }
    }
    /**
     * Load game state from localStorage
     * @returns The loaded game state or null if no save exists or loading failed
     */
    static gameLoad() {
        try {
            const save = localStorage.getItem(this.SAVE_KEY);
            if (save) {
                return JSON.parse(save);
            }
        }
        catch (error) {
            console.error("Failed to load save:", error);
        }
        return null;
    }
    /**
     * Load and apply saved game state
     * @returns Whether a save was successfully loaded and applied
     */
    static loadSavedGame() {
        const loadedSave = this.gameLoad();
        if (loadedSave) {
            setGameState(loadedSave);
            return true;
        }
        return false;
    }
    /**
     * Clear the saved game from localStorage
     * @returns Whether the save was successfully cleared
     */
    static clearSave() {
        try {
            localStorage.removeItem(this.SAVE_KEY);
            return true;
        }
        catch (error) {
            console.error("Failed to clear save:", error);
            return false;
        }
    }
}
GamePersistence.SAVE_KEY = "autosave";
// Export global functions for backward compatibility
export const gameSave = GamePersistence.gameSave.bind(GamePersistence);
export const gameLoad = GamePersistence.gameLoad.bind(GamePersistence);
//# sourceMappingURL=persistence.js.map