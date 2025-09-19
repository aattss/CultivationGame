/**
 * Game Logic
 * Handles core game progression, events, and time passage
 */
export declare class GameLogic {
    /**
     * Configuration for all tribulation events
     */
    private static readonly TRIBULATION_CONFIGS;
    /**
     * Process one year of game time
     * @param cultivates - Whether the character cultivates this year
     */
    static oneYearPass(cultivates: boolean): void;
    /**
     * Calculate average statistics from recent lives
     */
    static calculateAverageStats(): void;
    /**
     * Handle random lucky encounters based on luck stat
     */
    static LuckyEncounter(): void;
    /**
     * Process a single tribulation event
     * @param config The tribulation configuration
     */
    private static processTribulation;
    /**
     * Handle tribulation events at specific ages
     */
    static tribulation(): void;
}
//# sourceMappingURL=gameLogic.d.ts.map