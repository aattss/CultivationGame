/**
 * Game Initializer
 * Handles game startup and new life initialization
 */
export declare class GameInitializer {
    /**
     * Initialize a completely new game
     */
    static startGame(): void;
    /**
     * Start a new life cycle with fresh stats and progression
     */
    static startLife(): void;
    /**
     * Generate random character stats with bonuses from previous achievements
     * @private
     */
    static _generateRandomStats(): void;
    /**
     * Generate meridian talents with fortune rerolls and upgrades
     * @private
     */
    static _generateMeridianTalents(): void;
    /**
     * Generate organ talents for purification system
     * @private
     */
    static _generateOrganTalents(): void;
    /**
     * Generate chakra talents for chakra system
     * @private
     */
    static _generateChakraTalents(): void;
    /**
     * Calculate the starting age based on wisdom
     * @private
     */
    static _calculateStartAge(): void;
    /**
     * Simulate early years before cultivation starts
     * @private
     */
    static _simulateEarlyYears(): void;
    /**
     * Generate bloodline with intensity system and organ enhancements
     * @private
     */
    static _generateBloodline(): void;
}
//# sourceMappingURL=gameInitializer.d.ts.map