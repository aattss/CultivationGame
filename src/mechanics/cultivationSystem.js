import { CONSTANTS } from "../config/constants.js";
import { gameState } from "../data/gameState.js";
import { Utility } from "../utils/utility.js";

/**
 * Cultivation System
 * Handles all cultivation mechanics including meridians, qi, organs, pillars, and dantian
 */
export class CultivationSystem {
  /**
   * Calculate the current qi capacity based on various factors
   * @returns {number} Total qi capacity
   */
  static getQiCapacity() {
    return (
      gameState.meridianCapacity +
      gameState.dantianGrade * 400 +
      gameState.acupoints * 5
    );
  }

  /**
   * Calculate combat power based on various cultivation factors
   * @returns {number} Current combat power
   */
  static getCombatPower() {
    const combatPower =
      Math.max(0, Math.log(gameState.vitality) / Math.log(7)) +
      Math.max(0, Math.log10(gameState.qi)) +
      gameState.qiFolds / 1.5 +
      gameState.dantianGrade / 4;
    return Math.round(combatPower * 10) / 10;
  }

  /**
   * Calculate qi generation rate per cultivation cycle
   * @returns {number} Qi gained per cycle
   */
  static getQiRate() {
    return (
      Math.ceil(
        Math.pow(gameState.circulationSkill + 1, 2) *
          Math.pow(1.7, gameState.circulationGrade) +
          gameState.vitality / 4
      ) *
      (1 + gameState.dantianGrade)
    );
  }

  /**
   * Attempt to open meridians based on current stats
   */
  static cultivateMeridians() {
    let failed = false;
    let combo = 0;
    while (gameState.meridiansOpened < CONSTANTS.MERIDIAN_COUNT && !failed) {
      const difficulty =
        1.2 *
        (CONSTANTS.MERIDIAN_DIFFICULTY_BASE -
          gameState.meridianTalent[gameState.meridiansOpened] -
          gameState.qiPurity);

      if (Math.random() * (difficulty + combo * 5) >= gameState.vitality) {
        failed = true;
        break;
      }

      if (
        Math.random() * difficulty < gameState.vitality - 8 &&
        Math.random() * difficulty < gameState.vitality - 16
      ) {
        gameState.meridianFortune[gameState.meridiansOpened] = true;
      }

      gameState.meridianCapacity +=
        gameState.meridianTalent[gameState.meridiansOpened];

      gameState.meridiansOpened += 1;
      gameState.vitality += 1;
      if (gameState.meridiansOpened == 12) {
        // Track age when 12th meridian is opened
        gameState.currentLifeStats.ageAt12thMeridian = gameState.age;
        gameState.log.push(
          "Life " +
            gameState.totalLives +
            ": You opened primary meridians at age " +
            gameState.age
        );
      }
      combo += 1;
    }
  }

  /**
   * Cultivate circulation technique and generate qi
   */
  static cultivateCirculation() {
    gameState.circulationProficiency +=
      gameState.comprehension * gameState.daoRuneMultiplier;
    const circulationDifficulty =
      CONSTANTS.CIRCULATION_BASE_DIFFICULTY *
      Math.pow(
        CONSTANTS.CIRCULATION_DIFFICULTY_MULTIPLIER,
        gameState.circulationSkill
      );

    if (gameState.circulationProficiency > circulationDifficulty) {
      if (gameState.circulationSkill >= gameState.circulationMemory.length) {
        gameState.circulationMemory.push(0);
      }
      gameState.circulationMemory[gameState.circulationSkill] += 1;
      gameState.circulationProficiency -= circulationDifficulty;
      gameState.circulationSkill += 1;

      if (
        Math.random() * 500 * (gameState.enlightenment + 1) <
        gameState.enlightenment - gameState.circulationGrade
      ) {
        gameState.enlightenment += 1;
        gameState.circulationGrade = 1;
        gameState.log.push(
          "You had a glimpse of enlightenment and started over with your cultivaiton technique."
        );
      } else if (
        Math.random() * gameState.circulationGrade * 100 <
        gameState.wisdom * gameState.circulationSkill
      ) {
        gameState.circulationInsights += 1;
        if (
          gameState.circulationInsights * Math.random() >
          gameState.circulationGrade
        ) {
          gameState.log.push(
            "You had an epiphany and evolved your circulation technique."
          );
          gameState.circulationGrade += 1;
          gameState.log.push("It is now grade " + gameState.circulationGrade);
          gameState.circulationInsights = 0;
        } else {
          gameState.log.push(
            "You had an insight with your circulation technique."
          );
        }
      }
    }

    gameState.meridianCapacity +=
      gameState.circulationSkill * 2 + gameState.circulationGrade * 3;
    gameState.qi = Math.min(
      this.getQiCapacity(),
      gameState.qi + this.getQiRate()
    );
  }

  /**
   * Cultivate organs to improve qi purity
   */
  static cultivateOrgans() {
    const qiTransferred = Math.ceil(gameState.qi / 50);
    gameState.qi -= qiTransferred;
    gameState.organProgress += qiTransferred * (1 + gameState.qiPurity / 100);
    const organDifficulty =
      10 *
      (200 +
        100 * Math.pow(gameState.cyclesCleansed, 2) -
        gameState.vitality -
        (gameState.cyclesCleansed + 2) *
          gameState.organTalent[gameState.organsPurified]);
    if (gameState.organProgress > organDifficulty) {
      gameState.organProgress -= organDifficulty;
      gameState.organsPurified += 1;
      gameState.qiPurity += 2 + gameState.cyclesCleansed;
      if (gameState.organsPurified == 5) {
        gameState.organsPurified = 0;
        gameState.cyclesCleansed += 1;
      }
    }
  }

  /**
   * Form a cultivation pillar
   */
  static formPillar() {
    gameState.qi -= CONSTANTS.PILLAR_QI_COST;
    const success = Math.min(6, Math.random() * gameState.qiFolds);
    if (success > 2) {
      gameState.pillars += 1;
      gameState.vitality += Math.floor(success * 4);
      gameState.pillarQuality += Math.floor(success / 2);
      if (gameState.pillars < 8 && gameState.qi >= CONSTANTS.PILLAR_QI_COST) {
        CultivationSystem.formPillar();
      }
    } else {
      gameState.vitality -= Utility.rollOneDice(16, 7);
    }
  }

  /**
   * Form a dantian with accumulated pillars
   */
  static formDantian() {
    let difficulty = Utility.rollOneDice(3 * gameState.dantianGrade + 16, 1);
    let cost = 100 * gameState.dantianGrade;
    const foundation = gameState.pillarQuality + gameState.qiFolds;
    while (
      gameState.dantianRerolls > 0 &&
      difficulty -
        Math.max(0, gameState.highestDantian - gameState.dantianGrade) / 10 <
        foundation
    ) {
      gameState.dantianRerolls -= 1;
      difficulty = Utility.rollOneDice(3 * gameState.dantianGrade + 16, 1);
    }
    while (
      gameState.qi > cost &&
      difficulty -
        Math.max(0, gameState.highestDantian - gameState.dantianGrade) / 10 <
        foundation
    ) {
      gameState.qi -= cost;
      gameState.dantianGrade += 1;
      difficulty = Math.random() * (gameState.dantianGrade + 12);
      while (gameState.dantianRerolls > 0 && difficulty < foundation) {
        gameState.dantianRerolls -= 1;
        difficulty = Utility.rollOneDice(2 * gameState.dantianGrade + 14, 1);
      }
      cost = 50 * gameState.dantianGrade;
    }
    if (gameState.dantianGrade == 0) {
      gameState.log.push("You failed to form a dantian.");
      gameState.vitality -= Utility.rollOneDice(40, 7);
      gameState.qi -= gameState.qi * Math.random() * 0.8;
    } else {
      gameState.qiPurity += gameState.dantianGrade * 3;
      gameState.log.push(
        "Life " +
          gameState.totalLives +
          ": You formed a grade " +
          gameState.dantianGrade +
          " dantian at age " +
          gameState.age
      );
    }
  }

  /**
   * Cultivate acupoints to increase qi capacity
   */
  static cultivateAcupoints() {
    const acupointCost = Math.max(
      1,
      150 + gameState.acupoints - Math.pow(gameState.qiFolds, 2)
    );
    const acupointsOpened = Math.floor(
      Math.min(
        gameState.qi / acupointCost / 3,
        Math.sqrt(gameState.vitality) * acupointCost
      )
    );
    gameState.qi -= acupointCost * acupointsOpened;
    gameState.acupoints += acupointsOpened;
  }

  /**
   * Main cultivation function that handles all cultivation activities
   */
  static cultivate() {
    if (gameState.meridiansOpened < CONSTANTS.MERIDIAN_COUNT) {
      this.cultivateMeridians();
    } else if (gameState.qi >= 100) {
      this.cultivateOrgans();
    }

    if (gameState.meridiansOpened >= CONSTANTS.MERIDIAN_COUNT) {
      this.cultivateCirculation();
    }

    // Check for qi folding
    if (
      gameState.qi >
      CONSTANTS.QI_FOLD_THRESHOLD *
        Math.pow(CONSTANTS.QI_FOLD_MULTIPLIER, gameState.qiFolds)
    ) {
      gameState.qiFolds += 1;
      gameState.qi = Math.ceil(gameState.qi / 2);
      gameState.qiPurity +=
        CONSTANTS.QI_PURITY_BONUS + gameState.circulationGrade;
    }

    if (
      gameState.qi > CONSTANTS.PILLAR_QI_COST &&
      gameState.qi >= 0.95 * CultivationSystem.getQiCapacity()
    ) {
      if (gameState.pillars < 8) {
        this.formPillar();
      } else if (gameState.dantianGrade == 0) {
        this.formDantian();
      } else {
        CultivationSystem.cultivateChakras();
        CultivationSystem.cultivateAcupoints();
      }
    }
  }

  static cultivateChakras() {
    let chakraCost = 0;
    if (gameState.openedChakras == 7) {
      return;
    }
    for (var i = 0; i <= gameState.openedChakras; i++) {
      chakraCost += 50 * (150 - gameState.chakraTalent[i]);
    }
    if (gameState.qi > chakraCost) {
      gameState.qi -= chakraCost;
      gameState.openedChakras += 1;
      gameState.comprehension += 1 + gameState.openedChakras;
      gameState.wisdom += 1;
    }
  }

  /**
   * Gain a random dao rune for cultivation bonus
   */
  static gainRandomDaoRune() {
    gameState.log.push("You see a strange symbol in your dreams.");
    gameState.daoRunes[Utility.rollOneDice(9, 0)] = 1;
    gameState.daoRuneMultiplier = Math.pow(
      2.5,
      Utility.sum(gameState.daoRunes)
    );
    gameState.seenDaoRune = true;
  }
}
