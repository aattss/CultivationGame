import { gameState } from "./gameState.js";
import type { ShopItems } from "../types/gameTypes.js";

/**
 * Shop items configuration
 * Contains all purchasable upgrades and their effects
 */
export const shopItems: ShopItems = {
  meridianOneReroll: {
    name: "Reroll One Meridian",
    price: 150,
    condition: function (): boolean {
      return gameState.shopUpgrades.rerollMeridianTalent == 0;
    },
    effect: function (): void {
      gameState.shopUpgrades.rerollMeridianTalent = 1;
    },
  },
  meridianSecondReroll: {
    name: "Additional Meridian Reroll",
    price: 650,
    condition: function (): boolean {
      return gameState.shopUpgrades.rerollMeridianTalent == 1;
    },
    effect: function (): void {
      gameState.shopUpgrades.rerollMeridianTalent = 2;
    },
  },
  meridianThirdReroll: {
    name: "Additional Meridian Reroll",
    price: 3000,
    condition: function (): boolean {
      return gameState.shopUpgrades.rerollMeridianTalent == 2;
    },
    effect: function (): void {
      gameState.shopUpgrades.rerollMeridianTalent = 3;
    },
  },
  vitalityReroll: {
    name: "Vitality 2 Dice -> B2o3",
    price: 600,
    condition: function (): boolean {
      return gameState.shopUpgrades.rerollVitality == 0;
    },
    effect: function (): void {
      gameState.shopUpgrades.rerollVitality = 1;
    },
  },
  comprehensionReroll: {
    name: "Comprehension 2 Dice -> B2o3",
    price: 1000,
    condition: function (): boolean {
      return gameState.shopUpgrades.rerollComprehension == 0 && gameState.highestMeridian >= 12;
    },
    effect: function (): void {
      gameState.shopUpgrades.rerollComprehension = 1;
    },
  },
  wisdomReroll: {
    name: "Wisdom 2 Dice -> B2o3",
    price: 1600,
    condition: function (): boolean {
      return gameState.shopUpgrades.rerollWisdom == 0;
    },
    effect: function (): void {
      gameState.shopUpgrades.rerollWisdom = 1;
    },
  },
  luckRoll: {
    name: "Additional Luck Dice",
    price: 350,
    condition: function (): boolean {
      return gameState.shopUpgrades.luckExtraRolls == 0;
    },
    effect: function (): void {
      gameState.shopUpgrades.luckExtraRolls = 1;
    },
  },
  secondLuckRoll: {
    name: "Another Luck Dice",
    price: 1300,
    condition: function (): boolean {
      return gameState.shopUpgrades.luckExtraRolls == 1;
    },
    effect: function (): void {
      gameState.shopUpgrades.luckExtraRolls = 2;
    },
  },
  youthfullnessOne: {
    name: "Delay Aging",
    price: 100,
    condition: function (): boolean {
      return gameState.shopUpgrades.youthfullness == 0;
    },
    effect: function (): void {
      gameState.shopUpgrades.youthfullness = 5;
    },
  },
  youthfullnessTwo: {
    name: "Delay Aging Some More",
    price: 400,
    condition: function (): boolean {
      return gameState.shopUpgrades.youthfullness == 5;
    },
    effect: function (): void {
      gameState.shopUpgrades.youthfullness = 10;
    },
  },
  precociousOne: {
    name: "Start Cultivating Sooner",
    price: 450,
    condition: function (): boolean {
      return gameState.shopUpgrades.earlyStart == 0;
    },
    effect: function (): void {
      gameState.shopUpgrades.earlyStart = 1;
    },
  },
  precociousTwo: {
    name: "Start Cultivating Even Earlier",
    price: 5500,
    condition: function (): boolean {
      return gameState.shopUpgrades.earlyStart == 1;
    },
    effect: function (): void {
      gameState.shopUpgrades.earlyStart = 2;
    },
  },
  bloodlineOneReroll: {
    name: "Additional Bloodline Chance",
    price: 700,
    condition: function (): boolean {
      return gameState.shopUpgrades.bloodlineReroll == 0 && gameState.seenBloodline;
    },
    effect: function (): void {
      gameState.shopUpgrades.bloodlineReroll = 1;
    },
  },
  bloodlineSecondReroll: {
    name: "Another Additional Bloodline Chance",
    price: 2200,
    condition: function (): boolean {
      return gameState.shopUpgrades.bloodlineReroll == 1;
    },
    effect: function (): void {
      gameState.shopUpgrades.bloodlineReroll = 2;
    },
  },
  daoRuneOneReroll: {
    name: "Additional Dao Rune Chance",
    price: 2200,
    condition: function (): boolean {
      return gameState.shopUpgrades.daoRuneReroll == 0 && gameState.seenDaoRune;
    },
    effect: function (): void {
      gameState.shopUpgrades.daoRuneReroll = 1;
    },
  },
  daoRuneSecondReroll: {
    name: "Another Additional Dao Rune Chance",
    price: 7800,
    condition: function (): boolean {
      return gameState.shopUpgrades.daoRuneReroll == 1;
    },
    effect: function (): void {
      gameState.shopUpgrades.daoRuneReroll = 2;
    },
  },
  dantianOneReroll: {
    name: "Additional Chance In Dantian Formation",
    price: 2200,
    condition: function (): boolean {
      return gameState.shopUpgrades.dantianReroll == 0 && gameState.highestDantian > 0;
    },
    effect: function (): void {
      gameState.shopUpgrades.dantianReroll = 1;
    },
  },
  dantianSecondReroll: {
    name: "Another Additional Chance In Dantian Formation",
    price: 8800,
    condition: function (): boolean {
      return gameState.shopUpgrades.dantianReroll == 1;
    },
    effect: function (): void {
      gameState.shopUpgrades.dantianReroll = 2;
    },
  },
  organTalentReroll: {
    name: "Adds A Reroll For One Organ Talent",
    price: 1100,
    condition: function (): boolean {
      return gameState.shopUpgrades.organTalentReroll == 0;
    },
    effect: function (): void {
      gameState.shopUpgrades.organTalentReroll = 1;
    },
  },
  organTalentSecondReroll: {
    name: "Another Additional Reroll For Organ Talent",
    price: 4600,
    condition: function (): boolean {
      return gameState.shopUpgrades.organTalentReroll == 1 && gameState.highestCycle > 1;
    },
    effect: function (): void {
      gameState.shopUpgrades.organTalentReroll = 2;
    },
  },
  chakraTalentReroll: {
    name: "Adds A Reroll For One Chakra Talent",
    price: 7200,
    condition: function (): boolean {
      return gameState.shopUpgrades.chakraTalentReroll == 0 && gameState.highestChakra > 0;
    },
    effect: function (): void {
      gameState.shopUpgrades.chakraTalentReroll = 1;
    },
  },
  ckakraTalentSecondReroll: {
    name: "Another Additional Reroll For Chakra Talent",
    price: 13400,
    condition: function (): boolean {
      return gameState.shopUpgrades.chakraTalentReroll == 1;
    },
    effect: function (): void {
      gameState.shopUpgrades.chakraTalentReroll = 2;
    },
  },
  extraordinaryMeridians: {
    name: "Unlock The Extraordinary Meridians",
    price: 3000,
    condition: function (): boolean {
      return gameState.shopUpgrades.extraMeridians == 0 && gameState.enlightenment >= 2;
    },
    effect: function (): void {
      gameState.shopUpgrades.extraMeridians = 1;
    },
  },
  longevityIncrease: {
    name: "Rewrite Life And Death Through Overcoming Tribulation",
    price: 800,
    condition: function (): boolean {
      return gameState.shopUpgrades.longevityUnlocked == 0 && gameState.enlightenment >= 1;
    },
    effect: function (): void {
      gameState.shopUpgrades.longevityUnlocked = 1;
    },
  },
  extraPillars: {
    name: "Perfect Your Pillar Foundation With The Zodiac",
    price: 5000,
    condition: function (): boolean {
      return gameState.shopUpgrades.extraPillars == 0 && gameState.enlightenment >= 3;
    },
    effect: function (): void {
      gameState.shopUpgrades.extraPillars = 1;
    },
  },
  extraChakras: {
    name: "Conceptualize Additional Chakras To Understand Divine Truths",
    price: 9000,
    condition: function (): boolean {
      return gameState.shopUpgrades.extraChakras == 0 && gameState.enlightenment >= 4;
    },
    effect: function (): void {
      gameState.shopUpgrades.extraChakras = 1;
    },
  },
};
