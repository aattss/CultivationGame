import type { DiceRollFunction, MultiDiceRollFunction, LogType } from "../types/gameTypes.js";
/**
 * Utility functions for common operations
 * Contains helper functions used throughout the game
 */
export declare class Utility {
    /**
     * Sum all numbers in an array
     * @param listToSum - Array of numbers to sum
     * @returns Sum of all numbers in the array
     */
    static sum(listToSum: number[]): number;
    /**
     * Roll a single dice with specified faces and minimum value
     * @param faces - Number of faces on the dice
     * @param min - Minimum value (default: 0)
     * @returns Random number between min and min+faces-1
     */
    static rollOneDice: DiceRollFunction;
    /**
     * Roll multiple dice and return sum of best rolls
     * @param faces - Number of faces on each dice
     * @param min - Minimum value per dice (default: 0)
     * @param numRolls - Number of dice to keep (default: 1)
     * @param rerolls - Additional dice to roll for reroll advantage (default: 0)
     * @returns Sum of the best numRolls dice
     */
    static rollDice: MultiDiceRollFunction;
    /**
     * Find the index of the minimum value in an array
     * @param array - Array to search
     * @returns Index of the minimum value
     */
    static findMinIndex(array: number[]): number;
    static getPotentialEstimate(array: number[]): number;
    /**
     * Add a message to the game log(s)
     * @param message - The message to add to the log
     * @param logTypes - The log type(s) to add the message to (defaults to "event")
     */
    static addLogMessage(message: string, logTypes?: LogType | LogType[]): void;
}
//# sourceMappingURL=utility.d.ts.map