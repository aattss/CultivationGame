/**
 * Core game type definitions
 * Contains interfaces and types for the main game objects
 */

export interface ShopUpgrades {
  rerollMeridianTalent: number;
  luckExtraRolls: number;
  rerollVitality: number;
  rerollWisdom: number;
  rerollComprehension: number;
  youthfullness: number;
  earlyStart: number;
  bloodlineReroll: number;
  dantianReroll: number;
  daoRuneReroll: number;
  organTalentReroll: number;
  chakraTalentReroll: number;
  extraMeridians: number;
  longevityUnlocked: number;
  extraPillars: number;
}

export interface LifeStats {
  meridiansOpenedAtDeath: number;
  ageAtDeath: number;
  qiFoldsAtDeath: number;
  ageAt12thMeridian: number | null;
}

export interface GameState {
  // Character stats
  age: number;
  vitality: number;
  comprehension: number;
  wisdom: number;
  luck: number;
  dead: boolean;
  startAge: number;
  longevity: number;

  // Meridian system
  meridianTalent: number[];
  meridianCapacity: number;
  meridiansOpened: number;
  meridianEx: number[];
  meridianFortune: boolean[];
  meridianMax: number;
  extraMeridiansEnabled: boolean;

  // Qi system
  qi: number;
  qiPurity: number;
  qiFolds: number;

  // Circulation system
  circulationGrade: number;
  circulationSkill: number;
  circulationProficiency: number;
  circulationMemory: number[];
  circulationInsights: number;
  daoRunes: number[];
  daoRuneMultiplier: number;
  enlightenment: number;

  // Organ purification system
  organsPurified: number;
  cyclesCleansed: number;
  organTalent: number[];
  organProgress: number;
  organEx: number[];

  acupoints: number;

  // Core Formation system
  pillars: number;
  pillarQuality: number;
  dantianGrade: number;
  dantianRerolls: number;
  pillarEx: number;

  // Chakra System
  openedChakras: number;
  chakraTalent: number[];

  // Treasure system
  daoTreasureQuality: number[];
  treasureCondenseAttempts: number;

  // Game settings
  restartOnDeath: boolean;
  pauseState: boolean;

  // Progress tracking
  totalYears: number;
  totalLives: number;
  highestMeridian: number;
  highestQiFold: number;
  highestDantian: number;
  highestChakra: number;
  highestCycle: number;
  log: string[];
  samsaraPoints: number;
  seenBloodline: boolean;
  seenDaoRune: boolean;
  tribulationFailed: number[];

  // Statistics tracking
  lifeStats: LifeStats[];
  currentLifeStats: LifeStats;
  averageLifeStats: LifeStats;

  shopUpgrades: ShopUpgrades;
}

export interface ShopItem {
  name: string;
  price: number;
  condition: () => boolean;
  effect: () => void;
}

export interface ShopItems {
  [key: string]: ShopItem;
}

export interface Constants {
  MERIDIAN_COUNT: number;
  EXTRAORDINARY_MERIDIANS: number;
  BASE_AGE: number;
  BASE_QI_PURITY: number;
  MERIDIAN_DIFFICULTY_BASE: number;
  QI_FOLD_THRESHOLD: number;
  QI_FOLD_MULTIPLIER: number;
  QI_PURITY_BONUS: number;
  CIRCULATION_BASE_DIFFICULTY: number;
  CIRCULATION_DIFFICULTY_MULTIPLIER: number;
  GAME_TICK_INTERVAL: number;
  LUCKY_ENCOUNTER_BASE_CHANCE: number;
  LUCKY_ENCOUNTER_TRIGGER: number;
  QI_PURITY_DEGRADATION_BASE: number;
  LOG_MAX_LENGTH: number;
  PILLAR_QI_COST: number;
}

// Utility types for DOM elements
export type ElementCache = Map<string, HTMLElement>;
export type ValueCache = Map<string, string | number>;
export type ContainerStateCache = Map<string, boolean>;

// Function types for common patterns
export type DiceRollFunction = (faces: number, min?: number) => number;
export type MultiDiceRollFunction = (faces: number, min?: number, numRolls?: number, rerolls?: number) => number;

// UI-specific types
export interface ContainerConfig {
  id: string;
  show: boolean;
}

export interface UIUpdateConfig {
  elementUpdates: Record<string, string | number>;
  containerStates: Record<string, boolean>;
}

// Game event types
export type CultivationEvent =
  | "meridian_opened"
  | "qi_folded"
  | "pillar_formed"
  | "dantian_formed"
  | "death"
  | "tribulation";

// Utility type for array indices
export type MeridianIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
export type OrganIndex = 0 | 1 | 2 | 3 | 4;
export type ChakraIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type DaoRuneIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/**
 * Configuration for a tribulation event
 */
export interface TribulationConfig {
  age: number;
  baseDifficulty: number;
  difficultyRange: number;
  failureDamage: number;
  samsaraReward: number;
  longevityBonus?: number;
  bonusLuckyEncounters?: number;
  deathMessage: string;
  tribulationIndex: number;
}
