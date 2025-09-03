/**
 * Utility functions for common operations
 * Contains helper functions used throughout the game
 */
export class Utility {
  /**
   * Sum all numbers in an array
   * @param {number[]} listToSum - Array of numbers to sum
   * @returns {number} Sum of all numbers in the array
   */
  static sum(listToSum) {
    return listToSum.reduce((partialSum, a) => partialSum + a, 0);
  }

  /**
   * Roll a single dice with specified faces and minimum value
   * @param {number} faces - Number of faces on the dice
   * @param {number} min - Minimum value (default: 0)
   * @returns {number} Random number between min and min+faces-1
   */
  static rollOneDice(faces, min = 0) {
    return Math.floor(Math.random() * faces) + min;
  }

  /**
   * Roll multiple dice and return sum of best rolls
   * @param {number} faces - Number of faces on each dice
   * @param {number} min - Minimum value per dice (default: 0)
   * @param {number} numRolls - Number of dice to keep (default: 1)
   * @param {number} rerolls - Additional dice to roll for reroll advantage (default: 0)
   * @returns {number} Sum of the best numRolls dice
   */
  static rollDice(faces, min = 0, numRolls = 1, rerolls = 0) {
    // Roll x+y dice
    const rollResults = [];
    for (let i = 0; i < numRolls + rerolls; i++) {
      rollResults.push(Math.floor(Math.random() * faces) + min);
    }

    // Sort in descending order and take the top x dice
    rollResults.sort((a, b) => b - a);
    const topXDice = rollResults.slice(0, numRolls);

    // Return the sum of the top x dice
    return this.sum(topXDice);
  }

  /**
   * Find the index of the minimum value in an array
   * @param {number[]} array - Array to search
   * @returns {number} Index of the minimum value
   */
  static findMinIndex(array) {
    return array.reduce(
      (minIndex, current, index, arr) =>
        current < arr[minIndex] ? index : minIndex,
      0
    );
  }
}
