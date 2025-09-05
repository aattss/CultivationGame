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
   * @param {boolean} cultivates - Whether the character cultivates this year
   */
  static oneYearPass(cultivates) {
    gameState.age += 1;
    gameState.totalYears += 1;

    // Cultivation
    if (cultivates) {
      CultivationSystem.cultivate();
    }

    if (Math.random() < CONSTANTS.LUCKY_ENCOUNTER_TRIGGER) {
      GameLogic.LuckyEncounter();
    }
    GameLogic.tribulation();

    // Qi purity degradation
    if (
      gameState.meridiansOpened < CONSTANTS.MERIDIAN_COUNT ||
      Math.random() <
        Math.pow(
          CONSTANTS.QI_PURITY_DEGRADATION_BASE,
          gameState.circulationSkill +
            gameState.circulationGrade +
            gameState.cyclesCleansed
        )
    ) {
      gameState.qiPurity -= 1;
    }

    // Aging effects
    gameState.vitality += gameState.cyclesCleansed;
    if (
      gameState.age - gameState.shopUpgrades.youthfullness >
      gameState.qiPurity
    ) {
      const loss = gameState.age / Math.max(1, gameState.qiPurity);
      gameState.vitality -= Math.max(Math.ceil(Math.random() * loss - 0.5), 0);
    }

    // Death check
    if (gameState.vitality <= 0 && !gameState.dead) {
      gameState.dead = true;
      gameState.highestMeridian = Math.max(
        gameState.highestMeridian,
        gameState.meridiansOpened
      );
      gameState.highestQiFold = Math.max(
        gameState.highestQiFold,
        gameState.qiFolds
      );
      gameState.highestDantian = Math.max(
        gameState.highestDantian,
        gameState.dantianGrade
      );
      gameState.highestChakra = Math.max(
        gameState.highestChakra,
        gameState.openedChakras
      );
      gameState.highestCycle = Math.max(
        gameState.highestCycle,
        gameState.cyclesCleansed
      );

      // Record current life statistics
      gameState.currentLifeStats.meridiansOpenedAtDeath =
        gameState.meridiansOpened;
      gameState.currentLifeStats.ageAtDeath = gameState.age;
      gameState.currentLifeStats.qiFoldsAtDeath = gameState.qiFolds;

      // Add to life statistics history (keep only last 10)
      gameState.lifeStats.push({ ...gameState.currentLifeStats });
      if (gameState.lifeStats.length > 10) {
        gameState.lifeStats.shift(); // Remove oldest entry
      }
      GameLogic.calculateAverageStats();
      if (gameState.averageLifeStats["meridiansOpenedAtDeath"] < 12) {
        gameState.averageLifeStats["ageAt12thMeridian"] = null;
      }

      gameState.log.push(
        "Life " + gameState.totalLives + ": You died at age " + gameState.age
      );
      gameState.totalLives += 1;
      let pointGain =
        Math.floor(gameState.age / 40) +
        gameState.meridiansOpened * 2 +
        gameState.qiFolds * 4 +
        gameState.pillars * 2 +
        gameState.dantianGrade * 3 +
        gameState.cyclesCleansed * 2 +
        Math.floor(gameState.acupoints / 100);
      gameState.samsaraPoints += pointGain;
    }
  }

  /**
   * Calculate average statistics from recent lives
   */
  static calculateAverageStats() {
    const stats = gameState.lifeStats;
    if (stats.length === 0) return;

    const totals = stats.reduce((acc, life) => {
      Object.entries(life).forEach(([key, value]) => {
        acc[key] = (acc[key] || 0) + value;
      });
      return acc;
    }, {});

    gameState.averageLifeStats = Object.fromEntries(
      Object.entries(totals).map(([key, total]) => [
        key,
        Math.round((10 * total) / stats.length) / 10,
      ])
    );
  }

  /**
   * Handle random lucky encounters based on luck stat
   */
  static LuckyEncounter() {
    if (
      Math.random() <
      CONSTANTS.LUCKY_ENCOUNTER_BASE_CHANCE *
        (Math.log(gameState.luck / 5) / Math.log(2))
    ) {
      let event = Utility.rollOneDice(5, 1);
      let magnitude = Utility.rollOneDice(Math.sqrt(gameState.luck), 1);
      switch (event) {
        case 1:
          gameState.log.push(
            "You came across a spiritual fruit and gained " +
              Math.ceil(
                magnitude * Math.sqrt(CultivationSystem.getCombatPower())
              ) +
              " vitality."
          );
          gameState.vitality += Math.ceil(
            magnitude * Math.sqrt(CultivationSystem.getCombatPower())
          );
          break;
        case 2:
          magnitude = Math.ceil(magnitude / 2);
          gameState.log.push(
            "You came across a marrow cleansing pill and gained " +
              magnitude +
              " purity."
          );
          gameState.qiPurity += magnitude;
          break;
        case 3:
          if (gameState.meridiansOpened >= 12) {
            gameState.log.push(
              "You had an epiphany with your circulation technique."
            );
            gameState.circulationProficiency +=
              gameState.comprehension * magnitude;
          }
          break;
        case 4:
          if (gameState.qi < CultivationSystem.getQiCapacity()) {
            gameState.log.push("You harvested a qi-rich herb.");
            gameState.qi = Math.min(
              CultivationSystem.getQiCapacity(),
              gameState.qi +
                Math.ceil(
                  magnitude *
                    CultivationSystem.getCombatPower() *
                    Utility.rollOneDice(10)
                )
            );
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

  static tribulation() {
    const curPower = CultivationSystem.getCombatPower();
    switch (gameState.age) {
      case 60:
        if (
          curPower <
          Math.random() * 5 - Math.log10(gameState.tribulationFailed[0])
        ) {
          gameState.vitality -= 12;
          gameState.tribulationFailed[0] += 1;
        } else if (
          // eslint-disable-next-line no-dupe-else-if
          curPower <
          Math.random() * 5 - Math.log10(gameState.tribulationFailed[0])
        ) {
          gameState.vitality -= 7;
          gameState.tribulationFailed[0] += 1;
        } else if (curPower > Math.random() * 6) {
          gameState.samsaraPoints += 2;
        }
        if (gameState.vitality <= 0) {
          gameState.log.push(
            "At age 60, your village was robbed by bandits and you died."
          );
        }
        break;
      case 120:
        if (
          curPower <
          3 + Math.random() * 7 - Math.log10(gameState.tribulationFailed[1])
        ) {
          gameState.vitality -= 41;
          gameState.tribulationFailed[1] += 1;
        } else if (
          // eslint-disable-next-line no-dupe-else-if
          curPower <
          3 + Math.random() * 7 - Math.log10(gameState.tribulationFailed[1])
        ) {
          gameState.vitality -= 23;
          gameState.tribulationFailed[1] += 1;
        } else if (curPower > Math.random() * 12) {
          gameState.samsaraPoints += 6;
        }
        if (gameState.vitality <= 0) {
          gameState.log.push("At age 120, a demonic beast slew you.");
        }
        break;
      case 180:
        if (
          curPower <
          5 + Math.random() * 11 - Math.log10(gameState.tribulationFailed[2])
        ) {
          gameState.vitality -= 223;
          gameState.tribulationFailed[2] += 1;
        } else if (
          // eslint-disable-next-line no-dupe-else-if
          curPower <
          5 + Math.random() * 11 - Math.log10(gameState.tribulationFailed[2])
        ) {
          gameState.vitality -= 111;
          gameState.tribulationFailed[2] += 1;
        } else if (curPower > 5 + Math.random() * 15) {
          gameState.samsaraPoints += 24;
        }
        if (gameState.vitality <= 0) {
          gameState.log.push("At age 180, a demonic cultivator slew you.");
        }
        break;
      default:
    }
  }
}
