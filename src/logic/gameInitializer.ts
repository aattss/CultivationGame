import { CONSTANTS } from "../config/constants.js";
import { gameState } from "../data/gameState.js";
import { Utility } from "../utils/utility.js";
import { CultivationSystem } from "../mechanics/cultivationSystem.js";
import { GameLogic } from "./gameLogic.js";
import { UISystem } from "../ui/uiSystem.js";
import { gameSave } from "../core/persistence.js";

/**
 * Game Initializer
 * Handles game startup and new life initialization
 */
export class GameInitializer {
  /**
   * Initialize a completely new game
   */
  static startGame(): void {
    gameState.meridianEx = Array(CONSTANTS.MERIDIAN_COUNT + CONSTANTS.EXTRAORDINARY_MERIDIANS).fill(0);
    gameState.meridianFortune = Array(CONSTANTS.MERIDIAN_COUNT + CONSTANTS.EXTRAORDINARY_MERIDIANS).fill(false);
    gameState.extraMeridiansEnabled = false;
    gameState.organEx = Array(gameState.organEx.length).fill(0);
    Utility.addLogMessage("You began your journey");
  }

  /**
   * Start a new life cycle with fresh stats and progression
   */
  static startLife(): void {
    if (gameState.extraMeridiansEnabled) {
      gameState.meridianMax = CONSTANTS.MERIDIAN_COUNT + CONSTANTS.EXTRAORDINARY_MERIDIANS;
    } else {
      gameState.meridianMax = CONSTANTS.MERIDIAN_COUNT;
    }
    // Reset life stats
    gameState.meridianCapacity = 0;
    gameState.meridiansOpened = 0;
    gameState.qi = 0;
    gameState.qiPurity = CONSTANTS.BASE_QI_PURITY + Utility.rollOneDice(gameState.highestQiFold);
    gameState.circulationSkill = 0;
    gameState.circulationProficiency = 0;
    gameState.qiFolds = 0;
    gameState.pillars = 0;
    gameState.pillarQuality = 0;
    gameState.dantianGrade = 0;
    gameState.longevity = 0;
    gameState.daoRunes = gameState.daoRunes.map((value) => (Math.random() < 0.5 ? 0 : value));
    gameState.daoRuneMultiplier = Math.pow(2.5, Utility.sum(gameState.daoRunes));
    gameState.dead = false;
    gameState.dantianRerolls = gameState.shopUpgrades.dantianReroll;
    gameState.organsPurified = 0;
    gameState.cyclesCleansed = 0;
    gameState.organProgress = 0;
    gameState.acupoints = 0;

    // Reset current life statistics
    gameState.currentLifeStats = {
      meridiansOpenedAtDeath: 0,
      ageAtDeath: 0,
      qiFoldsAtDeath: 0,
      ageAt12thMeridian: null,
    };

    gameState.daoTreasureQuality = [];
    gameState.treasureCondenseAttempts = 0;

    // Generate random stats
    this._generateOrganTalents();
    this._generateChakraTalents();
    this._generateRandomStats();
    this._generateMeridianTalents();
    this._calculateStartAge();
    this._simulateEarlyYears();

    UISystem.refreshClientNewLife();

    // Save the game state
    gameSave();
  }

  /**
   * Generate random character stats with bonuses from previous achievements
   * @private
   */
  static _generateRandomStats(): void {
    // Vitality with bonus from previous achievements
    gameState.vitality = Utility.rollDice(10, 1, 2, gameState.shopUpgrades.rerollVitality);
    gameState.vitality += Utility.rollOneDice(gameState.highestMeridian / 6);
    gameState.vitality += Utility.rollOneDice(gameState.highestCycle);

    if (Utility.rollDice(100, 1, 1, gameState.shopUpgrades.bloodlineReroll) == 100) {
      Utility.addLogMessage("You awakened a special bloodline.");
      gameState.vitality += Utility.rollDice(10, 1, 2, 1);
      const organEnhanced = Utility.rollOneDice(5, 0);
      gameState.organTalent[organEnhanced] += Utility.rollOneDice(100, 1);
      gameState.seenBloodline = true;
      if (gameState.organEx[organEnhanced] == 0) {
        gameState.organEx[organEnhanced] += 1;
      }
    }
    if (Utility.rollDice(100, 1, 1, gameState.shopUpgrades.daoRuneReroll) == 100) {
      CultivationSystem.gainRandomDaoRune();
    }

    // Comprehension with memory bonus
    gameState.comprehension = Utility.rollDice(10, 1, 2, gameState.shopUpgrades.rerollComprehension);
    for (let i = 0; i < gameState.circulationMemory.length; i++) {
      if (gameState.circulationMemory[i] > 10) {
        gameState.comprehension += Utility.rollOneDice(Math.log10(gameState.circulationMemory[i] / 10));
      }
    }
    gameState.comprehension += Utility.rollOneDice(gameState.highestMeridian, 0);

    // Wisdom with experience bonus
    gameState.wisdom = Utility.rollDice(10, 1, 2, gameState.shopUpgrades.rerollWisdom);
    gameState.wisdom += Math.floor(Math.sqrt(gameState.totalYears / 100));
    gameState.wisdom += gameState.enlightenment;

    gameState.luck = 0;
    let rolls = 1 + gameState.shopUpgrades.luckExtraRolls;
    while (rolls > 0) {
      let luckRoll = Utility.rollOneDice(10, 1);
      gameState.luck += luckRoll;
      if (luckRoll < 10) {
        rolls -= 1;
      }
    }
  }

  /**
   * Generate meridian talents with fortune rerolls and upgrades
   * @private
   */
  static _generateMeridianTalents(): void {
    gameState.meridianTalent = Array.from({ length: gameState.meridianMax }, () => Utility.rollOneDice(100, 1));

    // Apply fortune rerolls
    gameState.meridianTalent.forEach((talent, index) => {
      if (gameState.meridianFortune[index]) {
        const reroll = Utility.rollOneDice(100, 1);
        gameState.meridianTalent[index] = Math.max(talent, reroll);
      }
    });

    for (let i = 0; i < gameState.shopUpgrades.rerollMeridianTalent; i++) {
      const minMeridian = Utility.findMinIndex(gameState.meridianTalent);
      const reroll = Utility.rollOneDice(100, 1);
      if (reroll > gameState.meridianTalent[minMeridian]) {
        gameState.meridianTalent[minMeridian] = reroll;
      }
    }

    gameState.meridianTalent.forEach((talent, index) => {
      if (talent == 100) {
        if (gameState.meridianEx[index] == 0) {
          gameState.meridianEx[index] += 3;
        } else {
          gameState.meridianEx[index] += 1;
        }
      }
      gameState.meridianTalent[index] += gameState.meridianEx[index];
    });
  }

  /**
   * Generate organ talents for purification system
   * @private
   */
  static _generateOrganTalents(): void {
    gameState.organTalent = Array.from({ length: 5 }, () => Utility.rollOneDice(100, 1));
    for (let i = 0; i < gameState.shopUpgrades.organTalentReroll; i++) {
      const minOrgan = Utility.findMinIndex(gameState.organTalent);
      const reroll = Utility.rollOneDice(100, 1);
      if (reroll > gameState.organTalent[minOrgan]) {
        gameState.organTalent[minOrgan] = reroll;
      }
    }
    gameState.organTalent.forEach((talent, index) => {
      gameState.organTalent[index] += gameState.organEx[index];
    });
  }

  /**
   * Generate chakra talents for chakra system
   * @private
   */
  static _generateChakraTalents(): void {
    const chakraCount = gameState.shopUpgrades.extraChakras > 0 ? 9 : 7;
    gameState.chakraTalent = Array.from({ length: chakraCount }, () => Utility.rollOneDice(100, 1));
    for (let i = 0; i < gameState.shopUpgrades.chakraTalentReroll; i++) {
      const minChakra = Utility.findMinIndex(gameState.chakraTalent);
      const reroll = Utility.rollOneDice(100, 1);
      if (reroll > gameState.chakraTalent[minChakra]) {
        gameState.chakraTalent[minChakra] = reroll;
      }
    }

    gameState.chakraTalent.forEach((_talent, index) => {
      gameState.chakraTalent[index] += gameState.chakraEx[index];
    });
  }

  /**
   * Calculate the starting age based on wisdom
   * @private
   */
  static _calculateStartAge(): void {
    gameState.startAge = CONSTANTS.BASE_AGE - Math.max(Math.ceil(Math.log(gameState.wisdom / 15) / Math.log(1.5)), 0);
    gameState.startAge -= gameState.shopUpgrades.earlyStart;
    gameState.startAge = Math.max(gameState.startAge, 0);
  }

  /**
   * Simulate early years before cultivation starts
   * @private
   */
  static _simulateEarlyYears(): void {
    for (gameState.age = 0; gameState.age < gameState.startAge; gameState.age++) {
      GameLogic.oneYearPass(false);
    }
  }
}
