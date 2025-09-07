import { gameState, setGameState, createInitialGameState, } from "../data/gameState.js";
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
            setGameState(createInitialGameState());
            return true;
        }
        catch (error) {
            console.error("Failed to clear save:", error);
            return false;
        }
    }
    /**
     * Save the current game state to a downloadable file
     */
    static saveToFile() {
        try {
            const saveData = JSON.stringify(gameState, null, 2);
            const filename = `cultivation-save-${new Date().toISOString().split("T")[0]}.json`;
            const blob = new Blob([saveData], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = Object.assign(document.createElement("a"), {
                href: url,
                download: filename,
                style: { display: "none" },
            });
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            console.log(`Game saved to file: ${filename}`);
        }
        catch (error) {
            console.error("Failed to save game to file:", error);
            alert("Failed to save game to file. Please try again.");
        }
    }
    /**
     * Load game state from a file
     * This function creates a file input element and handles the file selection
     */
    static loadFromFile() {
        try {
            // Create file input element
            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.accept = ".json";
            fileInput.style.display = "none";
            fileInput.onchange = (event) => {
                const target = event.target;
                const file = target.files?.[0];
                if (!file) {
                    return;
                }
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const saveData = e.target?.result;
                        const loadedState = JSON.parse(saveData);
                        // Validate that this looks like a valid game state
                        if (typeof loadedState === "object" && loadedState !== null) {
                            setGameState(loadedState);
                            console.log("Game loaded from file successfully!");
                            alert("Game loaded successfully!");
                        }
                        else {
                            throw new Error("Invalid save file format");
                        }
                    }
                    catch (parseError) {
                        console.error("Failed to parse save file:", parseError);
                        alert("Failed to load save file. The file may be corrupted or invalid.");
                    }
                };
                reader.onerror = () => {
                    console.error("Failed to read file");
                    alert("Failed to read the save file. Please try again.");
                };
                reader.readAsText(file);
            };
            // Trigger file selection dialog
            document.body.appendChild(fileInput);
            fileInput.click();
            document.body.removeChild(fileInput);
        }
        catch (error) {
            console.error("Failed to load game from file:", error);
            alert("Failed to load game from file. Please try again.");
        }
    }
}
GamePersistence.SAVE_KEY = "autosave";
// Export global functions for backward compatibility
export const gameSave = GamePersistence.gameSave.bind(GamePersistence);
export const gameLoad = GamePersistence.gameLoad.bind(GamePersistence);
export const saveToFile = GamePersistence.saveToFile.bind(GamePersistence);
export const loadFromFile = GamePersistence.loadFromFile.bind(GamePersistence);
//# sourceMappingURL=persistence.js.map