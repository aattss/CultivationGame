// ===== CONSTANTS =====
const CONSTANTS = {
  MERIDIAN_COUNT: 12,
  BASE_AGE: 18,
  BASE_QI_PURITY: 100,
  MERIDIAN_DIFFICULTY_BASE: 200,
  QI_FOLD_THRESHOLD: 100,
  QI_FOLD_MULTIPLIER: 2,
  QI_PURITY_BONUS: 2,
  CIRCULATION_BASE_DIFFICULTY: 10,
  CIRCULATION_DIFFICULTY_MULTIPLIER: 9,
  GAME_TICK_INTERVAL: 1000,
  LUCKY_ENCOUNTER_BASE_CHANCE: 0.05,
  LUCKY_ENCOUNTER_TRIGGER: 0.1,
  QI_PURITY_DEGRADATION_BASE: 0.96,
  LOG_MAX_LENGTH: 1000,
};

// ===== GAME STATE =====
var gameState = {
  // Character stats
  age: 0,
  vitality: 0,
  comprehension: 0,
  wisdom: 0,
  luck: 0,
  dead: false,
  startAge: 0,

  // Meridian system
  meridianTalent: [],
  meridianCapacity: 0,
  meridiansOpened: 0,
  meridianEx: [],
  meridianFortune: [],

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

  // Core Formation system
  pillars: 0,
  pillarQuality: 0,
  dantianGrade: 0,
  dantianRerolls: 0,

  // Game settings
  restartOnDeath: true,
  pauseState: false,

  // Progress tracking
  totalYears: 0,
  totalLives: 1,
  highestMeridian: 0,
  highestQiFold: 0,
  highestDantian: 0,
  log: [],
  samsaraPoints: 0,
  seenBloodline: false,
  seenDaoRune: false,

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

var shopItems = {
  meridianOneReroll: {
    name: "Reroll One Meridian",
    price: 150,
    condition: function () {
      return gameState.shopUpgrades.rerollMeridianTalent == 0;
    },
    effect: function () {
      gameState.shopUpgrades.rerollMeridianTalent = 1;
    },
  },
  meridianSecondReroll: {
    name: "Additional Meridian Reroll",
    price: 500,
    condition: function () {
      return gameState.shopUpgrades.rerollMeridianTalent == 1;
    },
    effect: function () {
      gameState.shopUpgrades.rerollMeridianTalent = 2;
    },
  },
  meridianThirdReroll: {
    name: "Additional Meridian Reroll",
    price: 3000,
    condition: function () {
      return gameState.shopUpgrades.rerollMeridianTalent == 2;
    },
    effect: function () {
      gameState.shopUpgrades.rerollMeridianTalent = 3;
    },
  },
  vitalityReroll: {
    name: "Vitality 2 Dice -> B2o3",
    price: 600,
    condition: function () {
      return gameState.shopUpgrades.rerollVitality == 0;
    },
    effect: function () {
      gameState.shopUpgrades.rerollVitality = 1;
    },
  },
  comprehensionReroll: {
    name: "Comprehension 2 Dice -> B2o3",
    price: 1200,
    condition: function () {
      return (
        gameState.shopUpgrades.rerollComprehension == 0 &&
        gameState.highestMeridian >= 12
      );
    },
    effect: function () {
      gameState.shopUpgrades.rerollComprehension = 1;
    },
  },
  wisdomReroll: {
    name: "Wisdom 2 Dice -> B2o3",
    price: 1600,
    condition: function () {
      return gameState.shopUpgrades.rerollWisdom == 0;
    },
    effect: function () {
      gameState.shopUpgrades.rerollWisdom = 1;
    },
  },
  luckRoll: {
    name: "Additional Luck Dice",
    price: 350,
    condition: function () {
      return gameState.shopUpgrades.luckExtraRolls == 0;
    },
    effect: function () {
      gameState.shopUpgrades.luckExtraRolls = 1;
    },
  },
  secondLuckRoll: {
    name: "Another Luck Dice",
    price: 1300,
    condition: function () {
      return gameState.shopUpgrades.luckExtraRolls == 1;
    },
    effect: function () {
      gameState.shopUpgrades.luckExtraRolls = 2;
    },
  },
  youthfullnessOne: {
    name: "Delay Aging",
    price: 100,
    condition: function () {
      return gameState.shopUpgrades.youthfullness == 0;
    },
    effect: function () {
      gameState.shopUpgrades.youthfullness = 3;
    },
  },
  youthfullnessTwo: {
    name: "Delay Aging Some More",
    price: 400,
    condition: function () {
      return gameState.shopUpgrades.youthfullness == 3;
    },
    effect: function () {
      gameState.shopUpgrades.youthfullness = 6;
    },
  },
  precociousOne: {
    name: "Start Cultivating Sooner",
    price: 1000,
    condition: function () {
      return gameState.shopUpgrades.earlyStart == 0;
    },
    effect: function () {
      gameState.shopUpgrades.earlyStart = 1;
    },
  },
  precociousTwo: {
    name: "Start Cultivating Even Earlier",
    price: 10000,
    condition: function () {
      return gameState.shopUpgrades.earlyStart == 1;
    },
    effect: function () {
      gameState.shopUpgrades.earlyStart = 2;
    },
  },
  bloodlineOneReroll: {
    name: "Additional Bloodline Chance",
    price: 1100,
    condition: function () {
      return (
        gameState.shopUpgrades.bloodlineReroll == 0 && gameState.seenBloodline
      );
    },
    effect: function () {
      gameState.shopUpgrades.bloodlineReroll = 1;
    },
  },
  bloodlineSecondReroll: {
    name: "Another Additional Bloodline Chance",
    price: 3300,
    condition: function () {
      return gameState.shopUpgrades.bloodlineReroll == 1;
    },
    effect: function () {
      gameState.shopUpgrades.bloodlineReroll = 2;
    },
  },
  daoRuneOneReroll: {
    name: "Additional Dao Rune Chance",
    price: 2500,
    condition: function () {
      return gameState.shopUpgrades.daoRuneReroll == 0 && gameState.seenDaoRune;
    },
    effect: function () {
      gameState.shopUpgrades.daoRuneReroll = 1;
    },
  },
  daoRuneSecondReroll: {
    name: "Another Additional Dao Rune Chance",
    price: 9900,
    condition: function () {
      return gameState.shopUpgrades.daoRuneReroll == 1;
    },
    effect: function () {
      gameState.shopUpgrades.daoRuneReroll = 2;
    },
  },
  dantianOneReroll: {
    name: "Additional Chance In Dantian Formation",
    price: 2200,
    condition: function () {
      return (
        gameState.shopUpgrades.dantianReroll == 0 &&
        gameState.highestDantian < 0
      );
    },
    effect: function () {
      gameState.shopUpgrades.bloodlineReroll = 1;
    },
  },
  dantianSecondReroll: {
    name: "Another Additional Chance In Dantian Formation",
    price: 8800,
    condition: function () {
      return gameState.shopUpgrades.dantianReroll == 1;
    },
    effect: function () {
      gameState.shopUpgrades.bloodlineReroll = 2;
    },
  },
};

class Utility {
  static sum(listToSum) {
    return listToSum.reduce((partialSum, a) => partialSum + a, 0);
  }

  static rollOneDice(faces, min = 0) {
    return Math.floor(Math.random() * faces) + min;
  }

  static rollDice(faces, min = 0, numRolls = 1, rerolls = 0) {
    // Roll x+y dice
    const rollResults = [];
    for (let i = 0; i < numRolls + rerolls; i++) {
      rollResults.push(Math.floor(Math.random() * faces) + min);
    }

    // Sort in descending order and take the top x dice
    rollResults.sort((a, b) => b - a);
    const topXDice = rollResults.slice(0, numRolls);

    // Return the sum of the top x dice
    return this.sum(topXDice);
  }

  static findMinIndex(array) {
    return array.reduce(
      (minIndex, current, index, arr) =>
        current < arr[minIndex] ? index : minIndex,
      0
    );
  }
}

// ===== GAME INITIALIZATION =====
class GameInitializer {
  static startGame() {
    gameState.meridianEx = Array(CONSTANTS.MERIDIAN_COUNT).fill(0);
    gameState.meridianFortune = Array(CONSTANTS.MERIDIAN_COUNT).fill(false);
    gameState.log.push("You began your journey");
  }

  static startLife() {
    // Reset life stats
    gameState.meridianCapacity = 0;
    gameState.meridiansOpened = 0;
    gameState.qi = 0;
    gameState.qiPurity = CONSTANTS.BASE_QI_PURITY;
    gameState.circulationSkill = 0;
    gameState.circulationProficiency = 0;
    gameState.qiFolds = 0;
    gameState.pillars = 0;
    gameState.pillarQuality = 0;
    gameState.dantianGrade = 0;
    gameState.daoRunes = Array(9).fill(0);
    gameState.daoRuneMultiplier = 1;
    gameState.dead = false;
    gameState.dantianRerolls = gameState.shopUpgrades.dantianReroll;

    // Reset current life statistics
    gameState.currentLifeStats = {
      meridiansOpenedAtDeath: 0,
      ageAtDeath: 0,
      qiFoldsAtDeath: 0,
      ageAt12thMeridian: null,
    };

    // Generate random stats
    this._generateRandomStats();
    this._generateMeridianTalents();
    this._calculateStartAge();
    this._simulateEarlyYears();

    UISystem.refreshClientNewLife();

    gameSave();
  }

  static _generateRandomStats() {
    // Vitality with bonus from previous achievements
    gameState.vitality = Utility.rollDice(
      10,
      1,
      2,
      gameState.shopUpgrades.rerollVitality
    );
    gameState.vitality += Utility.rollOneDice(gameState.highestMeridian / 6);
    gameState.vitality += Utility.rollOneDice(gameState.highestQiFold / 3);

    if (
      Utility.rollDice(100, 1, 1, gameState.shopUpgrades.bloodlineReroll) == 100
    ) {
      gameState.log.push("You awakened a special bloodline.");
      gameState.vitality += Utility.rollDice(10, 1, 2, 1);
      gameState.seenBloodline = true;
    }
    if (
      Utility.rollDice(100, 1, 1, gameState.shopUpgrades.daoRuneReroll) == 100
    ) {
      gameState.log.push("You see a strange symbol in your dreams.");
      gameState.daoRunes[Utility.rollOneDice(9, 1)] = 1;
      gameState.daoRuneMultiplier = Math.pow(
        2.5,
        Utility.sum(gameState.daoRunes)
      );
      gameState.seenDaoRune = true;
    }

    // Comprehension with memory bonus
    gameState.comprehension = Utility.rollDice(
      10,
      1,
      2,
      gameState.shopUpgrades.rerollComprehension
    );
    for (let i = 0; i < gameState.circulationMemory.length; i++) {
      if (gameState.circulationMemory[i] > 10) {
        gameState.comprehension += Utility.rollOneDice(
          Math.log10(gameState.circulationMemory[i] / 10)
        );
      }
    }

    // Wisdom with experience bonus
    gameState.wisdom = Utility.rollDice(
      10,
      1,
      2,
      gameState.shopUpgrades.rerollWisdom
    );
    gameState.wisdom += Math.floor(Math.sqrt(gameState.totalYears / 100));

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

  static _generateMeridianTalents() {
    gameState.meridianTalent = Array.from(
      { length: CONSTANTS.MERIDIAN_COUNT },
      () => Utility.rollOneDice(100, 1)
    );

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

  static _calculateStartAge() {
    gameState.startAge =
      CONSTANTS.BASE_AGE -
      Math.max(Math.ceil(Math.log(gameState.wisdom / 15) / Math.log(1.5)), 0);
    gameState.startAge -= gameState.shopUpgrades.earlyStart;
    gameState.startAge = Math.max(gameState.startAge, 0);
  }

  static _simulateEarlyYears() {
    for (
      gameState.age = 0;
      gameState.age < gameState.startAge;
      gameState.age++
    ) {
      GameLogic.oneYearPass(false);
    }
  }

  static getMeridianEstimate() {
    var min = Math.min.apply(null, gameState.meridianTalent);
    var average =
      Utility.sum(gameState.meridianTalent) / CONSTANTS.MERIDIAN_COUNT;
    return Math.floor((min + average) / 2);
  }
}

// ===== CULTIVATION SYSTEM =====
class CultivationSystem {
  static getQiCapacity() {
    return gameState.meridianCapacity + gameState.dantianGrade * 400;
  }

  static getCombatPower() {
    const combatPower =
      Math.max(0, Math.log10(gameState.vitality) / 10) +
      Math.max(0, Math.log10(this.getQiCapacity()) / Math.log(5)) +
      gameState.qiFolds +
      gameState.pillarQuality / 12 +
      gameState.dantianGrade / 4;
    return Math.round(combatPower * 10) / 10;
  }

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

  static cultivateMeridians() {
    let failed = false;
    //vitality
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

  static formPillar() {
    gameState.qi -= 200;
    const success = Math.min(6, Math.random() * gameState.qiFolds);
    if (success > 2) {
      gameState.pillars += 1;
      gameState.vitality += Math.floor(success * 4);
      gameState.pillarQuality += Math.floor(success / 2);
      if (gameState.pillars == 8) {
        gameState.log.push(
          "Life " +
            gameState.totalLives +
            ": You formed your eigth pillar at age " +
            gameState.age
        );
      }
    } else {
      gameState.vitality -= Utility.rollOneDice(6, 1);
    }
  }

  static formDantian() {
    let difficulty = Utility.rollOneDice(2 * gameState.dantianGrade + 14, 1);
    let cost = 50 * gameState.dantianGrade;
    const foundation = gameState.pillarQuality + gameState.qiFolds;
    while (
      gameState.dantianRerolls > 0 &&
      difficulty -
        Math.max(0, gameState.highestDantian - gameState.dantianGrade) / 10 <
        foundation
    ) {
      gameState.dantianRerolls -= 1;
      difficulty = Utility.rollOneDice(2 * gameState.dantianGrade + 14, 1);
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
      gameState.vitality -= Utility.rollOneDice(10, 1);
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

  static cultivate() {
    if (gameState.meridiansOpened < CONSTANTS.MERIDIAN_COUNT) {
      this.cultivateMeridians();
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
      gameState.qi > 200 &&
      gameState.qi >= 0.95 * CultivationSystem.getQiCapacity()
    ) {
      if (gameState.pillars < 8) {
        this.formPillar();
      } else if (gameState.dantianGrade == 0) {
        this.formDantian();
      }
    }
  }

  static gainRandomDaoRune() {
    CultivationSystem.gainRandomDaoRune();
  }
}

// ===== GAME LOGIC =====
class GameLogic {
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

    // Qi purity degradation
    if (
      gameState.meridiansOpened < CONSTANTS.MERIDIAN_COUNT ||
      Math.random() <
        Math.pow(
          CONSTANTS.QI_PURITY_DEGRADATION_BASE,
          gameState.circulationProficiency + gameState.circulationGrade
        )
    ) {
      gameState.qiPurity -= 1;
    }

    // Aging effects
    if (
      gameState.age - gameState.shopUpgrades.youthfullness >
      gameState.qiPurity
    ) {
      const loss = gameState.age / gameState.qiPurity;
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
        gameState.dantianGrade * 3;
      gameState.samsaraPoints += pointGain;
    }
  }

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
                    Math.random(10)
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
}

// ===== UI SYSTEM =====
class UISystem {
  static toggleContainerVisibility(containerId, show) {
    const container = document.getElementById(containerId);
    if (container) {
      container.style.display = show ? "block" : "none";
    }
  }

  static updateElementContent(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
      element.innerHTML = value;
    }
  }

  static updateMultipleElements(elements) {
    Object.entries(elements).forEach(([id, value]) => {
      this.updateElementContent(id, value);
    });
  }

  static toggleMultipleContainers(containerConfigs) {
    containerConfigs.forEach((config) => {
      if (typeof config === "string") {
        this.toggleContainerVisibility(config, true);
      } else {
        this.toggleContainerVisibility(config.id, config.show);
      }
    });
  }

  static refreshClientNewLife() {
    const elements = {
      "meridian talent": GameInitializer.getMeridianEstimate(),
      "average age": gameState.averageLifeStats.ageAtDeath,
    };

    // Only show these elements if highest meridian >= 12
    if (gameState.highestMeridian >= 12) {
      elements["highest qi folds"] = gameState.highestQiFold;
      elements["highest dantian grade"] = gameState.highestDantian;
      elements["average qi folds"] = gameState.averageLifeStats.qiFoldsAtDeath;
      if (gameState.averageLifeStats.ageAt12thMeridian != null) {
        elements["average primary meridians"] =
          gameState.averageLifeStats.ageAt12thMeridian;
      } else {
        elements["average meridians"] =
          gameState.averageLifeStats.meridiansOpenedAtDeath;
      }
    } else {
      elements["highest meridian"] = gameState.highestMeridian;
      if (gameState.averageLifeStats.ageAt12thMeridian == null) {
        elements["average meridians"] =
          gameState.averageLifeStats.meridiansOpenedAtDeath;
      }
    }

    // Update all elements using utility function
    this.updateMultipleElements(elements);

    // Handle container visibility based on highest meridian
    if (gameState.highestMeridian < 12) {
      // Hide containers for advanced features
      const containersToHide = [
        { id: "highest-qi-folds-container", show: false },
        { id: "comprehension-container", show: false },
        { id: "average-qi-folds-container", show: false },
        { id: "average-primary-meridians-container", show: false },
      ];
      this.toggleMultipleContainers(containersToHide);
    } else {
      // Show containers for advanced features
      const containersToShow = [
        { id: "highest-qi-folds-container", show: true },
        { id: "comprehension-container", show: true },
        { id: "average-qi-folds-container", show: true },
      ];

      if (gameState.averageLifeStats.ageAt12thMeridian != null) {
        containersToShow.push({
          id: "average-primary-meridians-container",
          show: true,
        });
      }

      this.toggleMultipleContainers(containersToShow);

      // Hide highest meridian container when showing advanced stats
      this.toggleContainerVisibility("highest-meridian-container", false);

      // Handle meridian average display logic
      if (gameState.averageLifeStats.ageAt12thMeridian != null) {
        this.toggleContainerVisibility("average-meridians-container", false);
        this.toggleContainerVisibility(
          "average-primary-meridians-container",
          true
        );
      } else {
        this.toggleContainerVisibility(
          "average-primary-meridians-container",
          false
        );
        this.toggleContainerVisibility("average-meridians-container", true);
      }
    }
  }
  static refreshClient() {
    const elements = {
      age: gameState.age,
      "combat power": CultivationSystem.getCombatPower() || 0,
      qi: gameState.qi,
      "meridian opened": gameState.meridiansOpened,
      vitality: gameState.vitality,
      wisdom: gameState.wisdom,
      luck: gameState.luck,
      "samsara-points": gameState.samsaraPoints,
      log: gameState.log.join("\r\n"),
      "qi purity": gameState.qiPurity,
    };

    // Only show comprehension if highest meridian >= 12
    if (gameState.highestMeridian >= 12) {
      elements["comprehension"] = gameState.comprehension;
    }

    // Only show these elements if meridians opened >= 12
    if (gameState.meridiansOpened >= 12) {
      elements["qi capacity"] = CultivationSystem.getQiCapacity();
      elements["qi folds"] = gameState.qiFolds;
      elements["pillars"] = gameState.pillars;
      elements["dantian grade"] = gameState.dantianGrade;
      elements["circulation skill"] = gameState.circulationSkill;
      elements["circulation grade"] = gameState.circulationGrade;
    }

    // Update all elements using utility function
    this.updateMultipleElements(elements);

    this.toggleContainerVisibility(
      "vitality-container",
      gameState.totalLives > 2
    );
    this.toggleContainerVisibility(
      "meridian-talent-container",
      gameState.totalLives > 8
    );
    this.toggleContainerVisibility(
      "wisdom-container",
      gameState.totalLives > 14
    );
    this.toggleContainerVisibility("luck-container", gameState.totalLives > 20);
    this.toggleContainerVisibility(
      "qi-purity-container",
      gameState.totalLives > 40
    );

    // Handle comprehension container visibility based on highest meridian
    this.toggleContainerVisibility(
      "comprehension-container",
      gameState.highestMeridian >= 12
    );

    // Handle advanced cultivation containers based on meridians opened
    const advancedContainers = [
      { id: "qi-capacity-container", show: gameState.meridiansOpened >= 12 },
      { id: "qi-folds-container", show: gameState.meridiansOpened >= 12 },
      {
        id: "circulation-skill-container",
        show: gameState.meridiansOpened >= 12,
      },
    ];
    this.toggleMultipleContainers(advancedContainers);

    // Trim log if it gets too long
    if (gameState.log.length > CONSTANTS.LOG_MAX_LENGTH) {
      gameState.log.shift();
    }

    // Update upgrade shop
    this.refreshUpgradeShop();
  }

  static refreshUpgradeShop() {
    const upgradeList = document.getElementById("upgrade-list");
    if (!upgradeList) return;

    // Get all upgrades and sort by price
    const upgrades = Object.entries(shopItems).sort(
      (a, b) => a[1].price - b[1].price
    );

    upgradeList.innerHTML = "";

    upgrades.forEach(([key, upgrade]) => {
      // Check if upgrade should be available based on condition
      const isAvailable = upgrade.condition();
      if (!isAvailable) {
        return;
      }

      // Check if player can afford it
      const canAfford = gameState.samsaraPoints >= upgrade.price;

      // Create upgrade button
      const upgradeButton = document.createElement("button");
      upgradeButton.className = "upgrade-item";
      upgradeButton.innerHTML = `
                <div>${upgrade.name}</div>
                <div class="upgrade-price">Cost: ${upgrade.price} Samsara Points</div>
            `;

      if (!canAfford) {
        // Player can't afford it
        upgradeButton.classList.add("disabled");
        upgradeButton.disabled = true;
      } else {
        // Upgrade is available and affordable
        upgradeButton.onclick = () => this.purchaseUpgrade(key, upgrade);
      }

      upgradeList.appendChild(upgradeButton);
    });
  }

  static purchaseUpgrade(key, upgrade) {
    // Double-check conditions before purchase
    if (!upgrade.condition() || gameState.samsaraPoints < upgrade.price) {
      return;
    }

    // Deduct samsara points
    gameState.samsaraPoints -= upgrade.price;

    // Apply upgrade effect
    upgrade.effect();

    // Refresh the shop and other UI elements
    this.refreshUpgradeShop();
    this.refreshClient();

    // Save game state
    gameSave();

    // Log the purchase
    gameState.log.push(`Purchased upgrade: ${upgrade.name}`);
  }
}

// ===== GAME LOOP =====
class GameLoop {
  static start() {
    window.setInterval(() => {
      if (gameState.dead) {
        if (gameState.restartOnDeath) {
          GameInitializer.startLife();
        } else {
          gameState.pauseState = true;
        }
        return;
      }

      if (gameState.pauseState) {
        return;
      }

      GameLogic.oneYearPass(true);
      UISystem.refreshClient();
    }, CONSTANTS.GAME_TICK_INTERVAL);
  }
}

function gameSave() {
  localStorage.setItem("autosave", JSON.stringify(gameState));
}

function gameLoad() {
  return JSON.parse(localStorage.getItem("autosave"));
}

// ===== GAME INITIALIZATION AND START =====
var loadedSave = gameLoad();
if (loadedSave == undefined) {
  GameInitializer.startGame();
  GameInitializer.startLife();
} else {
  gameState = loadedSave;
}

// Start game loop
GameLoop.start();

/* eslint-disable */
function pauseGame() {
  gameState.pauseState = true;
}
function resetSave() {
  localStorage.removeItem("autosave");
  GameInitializer.startGame();
  GameInitializer.startLife();
}
/* eslint-enable */
