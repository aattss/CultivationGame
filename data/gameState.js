import { CONSTANTS } from "../config/constants.js";
/**
 * Game state management
 * Contains the main game state object and initialization functions
 */
/**
 * Initialize a fresh game state object
 * @returns Fresh game state
 */
export function createInitialGameState() {
    return {
        // Character stats
        age: 0,
        vitality: 0,
        comprehension: 0,
        wisdom: 0,
        luck: 0,
        dead: false,
        startAge: 0,
        // Meridian system
        meridianTalent: Array(12).fill(0),
        meridianCapacity: 0,
        meridiansOpened: 0,
        meridianEx: Array(12).fill(0),
        meridianFortune: Array(12).fill(false),
        // Qi system
        qi: 0,
        qiPurity: CONSTANTS.BASE_QI_PURITY,
        qiFolds: 0,
        // Circulation system
        circulationGrade: 1,
        circulationSkill: 0,
        circulationProficiency: 0,
        circulationMemory: [0],
        circulationInsights: 0,
        daoRunes: Array(9).fill(0),
        daoRuneMultiplier: 1,
        enlightenment: 0,
        // Organ purification system
        organsPurified: 0,
        cyclesCleansed: 0,
        organTalent: Array(5).fill(0),
        organProgress: 0,
        organEx: Array(5).fill(0),
        acupoints: 0,
        // Core Formation system
        pillars: 0,
        pillarQuality: 0,
        dantianGrade: 0,
        dantianRerolls: 0,
        // Chakra System
        openedChakras: 0,
        chakraTalent: Array(7).fill(0),
        // Game settings
        restartOnDeath: true,
        pauseState: false,
        // Progress tracking
        totalYears: 0,
        totalLives: 1,
        highestMeridian: 0,
        highestQiFold: 0,
        highestDantian: 0,
        highestChakra: 0,
        highestCycle: 0,
        log: [],
        samsaraPoints: 0,
        seenBloodline: false,
        seenDaoRune: false,
        tribulationFailed: Array(8).fill(0),
        // Statistics tracking for last 10 lives
        lifeStats: [],
        currentLifeStats: {
            meridiansOpenedAtDeath: 0,
            ageAtDeath: 0,
            qiFoldsAtDeath: 0,
            ageAt12thMeridian: null,
        },
        averageLifeStats: {
            meridiansOpenedAtDeath: 0,
            ageAtDeath: 0,
            qiFoldsAtDeath: 0,
            ageAt12thMeridian: null,
        },
        shopUpgrades: {
            rerollMeridianTalent: 0,
            luckExtraRolls: 0,
            rerollVitality: 0,
            rerollWisdom: 0,
            rerollComprehension: 0,
            youthfullness: 0,
            earlyStart: 0,
            bloodlineReroll: 0,
            dantianReroll: 0,
            daoRuneReroll: 0,
        },
    };
}
// Global game state - will be replaced by loaded save if available
export let gameState = createInitialGameState();
/**
 * Update the global game state reference
 * Used when loading saved games
 * @param newState - The new game state to use
 */
export function setGameState(newState) {
    gameState = newState;
}
//# sourceMappingURL=gameState.js.map