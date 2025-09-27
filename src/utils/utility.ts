import type { DiceRollFunction, MultiDiceRollFunction, LogType } from "../types/gameTypes.js";
import { gameState } from "../data/gameState.js";

/**
 * Utility functions for common operations
 * Contains helper functions used throughout the game
 */
export class Utility {
  /**
   * Sum all numbers in an array
   * @param listToSum - Array of numbers to sum
   * @returns Sum of all numbers in the array
   */
  static sum(listToSum: number[]): number {
    return listToSum.reduce((partialSum, a) => partialSum + a, 0);
  }

  /**
   * Roll a single dice with specified faces and minimum value
   * @param faces - Number of faces on the dice
   * @param min - Minimum value (default: 0)
   * @returns Random number between min and min+faces-1
   */
  static rollOneDice: DiceRollFunction = (faces: number, min: number = 0): number => {
    return Math.floor(Math.random() * faces) + min;
  };

  /**
   * Roll multiple dice and return sum of best rolls
   * @param faces - Number of faces on each dice
   * @param min - Minimum value per dice (default: 0)
   * @param numRolls - Number of dice to keep (default: 1)
   * @param rerolls - Additional dice to roll for reroll advantage (default: 0)
   * @returns Sum of the best numRolls dice
   */
  static rollDice: MultiDiceRollFunction = (
    faces: number,
    min: number = 0,
    numRolls: number = 1,
    rerolls: number = 0
  ): number => {
    // Roll x+y dice
    const rollResults: number[] = [];
    for (let i = 0; i < numRolls + rerolls; i++) {
      rollResults.push(Math.floor(Math.random() * faces) + min);
    }

    // Sort in descending order and take the top x dice
    rollResults.sort((a, b) => b - a);
    const topXDice = rollResults.slice(0, numRolls);

    // Return the sum of the top x dice
    return this.sum(topXDice);
  };

  /**
   * Find the index of the minimum value in an array
   * @param array - Array to search
   * @returns Index of the minimum value
   */
  static findMinIndex(array: number[]): number {
    return array.reduce((minIndex, current, index, arr) => (current < arr[minIndex] ? index : minIndex), 0);
  }

  static getPotentialEstimate(array: number[]): number {
    if (!array || array.length === 0) {
      return 0;
    }
    var min = Math.min.apply(null, array);
    var average = Utility.sum(array) / array.length;
    return Math.floor((min + average) / 2);
  }

  /**
   * Add a message to the game log(s)
   * @param message - The message to add to the log
   * @param logTypes - The log type(s) to add the message to (defaults to "event")
   */
  static addLogMessage(message: string, logTypes: LogType | LogType[] = "event"): void {
    const types = Array.isArray(logTypes) ? logTypes : [logTypes];

    types.forEach((type) => {
      switch (type) {
        case "event":
          gameState.eventLog.push(message);
          break;
        case "lifeMilestone":
          gameState.lifeMilestoneLog.push(message);
          break;
        case "upgrade":
          gameState.upgradeLog.push(message);
          break;
      }
    });
  }
}
