import { CONSTANTS } from "../config/constants.js";
import { gameState } from "../data/gameState.js";
import { shopItems } from "../data/shopItems.js";
import { CultivationSystem } from "../mechanics/cultivationSystem.js";
import { GameInitializer } from "../logic/gameInitializer.js";
import { gameSave } from "../core/persistence.js";

/**
 * UI System
 * Handles all user interface updates and interactions
 */
export class UISystem {
  static elementCache = new Map();
  static lastValues = new Map();
  static lastContainerStates = new Map();
  static lastLogLength = 0;
  static lastSamsaraPoints = null;

  /**
   * Get a cached DOM element
   * @param {string} elementId - The ID of the element to retrieve
   * @returns {HTMLElement|null} The cached element or null if not found
   */
  static getElement(elementId) {
    if (!this.elementCache.has(elementId)) {
      const element = document.getElementById(elementId);
      if (element) {
        this.elementCache.set(elementId, element);
      }
    }
    return this.elementCache.get(elementId);
  }

  /**
   * Toggle visibility of a container element
   * @param {string} containerId - The ID of the container to toggle
   * @param {boolean} show - Whether to show or hide the container
   */
  static toggleContainerVisibility(containerId, show) {
    // Skip if state hasn't changed
    const lastState = this.lastContainerStates.get(containerId);
    if (lastState === show) return;

    const container = this.getElement(containerId);
    if (container) {
      container.style.display = show ? "block" : "none";
      this.lastContainerStates.set(containerId, show);
    }
  }

  /**
   * Update the content of an element if it has changed
   * @param {string} elementId - The ID of the element to update
   * @param {string|number} value - The new value to set
   */
  static updateElementContent(elementId, value) {
    // Skip if value hasn't changed
    const lastValue = this.lastValues.get(elementId);
    if (lastValue === value) return;

    const element = this.getElement(elementId);
    if (element) {
      element.innerHTML = value;
      this.lastValues.set(elementId, value);
    }
  }

  /**
   * Update multiple elements in a single batch operation
   * @param {Object} elements - Object mapping element IDs to new values
   */
  static updateMultipleElements(elements) {
    // Batch DOM updates by collecting all changes first
    const updates = [];
    Object.entries(elements).forEach(([id, value]) => {
      const lastValue = this.lastValues.get(id);
      if (lastValue !== value) {
        const element = this.getElement(id);
        if (element) {
          updates.push({ element, value, id });
        }
      }
    });

    // Apply all updates in a single batch
    if (updates.length > 0) {
      updates.forEach(({ element, value, id }) => {
        element.innerHTML = value;
        this.lastValues.set(id, value);
      });
    }
  }

  /**
   * Toggle visibility of multiple containers in a single batch operation
   * @param {Array} containerConfigs - Array of container configurations
   */
  static toggleMultipleContainers(containerConfigs) {
    // Batch container visibility changes
    const changes = [];
    containerConfigs.forEach((config) => {
      const containerId = typeof config === "string" ? config : config.id;
      const show = typeof config === "string" ? true : config.show;

      const lastState = this.lastContainerStates.get(containerId);
      if (lastState !== show) {
        const container = this.getElement(containerId);
        if (container) {
          changes.push({ container, show, containerId });
        }
      }
    });

    // Apply all changes in batch
    changes.forEach(({ container, show, containerId }) => {
      container.style.display = show ? "block" : "none";
      this.lastContainerStates.set(containerId, show);
    });
  }

  /**
   * Refresh UI for a new life - shows overview statistics
   */
  static refreshClientNewLife() {
    // Clear cache for new life to ensure fresh state
    this.clearCache();

    const elements = {
      "meridian talent": GameInitializer.getMeridianEstimate(),
      "average age": gameState.averageLifeStats.ageAtDeath,
    };

    // Only show these elements if highest meridian >= 12
    if (gameState.highestMeridian >= 12) {
      elements["highest qi folds"] = gameState.highestQiFold;
      elements["highest dantian grade"] = gameState.highestDantian;
      elements["average qi folds"] = gameState.averageLifeStats.qiFoldsAtDeath;
      if (gameState.averageLifeStats.ageAt12thMeridian != null) {
        elements["average primary meridians"] =
          gameState.averageLifeStats.ageAt12thMeridian;
      } else {
        elements["average meridians"] =
          gameState.averageLifeStats.meridiansOpenedAtDeath;
      }
    } else {
      elements["highest meridian"] = gameState.highestMeridian;
      if (gameState.averageLifeStats.ageAt12thMeridian == null) {
        elements["average meridians"] =
          gameState.averageLifeStats.meridiansOpenedAtDeath;
      }
    }

    // Update all elements using optimized batch function
    this.updateMultipleElements(elements);

    // Batch all container visibility updates
    let containerUpdates = [];

    if (gameState.highestMeridian < 12) {
      containerUpdates = [
        { id: "highest-qi-folds-container", show: false },
        { id: "comprehension-container", show: false },
        { id: "average-qi-folds-container", show: false },
        { id: "average-primary-meridians-container", show: false },
      ];
    } else {
      containerUpdates = [
        { id: "highest-qi-folds-container", show: true },
        { id: "comprehension-container", show: true },
        { id: "average-qi-folds-container", show: true },
        { id: "highest-meridian-container", show: false },
      ];

      if (gameState.averageLifeStats.ageAt12thMeridian != null) {
        containerUpdates.push(
          { id: "average-primary-meridians-container", show: true },
          { id: "average-meridians-container", show: false }
        );
      } else {
        containerUpdates.push(
          { id: "average-primary-meridians-container", show: false },
          { id: "average-meridians-container", show: true }
        );
      }
    }

    this.toggleMultipleContainers(containerUpdates);
  }

  /**
   * Refresh the main game client UI during gameplay
   */
  static refreshClient() {
    // Only update log if it has changed
    let logUpdated = false;
    if (gameState.log.length !== this.lastLogLength) {
      // Trim log if it gets too long before updating
      if (gameState.log.length > CONSTANTS.LOG_MAX_LENGTH) {
        gameState.log.shift();
      }
      this.lastLogLength = gameState.log.length;
      logUpdated = true;
    }

    const elements = {
      age: gameState.age,
      "combat power": CultivationSystem.getCombatPower() || 0,
      qi: gameState.qi,
      "meridian opened": gameState.meridiansOpened,
      vitality: gameState.vitality,
      wisdom: gameState.wisdom,
      luck: gameState.luck,
      "samsara-points": gameState.samsaraPoints,
      "qi purity": gameState.qiPurity,
    };

    // Only update log if it actually changed
    if (logUpdated) {
      elements["log"] = gameState.log.join("\r\n");
    }

    // Only show comprehension if highest meridian >= 12
    if (gameState.highestMeridian >= 12) {
      elements["comprehension"] = gameState.comprehension;
    }

    // Only show these elements if meridians opened >= 12
    if (gameState.meridiansOpened >= 12) {
      elements["qi capacity"] = CultivationSystem.getQiCapacity();
      elements["qi folds"] = gameState.qiFolds;
      elements["cycles cleansed"] = gameState.cyclesCleansed;
      elements["pillars"] = gameState.pillars;
      elements["dantian grade"] = gameState.dantianGrade;
      elements["circulation skill"] = gameState.circulationSkill;
      elements["circulation grade"] = gameState.circulationGrade;
      elements["acupoints"] = gameState.acupoints;
    }

    // Update all elements using optimized batch function
    this.updateMultipleElements(elements);

    // Batch all container visibility updates
    const containerUpdates = [
      { id: "vitality-container", show: gameState.totalLives > 2 },
      { id: "meridian-talent-container", show: gameState.totalLives > 8 },
      { id: "wisdom-container", show: gameState.totalLives > 14 },
      { id: "luck-container", show: gameState.totalLives > 20 },
      { id: "qi-purity-container", show: gameState.totalLives > 40 },
      { id: "comprehension-container", show: gameState.highestMeridian >= 12 },
      { id: "qi-capacity-container", show: gameState.meridiansOpened >= 12 },
      { id: "qi-folds-container", show: gameState.meridiansOpened >= 12 },
      {
        id: "circulation-skill-container",
        show: gameState.meridiansOpened >= 12,
      },
    ];

    this.toggleMultipleContainers(containerUpdates);

    // Update upgrade shop less frequently to improve performance
    // Only update shop when samsara points change or when needed
    const currentPoints = gameState.samsaraPoints;
    if (!this.lastSamsaraPoints || this.lastSamsaraPoints !== currentPoints) {
      this.refreshUpgradeShop();
      this.lastSamsaraPoints = currentPoints;
    }
  }

  /**
   * Clear all UI caches - used when game resets
   */
  static clearCache() {
    // Clear all caches when game resets or significant changes occur
    this.elementCache.clear();
    this.lastValues.clear();
    this.lastContainerStates.clear();
    this.lastLogLength = 0;
    this.lastSamsaraPoints = null;
  }

  /**
   * Refresh the upgrade shop display
   */
  static refreshUpgradeShop() {
    const upgradeList = document.getElementById("upgrade-list");
    if (!upgradeList) return;

    // Get all upgrades and sort by price
    const upgrades = Object.entries(shopItems).sort(
      (a, b) => a[1].price - b[1].price
    );

    upgradeList.innerHTML = "";

    upgrades.forEach(([key, upgrade]) => {
      // Check if upgrade should be available based on condition
      const isAvailable = upgrade.condition();
      if (!isAvailable) {
        return;
      }

      // Check if player can afford it
      const canAfford = gameState.samsaraPoints >= upgrade.price;

      // Create upgrade button
      const upgradeButton = document.createElement("button");
      upgradeButton.className = "upgrade-item";
      upgradeButton.innerHTML = `
                <div>${upgrade.name}</div>
                <div class="upgrade-price">Cost: ${upgrade.price} Samsara Points</div>
            `;

      if (!canAfford) {
        // Player can't afford it
        upgradeButton.classList.add("disabled");
        upgradeButton.disabled = true;
      } else {
        // Upgrade is available and affordable
        upgradeButton.onclick = () => this.purchaseUpgrade(key, upgrade);
      }

      upgradeList.appendChild(upgradeButton);
    });
  }

  /**
   * Handle upgrade purchase
   * @param {string} key - The upgrade key
   * @param {Object} upgrade - The upgrade object
   */
  static purchaseUpgrade(key, upgrade) {
    // Double-check conditions before purchase
    if (!upgrade.condition() || gameState.samsaraPoints < upgrade.price) {
      return;
    }

    // Deduct samsara points
    gameState.samsaraPoints -= upgrade.price;

    // Apply upgrade effect
    upgrade.effect();

    // Force shop refresh since conditions may have changed
    this.refreshUpgradeShop();
    this.lastSamsaraPoints = gameState.samsaraPoints;

    // Save game state
    gameSave();

    // Log the purchase - this will trigger a refresh on next tick
    gameState.log.push(`Purchased upgrade: ${upgrade.name}`);
  }
}
