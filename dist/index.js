/**
 * Cultivation Game - Main Entry Point
 * Orchestrates all game modules and handles initialization
 */
// Import all modules
import { CONSTANTS } from "./config/constants.js";
import { gameState } from "./data/gameState.js";
import { shopItems } from "./data/shopItems.js";
import { Utility } from "./utils/utility.js";
import { CultivationSystem } from "./mechanics/cultivationSystem.js";
import { GameLogic } from "./logic/gameLogic.js";
import { GameInitializer } from "./logic/gameInitializer.js";
import { UISystem } from "./ui/uiSystem.js";
import { GameLoop } from "./core/gameLoop.js";
import { GamePersistence, gameSave, gameLoad, saveToFile, loadFromFile, } from "./core/persistence.js";
/**
 * Initialize and start the game
 */
function initializeGame() {
    console.log("Initializing Cultivation Game...");
    // Try to load saved game
    const loadedSave = GamePersistence.loadSavedGame();
    if (!loadedSave) {
        // No save found, start a fresh game
        GameInitializer.startGame();
        GameInitializer.startLife();
    }
    // Start the main game loop
    GameLoop.start();
    console.log("Cultivation Game initialized successfully!");
}
/**
 * Global function to pause the game
 * Exposed for backward compatibility with existing UI
 */
function pauseGame() {
    GameLoop.pause();
}
/**
 * Global function to reset the save and restart
 * Exposed for backward compatibility with existing UI
 */
function resetSave() {
    GamePersistence.clearSave();
    GameInitializer.startGame();
    GameInitializer.startLife();
}
function toggleExtraMeridians() {
    gameState.extraMeridiansEnabled = !gameState.extraMeridiansEnabled;
}
/**
 * Global function to save game to file
 * Exposed for HTML onclick handlers
 */
function saveGameToFile() {
    saveToFile();
}
/**
 * Global function to load game from file
 * Exposed for HTML onclick handlers
 */
function loadGameFromFile() {
    loadFromFile();
}
// Make functions globally available for HTML onclick handlers
window.pauseGame = pauseGame;
window.resetSave = resetSave;
window.gameSave = gameSave;
window.gameLoad = gameLoad;
window.saveGameToFile = saveGameToFile;
window.loadGameFromFile = loadGameFromFile;
window.toggleExtraMeridians = toggleExtraMeridians;
// Also expose game classes for debugging/console access
window.gameState = gameState;
window.GameLogic = GameLogic;
window.CultivationSystem = CultivationSystem;
window.UISystem = UISystem;
window.GameLoop = GameLoop;
window.GamePersistence = GamePersistence;
// Initialize the game when the DOM is ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeGame);
}
else {
    initializeGame();
}
// Export modules for potential external use
export { CONSTANTS, gameState, shopItems, Utility, CultivationSystem, GameLogic, GameInitializer, UISystem, GameLoop, GamePersistence, gameSave, gameLoad, pauseGame, resetSave, saveGameToFile, loadGameFromFile, toggleExtraMeridians, };
//# sourceMappingURL=index.js.map