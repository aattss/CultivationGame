/**
 * Cultivation Game - Main Entry Point
 * Orchestrates all game modules and handles initialization
 */
import { CONSTANTS } from "./config/constants.js";
import { gameState } from "./data/gameState.js";
import { shopItems } from "./data/shopItems.js";
import { Utility } from "./utils/utility.js";
import { CultivationSystem } from "./mechanics/cultivationSystem.js";
import { GameLogic } from "./logic/gameLogic.js";
import { GameInitializer } from "./logic/gameInitializer.js";
import { UISystem } from "./ui/uiSystem.js";
import { GameLoop } from "./core/gameLoop.js";
import { GamePersistence, gameSave, gameLoad } from "./core/persistence.js";
/**
 * Global function to pause the game
 * Exposed for backward compatibility with existing UI
 */
declare function pauseGame(): void;
/**
 * Global function to reset the save and restart
 * Exposed for backward compatibility with existing UI
 */
declare function resetSave(): void;
declare global {
    interface Window {
        pauseGame: () => void;
        resetSave: () => void;
        gameSave: () => boolean;
        gameLoad: () => any;
        gameState: typeof gameState;
        GameLogic: typeof GameLogic;
        CultivationSystem: typeof CultivationSystem;
        UISystem: typeof UISystem;
        GameLoop: typeof GameLoop;
        GamePersistence: typeof GamePersistence;
    }
}
export { CONSTANTS, gameState, shopItems, Utility, CultivationSystem, GameLogic, GameInitializer, UISystem, GameLoop, GamePersistence, gameSave, gameLoad, pauseGame, resetSave, };
//# sourceMappingURL=index.d.ts.map