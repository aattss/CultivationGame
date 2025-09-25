import { CONSTANTS } from "../config/constants.js";
import { gameState } from "../data/gameState.js";
import { Utility } from "../utils/utility.js";
import { CultivationSystem } from "../mechanics/cultivationSystem.js";
/**
 * Game Logic
 * Handles core game progression, events, and time passage
 */
export class GameLogic {
    /**
     * Process one year of game time
     * @param cultivates - Whether the character cultivates this year
     */
    static oneYearPass(cultivates) {
        gameState.age += 1;
        gameState.totalYears += 1;
        // Cultivation
        if (cultivates) {
            CultivationSystem.cultivate();
        }
        if (Math.random() / Math.log10(gameState.age + 1) < CONSTANTS.LUCKY_ENCOUNTER_TRIGGER) {
            GameLogic.LuckyEncounter();
        }
        GameLogic.tribulation();
        // Qi purity degradation
        if (gameState.meridiansOpened < gameState.meridianMax ||
            Math.random() <
                Math.pow(CONSTANTS.QI_PURITY_DEGRADATION_BASE, gameState.circulationSkill + gameState.circulationGrade)) {
            gameState.qiPurity -= 1;
        }
        // Aging effects
        gameState.vitality += gameState.cyclesCleansed;
        if (gameState.age - gameState.shopUpgrades.youthfullness > gameState.qiPurity + gameState.longevity) {
            const loss = gameState.age / Math.max(1, gameState.qiPurity + gameState.longevity);
            gameState.vitality -= Math.max(Math.ceil(Math.random() * loss - 0.5), 0);
        }
        // Death check
        if (gameState.vitality <= 0 && !gameState.dead) {
            gameState.dead = true;
            gameState.highestMeridian = Math.max(gameState.highestMeridian, gameState.meridiansOpened);
            gameState.highestQiFold = Math.max(gameState.highestQiFold, gameState.qiFolds);
            gameState.highestDantian = Math.max(gameState.highestDantian, gameState.dantianGrade);
            gameState.highestChakra = Math.max(gameState.highestChakra, gameState.openedChakras);
            gameState.highestCycle = Math.max(gameState.highestCycle, gameState.cyclesCleansed);
            gameState.highestPotential = Math.max(gameState.highestPotential, gameState.potential);
            if (Math.random() / Math.sqrt(gameState.age) < 0.0005 / (1 + gameState.combatEx / 10)) {
                gameState.combatEx += 1;
            }
            if (Math.random() / Math.sqrt(gameState.treasureCondenseAttempts) < 0.005 / (1 + gameState.forgingEx / 10)) {
                gameState.forgingEx += 1;
            }
            // Record current life statistics
            gameState.currentLifeStats.meridiansOpenedAtDeath = gameState.meridiansOpened;
            gameState.currentLifeStats.ageAtDeath = gameState.age;
            gameState.currentLifeStats.qiFoldsAtDeath = gameState.qiFolds;
            gameState.currentLifeStats.chakrasAtDeath = gameState.openedChakras;
            gameState.currentLifeStats.potentialAtDeath = gameState.potential;
            // Add to life statistics history (keep only last 10)
            gameState.lifeStats.push({ ...gameState.currentLifeStats });
            if (gameState.lifeStats.length > 10) {
                gameState.lifeStats.shift(); // Remove oldest entry
            }
            GameLogic.calculateAverageStats();
            if (gameState.averageLifeStats["meridiansOpenedAtDeath"] < 12) {
                gameState.averageLifeStats["ageAt12thMeridian"] = null;
            }
            if (gameState.extraMeridiansEnabled && gameState.averageLifeStats["meridiansOpenedAtDeath"] < 20) {
                gameState.averageLifeStats["ageAt20thMeridian"] = null;
            }
            Utility.addLogMessage("Life " + gameState.totalLives + ": You died at age " + gameState.age);
            gameState.totalLives += 1;
            let pointGain = gameState.age / 30 +
                Math.max(0, (gameState.age - 180) / 20) +
                gameState.meridiansOpened * 2 +
                gameState.qiFolds * 4 +
                gameState.pillars * 3 +
                gameState.dantianGrade * 4 +
                gameState.organsPurified +
                gameState.cyclesCleansed * 5 +
                gameState.openedChakras * 10;
            gameState.samsaraPoints += Math.floor(pointGain);
        }
    }
    /**
     * Calculate average statistics from recent lives
     */
    static calculateAverageStats() {
        const stats = gameState.lifeStats;
        if (stats.length === 0)
            return;
        const totals = stats.reduce((acc, life) => {
            Object.entries(life).forEach(([key, value]) => {
                if (typeof value === "number") {
                    acc[key] = (acc[key] || 0) + value;
                }
            });
            return acc;
        }, {});
        gameState.averageLifeStats = Object.fromEntries(Object.entries(totals).map(([key, total]) => [key, Math.round((10 * total) / stats.length) / 10]));
    }
    /**
     * Handle random lucky encounters based on luck stat
     */
    static LuckyEncounter() {
        if (Math.random() < CONSTANTS.LUCKY_ENCOUNTER_BASE_CHANCE * (Math.log(gameState.luck / 5) / Math.log(2))) {
            let event = Utility.rollOneDice(5, 1);
            let magnitude = Utility.rollOneDice(Math.sqrt(gameState.luck), 1);
            switch (event) {
                case 1:
                    Utility.addLogMessage("You came across a spiritual fruit and gained " +
                        Math.ceil(magnitude * Math.sqrt(CultivationSystem.getCombatPower())) +
                        " vitality.");
                    gameState.vitality += Math.ceil(magnitude * Math.sqrt(CultivationSystem.getCombatPower()));
                    break;
                case 2:
                    magnitude = Math.ceil(magnitude / 2);
                    Utility.addLogMessage("You came across a marrow cleansing pill and gained " + magnitude + " purity.");
                    gameState.qiPurity += magnitude;
                    break;
                case 3:
                    if (gameState.meridiansOpened >= 12) {
                        Utility.addLogMessage("You had an epiphany with your circulation technique.");
                        gameState.circulationProficiency +=
                            Math.pow(gameState.comprehension / 10, 2) *
                                gameState.daoRuneMultiplier *
                                magnitude *
                                Utility.rollOneDice(4, 1);
                    }
                    break;
                case 4:
                    if (gameState.qi < CultivationSystem.getQiCapacity()) {
                        Utility.addLogMessage("You harvested a qi-rich herb.");
                        gameState.qi = Math.min(CultivationSystem.getQiCapacity(), gameState.qi +
                            Math.ceil(magnitude * CultivationSystem.getCombatPower() * Utility.rollOneDice(gameState.luck, 1)));
                    }
                    break;
                case 5:
                    if (Math.random() < 0.05 + Math.log(gameState.wisdom) / 50) {
                        CultivationSystem.gainRandomDaoRune();
                    }
                    break;
            }
        }
    }
    /**
     * Process a single tribulation event
     * @param config The tribulation configuration
     */
    static processTribulation(config) {
        const curPower = CultivationSystem.getCombatPower();
        const failurePenalty = Math.log10(gameState.tribulationFailed[config.tribulationIndex] + 1);
        // First failure check (major failure - double damage)
        const firstThreshold = config.baseDifficulty + Math.random() * config.difficultyRange - failurePenalty;
        if (curPower < firstThreshold) {
            gameState.vitality -= Math.ceil(config.failureDamage * 2 * (0.5 + Math.random() * 1));
            gameState.tribulationFailed[config.tribulationIndex] += 1;
        }
        else {
            // Second failure check (minor failure - normal damage)
            const secondThreshold = config.baseDifficulty + Math.random() * config.difficultyRange - failurePenalty;
            if (curPower < secondThreshold) {
                gameState.vitality -= Math.ceil(config.failureDamage * (0.5 + Math.random() * 1));
                gameState.tribulationFailed[config.tribulationIndex] += 1;
            }
            else {
                // Success check - reroll the threshold again
                const successThreshold = config.baseDifficulty + Math.random() * config.difficultyRange - failurePenalty;
                if (curPower >= successThreshold) {
                    gameState.samsaraPoints += config.samsaraReward;
                    if (gameState.shopUpgrades.longevityUnlocked) {
                        if (config.longevityBonus) {
                            gameState.longevity += config.longevityBonus;
                        }
                        // Trigger bonus lucky encounters
                        const encounterCount = config.bonusLuckyEncounters || 1;
                        for (let i = 0; i < encounterCount; i++) {
                            GameLogic.LuckyEncounter();
                        }
                    }
                }
            }
        }
        // Log death message if player died
        if (gameState.vitality <= 0) {
            Utility.addLogMessage(config.deathMessage);
        }
    }
    /**
     * Handle tribulation events at specific ages
     */
    static tribulation() {
        // Find tribulation config for current age
        const tribulationConfig = this.TRIBULATION_CONFIGS.find((config) => config.age === gameState.age);
        if (tribulationConfig) {
            this.processTribulation(tribulationConfig);
        }
    }
}
/**
 * Configuration for all tribulation events
 */
GameLogic.TRIBULATION_CONFIGS = [
    {
        age: 60,
        baseDifficulty: 0,
        difficultyRange: 5,
        failureDamage: 7,
        samsaraReward: 2,
        longevityBonus: 2,
        bonusLuckyEncounters: 1,
        deathMessage: "At age 60, your village was robbed by bandits and you died.",
        tribulationIndex: 0,
    },
    {
        age: 120,
        baseDifficulty: 3,
        difficultyRange: 7,
        failureDamage: 23,
        samsaraReward: 6,
        longevityBonus: 2,
        bonusLuckyEncounters: 1,
        deathMessage: "At age 120, a demonic beast slew you.",
        tribulationIndex: 1,
    },
    {
        age: 180,
        baseDifficulty: 5,
        difficultyRange: 11,
        failureDamage: 111,
        samsaraReward: 24,
        longevityBonus: 2,
        bonusLuckyEncounters: 1,
        deathMessage: "At age 180, you were slain by a demonic cultivator.",
        tribulationIndex: 2,
    },
    {
        age: 360,
        baseDifficulty: 9,
        difficultyRange: 13,
        failureDamage: 510,
        samsaraReward: 96,
        longevityBonus: 2,
        bonusLuckyEncounters: 2,
        deathMessage: "At age 360, you were imprisoned and executed by a wicked tyrant.",
        tribulationIndex: 3,
    },
    {
        age: 540,
        baseDifficulty: 13,
        difficultyRange: 15,
        failureDamage: 2662,
        samsaraReward: 244,
        longevityBonus: 1,
        bonusLuckyEncounters: 2,
        deathMessage: "At age 540, you were devoured by a demon lord.",
        tribulationIndex: 4,
    },
];
//# sourceMappingURL=gameLogic.js.map