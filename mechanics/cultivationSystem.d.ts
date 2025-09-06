/**
 * Cultivation System
 * Handles all cultivation mechanics including meridians, qi, organs, pillars, and dantian
 */
export declare class CultivationSystem {
    /**
     * Calculate the current qi capacity based on various factors
     * @returns Total qi capacity
     */
    static getQiCapacity(): number;
    /**
     * Calculate combat power based on various cultivation factors
     * @returns Current combat power
     */
    static getCombatPower(): number;
    /**
     * Calculate qi generation rate per cultivation cycle
     * @returns Qi gained per cycle
     */
    static getQiRate(): number;
    /**
     * Attempt to open meridians based on current stats
     */
    static cultivateMeridians(): void;
    /**
     * Cultivate circulation technique and generate qi
     */
    static cultivateCirculation(): void;
    /**
     * Cultivate organs to improve qi purity
     */
    static cultivateOrgans(): void;
    /**
     * Form a cultivation pillar
     */
    static formPillar(): void;
    /**
     * Form a dantian with accumulated pillars
     */
    static formDantian(): void;
    /**
     * Cultivate acupoints to increase qi capacity
     */
    static cultivateAcupoints(): void;
    /**
     * Main cultivation function that handles all cultivation activities
     */
    static cultivate(): void;
    static cultivateChakras(): void;
    /**
     * Gain a random dao rune for cultivation bonus
     */
    static gainRandomDaoRune(): void;
}
//# sourceMappingURL=cultivationSystem.d.ts.map