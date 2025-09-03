import { gameState } from "./gameState.js";

/**
 * Shop items configuration
 * Contains all purchasable upgrades and their effects
 */
export const shopItems = {
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
    price: 650,
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
      gameState.shopUpgrades.youthfullness = 5;
    },
  },
  youthfullnessTwo: {
    name: "Delay Aging Some More",
    price: 400,
    condition: function () {
      return gameState.shopUpgrades.youthfullness == 5;
    },
    effect: function () {
      gameState.shopUpgrades.youthfullness = 10;
    },
  },
  precociousOne: {
    name: "Start Cultivating Sooner",
    price: 450,
    condition: function () {
      return gameState.shopUpgrades.earlyStart == 0;
    },
    effect: function () {
      gameState.shopUpgrades.earlyStart = 1;
    },
  },
  precociousTwo: {
    name: "Start Cultivating Even Earlier",
    price: 5500,
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
        gameState.highestDantian > 0
      );
    },
    effect: function () {
      gameState.shopUpgrades.dantianReroll = 1;
    },
  },
  dantianSecondReroll: {
    name: "Another Additional Chance In Dantian Formation",
    price: 8800,
    condition: function () {
      return gameState.shopUpgrades.dantianReroll == 1;
    },
    effect: function () {
      gameState.shopUpgrades.dantianReroll = 2;
    },
  },
};
