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
    extraChakras: number;
    combatTalentReroll: number;
    alchemyTalentReroll: number;
    forgingTalentReroll: number;
}
export interface LifeStats {
    meridiansOpenedAtDeath: number;
    ageAtDeath: number;
    qiFoldsAtDeath: number;
    chakrasAtDeath: number;
    potentialAtDeath: number;
    ageAt12thMeridian: number | null;
    ageAt20thMeridian: number | null;
}
export interface GameState {
    age: number;
    vitality: number;
    comprehension: number;
    wisdom: number;
    luck: number;
    dead: boolean;
    startAge: number;
    longevity: number;
    potential: number;
    combatTalent: number;
    alchemyTalent: number;
    forgingTalent: number;
    combatEx: number;
    alchemyEx: number;
    forgingEx: number;
    meridianTalent: number[];
    meridianCapacity: number;
    meridiansOpened: number;
    meridianEx: number[];
    meridianFortune: boolean[];
    meridianMax: number;
    extraMeridiansEnabled: boolean;
    qi: number;
    qiPurity: number;
    qiFolds: number;
    circulationGrade: number;
    circulationSkill: number;
    circulationProficiency: number;
    circulationMemory: number[];
    circulationInsights: number;
    daoRunes: number[];
    daoRuneMultiplier: number;
    enlightenment: number;
    organsPurified: number;
    cyclesCleansed: number;
    organTalent: number[];
    organProgress: number;
    organEx: number[];
    acupoints: number;
    pillars: number;
    pillarQuality: number;
    dantianGrade: number;
    dantianRerolls: number;
    pillarEx: number;
    openedChakras: number;
    chakraTalent: number[];
    chakraEx: number[];
    daoTreasureQuality: number[];
    treasureCondenseAttempts: number;
    restartOnDeath: boolean;
    pauseState: boolean;
    totalYears: number;
    totalLives: number;
    highestMeridian: number;
    highestQiFold: number;
    highestDantian: number;
    highestChakra: number;
    highestCycle: number;
    highestPotential: number;
    log: string[];
    samsaraPoints: number;
    seenBloodline: boolean;
    seenDaoRune: boolean;
    tribulationFailed: number[];
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
export type ElementCache = Map<string, HTMLElement>;
export type ValueCache = Map<string, string | number>;
export type ContainerStateCache = Map<string, boolean>;
export type DiceRollFunction = (faces: number, min?: number) => number;
export type MultiDiceRollFunction = (faces: number, min?: number, numRolls?: number, rerolls?: number) => number;
export interface ContainerConfig {
    id: string;
    show: boolean;
}
export interface UIUpdateConfig {
    elementUpdates: Record<string, string | number>;
    containerStates: Record<string, boolean>;
}
export type CultivationEvent = "meridian_opened" | "qi_folded" | "pillar_formed" | "dantian_formed" | "death" | "tribulation";
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
//# sourceMappingURL=gameTypes.d.ts.map