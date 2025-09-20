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
   * @returns Total qi capacity
   */
  static getQiCapacity(): number {
    return gameState.meridianCapacity + gameState.dantianGrade * 600 + gameState.acupoints * 5;
  }

  /**
   * Calculate combat power based on various cultivation factors
   * @returns Current combat power
   */
  static getCombatPower(): number {
    const combatPower =
      Math.max(0, Math.log(gameState.vitality) / Math.log(7)) +
      Math.max(0, Math.log10(gameState.qi)) +
      gameState.qiFolds / 1.5 +
      gameState.dantianGrade / 4 +
      Utility.sum(gameState.daoTreasureQuality) / 20;
    return Math.round(combatPower * 10) / 10;
  }

  /**
   * Calculate qi generation rate per cultivation cycle
   * @returns Qi gained per cycle
   */
  static getQiRate(): number {
    return (
      Math.ceil(
        Math.pow(gameState.circulationSkill + 1, 2) * Math.pow(1.7, gameState.circulationGrade) + gameState.vitality / 4
      ) *
      (1 + gameState.dantianGrade)
    );
  }

  /**
   * Attempt to open meridians based on current stats
   */
  static cultivateMeridians(): void {
    let failed = false;
    let combo = 0;
    while (gameState.meridiansOpened < gameState.meridianMax && !failed) {
      const difficulty =
        1.2 *
        (CONSTANTS.MERIDIAN_DIFFICULTY_BASE -
          gameState.meridianTalent[gameState.meridiansOpened] -
          gameState.qiPurity +
          (gameState.meridiansOpened >= CONSTANTS.MERIDIAN_COUNT ? 20 : 0));

      const effective_vitality =
        gameState.vitality -
        Math.max(0, gameState.meridiansOpened - CONSTANTS.MERIDIAN_COUNT) * 10 -
        (gameState.meridiansOpened >= CONSTANTS.MERIDIAN_COUNT ? 12 : 0);
      if (Math.random() * (difficulty + combo * 6) >= effective_vitality) {
        failed = true;
        break;
      }

      if (Math.random() * difficulty < effective_vitality - 8 && Math.random() * difficulty < effective_vitality - 16) {
        gameState.meridianFortune[gameState.meridiansOpened] = true;
      }

      gameState.meridianCapacity += gameState.meridianTalent[gameState.meridiansOpened];

      if (gameState.meridiansOpened > CONSTANTS.MERIDIAN_COUNT) {
        gameState.vitality += 10;
      }
      gameState.meridiansOpened += 1;
      gameState.vitality += 1;
      if (gameState.meridiansOpened == 12) {
        // Track age when 12th meridian is opened
        gameState.currentLifeStats.ageAt12thMeridian = gameState.age;
        Utility.addLogMessage(
          "Life " + gameState.totalLives + ": You opened primary meridians at age " + gameState.age
        );
      }
      combo += 1;
    }
  }

  /**
   * Cultivate circulation technique and generate qi
   */
  static cultivateCirculation(): void {
    gameState.circulationProficiency += Math.pow(gameState.comprehension / 10, 2) * gameState.daoRuneMultiplier;
    const circulationDifficulty =
      CONSTANTS.CIRCULATION_BASE_DIFFICULTY *
      Math.pow(CONSTANTS.CIRCULATION_DIFFICULTY_MULTIPLIER, gameState.circulationSkill);

    if (gameState.circulationProficiency > circulationDifficulty) {
      if (gameState.circulationSkill >= gameState.circulationMemory.length) {
        gameState.circulationMemory.push(0);
      }
      gameState.circulationMemory[gameState.circulationSkill] += 1;
      gameState.circulationProficiency -= circulationDifficulty;
      gameState.circulationSkill += 1;

      if (
        Math.random() * 1000 * (gameState.enlightenment + 1) <
        ((gameState.circulationGrade - gameState.enlightenment) * gameState.wisdom) / 10
      ) {
        gameState.enlightenment += 1;
        gameState.circulationGrade = 1;
        Utility.addLogMessage("You had a glimpse of enlightenment and started over with your cultivation technique.");
      } else if (Math.random() * gameState.circulationGrade * 100 < gameState.wisdom * gameState.circulationSkill) {
        gameState.circulationInsights += 1;
        if (
          gameState.circulationInsights * Math.random() > gameState.circulationGrade &&
          gameState.circulationInsights * Math.random() > gameState.circulationGrade
        ) {
          Utility.addLogMessage("You had an epiphany and evolved your circulation technique.");
          gameState.circulationGrade += 1;
          Utility.addLogMessage("It is now grade " + gameState.circulationGrade);
          gameState.circulationInsights = 0;
        } else {
          Utility.addLogMessage("You had an insight with your circulation technique.");
        }
      }
    }

    gameState.meridianCapacity += gameState.circulationSkill * 2 + gameState.circulationGrade * 3;
    gameState.qi = Math.min(this.getQiCapacity(), gameState.qi + this.getQiRate());
  }

  /**
   * Cultivate organs to improve qi purity
   */
  static cultivateOrgans(): void {
    const qiTransferred = Math.ceil(gameState.qi / 50);
    gameState.qi -= qiTransferred;
    gameState.organProgress += qiTransferred * (1 + gameState.qiPurity / 100);
    const organDifficulty =
      10 *
      (200 +
        100 * Math.pow(gameState.cyclesCleansed, 2) -
        gameState.vitality -
        (gameState.cyclesCleansed + 2) * gameState.organTalent[gameState.organsPurified]);
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
  static formPillar(): void {
    gameState.qi -= CONSTANTS.PILLAR_QI_COST;
    const success = Math.min(6 + 2 * gameState.pillarEx, Math.random() * gameState.qiFolds);
    if (success > 2) {
      gameState.pillars += 1;
      gameState.vitality += Math.floor(success * 8);
      gameState.pillarQuality += Math.floor(success / 2);
      if (gameState.pillarQuality > 8 * (3 + gameState.pillarEx)) {
        gameState.pillarEx += 1;
      }
      if (
        gameState.pillars < 8 + 4 * gameState.shopUpgrades.extraPillars &&
        gameState.qi >= CONSTANTS.PILLAR_QI_COST &&
        Math.random() < 0.8
      ) {
        CultivationSystem.formPillar();
      }
    } else {
      gameState.vitality -= Utility.rollOneDice(15, 5);
    }
  }

  /**
   * Form a dantian with accumulated pillars
   */
  static formDantian(): void {
    let difficulty = CultivationSystem.getDantianDifficulty();
    let cost = 100 * gameState.dantianGrade;
    const foundation = gameState.pillarQuality + gameState.qiFolds;
    while (gameState.dantianRerolls > 0 && difficulty < foundation) {
      gameState.dantianRerolls -= 1;
      difficulty = Utility.rollOneDice(3 * gameState.dantianGrade + 16, 1);
    }
    while (gameState.qi > cost && difficulty < foundation) {
      gameState.qi -= cost;
      gameState.dantianGrade += 1;
      difficulty = CultivationSystem.getDantianDifficulty();
      while (gameState.dantianRerolls > 0 && difficulty < foundation) {
        gameState.dantianRerolls -= 1;
        difficulty = CultivationSystem.getDantianDifficulty();
      }
      cost = 50 * gameState.dantianGrade;
    }
    if (gameState.dantianGrade == 0) {
      Utility.addLogMessage("You failed to form a dantian.");
      gameState.vitality -= Utility.rollOneDice(40, 7);
      gameState.qi -= gameState.qi * Math.random() * 0.8;
    } else {
      gameState.qiPurity += gameState.dantianGrade * 3;
      Utility.addLogMessage(
        "Life " +
          gameState.totalLives +
          ": You formed a grade " +
          gameState.dantianGrade +
          " dantian at age " +
          gameState.age
      );
    }
  }

  static getDantianDifficulty(): number {
    return (
      Utility.rollOneDice(2 * gameState.dantianGrade + 14, 1) -
      Math.max(0, gameState.highestDantian - gameState.dantianGrade) / 5
    );
  }

  /**
   * Cultivate acupoints to increase qi capacity
   */
  static cultivateAcupoints(): void {
    const acupointCost = Math.max(1, 300 + gameState.acupoints - 2 * Math.pow(gameState.qiFolds, 2));
    const acupointsOpened = Math.floor(Math.min(gameState.qi / acupointCost / 3, Math.sqrt(gameState.vitality)));
    gameState.qi -= acupointCost * acupointsOpened;
    gameState.acupoints += acupointsOpened;
  }

  /**
   * Main cultivation function that handles all cultivation activities
   */
  static cultivate(): void {
    if (gameState.meridiansOpened < gameState.meridianMax) {
      this.cultivateMeridians();
    } else if (gameState.qi >= 100) {
      this.cultivateOrgans();
    }

    if (gameState.meridiansOpened >= gameState.meridianMax) {
      this.cultivateCirculation();
    }

    // Check for qi folding
    if (gameState.qi > CONSTANTS.QI_FOLD_THRESHOLD * Math.pow(CONSTANTS.QI_FOLD_MULTIPLIER, gameState.qiFolds)) {
      gameState.qiFolds += 1;
      gameState.qi = Math.ceil(gameState.qi / 2);
      gameState.qiPurity += CONSTANTS.QI_PURITY_BONUS + gameState.circulationGrade;
    }

    if (gameState.qi > CONSTANTS.PILLAR_QI_COST && gameState.qi >= 0.95 * CultivationSystem.getQiCapacity()) {
      if (gameState.pillars < 8 + 4 * gameState.shopUpgrades.extraPillars) {
        if (gameState.cyclesCleansed > 0) {
          this.formPillar();
        } else {
          CultivationSystem.cultivateAcupoints();
        }
      } else if (gameState.dantianGrade == 0) {
        this.formDantian();
      } else {
        CultivationSystem.cultivateChakras();
        CultivationSystem.condenseDaoTreasure();
        CultivationSystem.cultivateAcupoints();
      }
    }
  }

  static cultivateChakras(): void {
    const maxChakras = gameState.shopUpgrades.extraChakras > 0 ? 9 : 7;
    if (gameState.openedChakras == maxChakras) {
      return;
    }
    let cumChakraTalents = 0;
    for (var i = 0; i <= gameState.openedChakras; i++) {
      cumChakraTalents += gameState.chakraTalent[i];
    }
    const chakraCost = 50 * (150 * (gameState.openedChakras + 1) - cumChakraTalents);
    if (gameState.qi > chakraCost) {
      gameState.qi -= chakraCost;
      gameState.wisdom += 1;
      if (Math.random() < Math.pow(gameState.wisdom - gameState.chakraEx[gameState.openedChakras], 2) / 100000) {
        gameState.chakraEx[gameState.openedChakras] += 1;
      }
      gameState.openedChakras += 1;
      gameState.comprehension += Math.ceil(cumChakraTalents / 50);
    }
  }

  /**
   * Gain a random dao rune for cultivation bonus
   */
  static gainRandomDaoRune(): void {
    Utility.addLogMessage("You see a strange symbol in your dreams.");
    gameState.daoRunes[Utility.rollOneDice(9, 0)] = 1;
    gameState.daoRuneMultiplier = Math.pow(2.5, Utility.sum(gameState.daoRunes));
    gameState.seenDaoRune = true;
  }

  static condenseDaoTreasure(): void {
    const treasureCost = 1400 * Math.pow(1.5, gameState.treasureCondenseAttempts);
    if (gameState.qi / 4 > treasureCost) {
      gameState.qi -= treasureCost;
      const quality = Utility.rollOneDice(gameState.comprehension + gameState.treasureCondenseAttempts * 2, 0);
      if (gameState.wisdom / 11 > Math.pow(gameState.daoTreasureQuality.length, 1.2)) {
        gameState.daoTreasureQuality.push(quality);
      } else {
        const minTreasure = Utility.findMinIndex(gameState.daoTreasureQuality);
        if (gameState.daoTreasureQuality[minTreasure] < quality) {
          gameState.daoTreasureQuality[minTreasure] = quality;
        }
      }
    }
  }
}
