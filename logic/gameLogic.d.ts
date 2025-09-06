/**
 * Game Logic
 * Handles core game progression, events, and time passage
 */
export declare class GameLogic {
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
    static tribulation(): void;
}
//# sourceMappingURL=gameLogic.d.ts.map