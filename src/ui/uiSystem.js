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
   * Check if an element is in a visible container
   * @param {string} elementId - The element ID to check
   * @param {Set} visibleContainers - Set of visible container IDs
   * @returns {boolean} True if element is in a visible container or no container mapping exists
   */
  static isElementInVisibleContainer(elementId, visibleContainers) {
    const containerMapping = this.getElementContainerMapping();
    const containerId = containerMapping[elementId];
    return !containerId || visibleContainers.has(containerId);
  }

  /**
   * Get mapping of element IDs to their container IDs
   * @returns {Object} Mapping of element IDs to container IDs
   */
  static getElementContainerMapping() {
    return {
      "meridian talent": "meridian-talent-container",
      "average age": null, // Always visible
      "highest qi folds": "highest-qi-folds-container",
      "highest dantian grade": null, // Part of advanced stats, controlled by logic
      "average qi folds": "average-qi-folds-container",
      "highest chakras": "highest-chakras-container",
      "average primary meridians": "average-primary-meridians-container",
      "average meridians": "average-meridians-container",
      "highest meridian": "highest-meridian-container",
      age: null, // Always visible
      "combat power": null, // Always visible
      qi: null, // Always visible
      "meridian opened": null, // Always visible
      vitality: "vitality-container",
      wisdom: "wisdom-container",
      luck: "luck-container",
      "samsara-points": null, // Always visible
      "qi purity": "qi-purity-container",
      log: null, // Always visible
      comprehension: "comprehension-container",
      "qi capacity": "qi-capacity-container",
      "qi folds": "qi-folds-container",
      "cycles cleansed": "qi-capacity-container", // Same container as qi capacity
      pillars: "qi-capacity-container", // Same container as qi capacity
      "dantian grade": "qi-capacity-container", // Same container as qi capacity
      "circulation skill": "circulation-skill-container",
      "circulation grade": "circulation-skill-container", // Same container as circulation skill
      acupoints: "acupoints-container",
      "chakras opened": "chakras-container",
    };
  }

  /**
   * Unified UI update that consolidates element updates and container visibility
   * @param {Object} config - Configuration object with elements and containers
   */
  static updateUIWithConsolidatedLogic(config) {
    const { elementUpdates, containerStates } = config;

    // Create set of visible containers for filtering
    const visibleContainers = new Set();
    Object.entries(containerStates).forEach(([containerId, show]) => {
      if (show) {
        visibleContainers.add(containerId);
      }
    });

    // Update containers first
    const containerConfigs = Object.entries(containerStates).map(
      ([id, show]) => ({ id, show })
    );
    this.toggleMultipleContainers(containerConfigs);

    // Update elements, filtering by visible containers
    this.updateMultipleElements(elementUpdates, visibleContainers);
  }

  /**
   * Refresh UI for a new life - shows overview statistics
   */
  static refreshClientNewLife() {
    // Clear cache for new life to ensure fresh state
    this.clearCache();

    // Consolidated logic: determine visibility states and element values together
    const isAdvancedPlayer = gameState.highestMeridian >= 12;
    const hasChakras = gameState.highestChakra > 0;
    const hasAgeAt12thMeridian =
      gameState.averageLifeStats.ageAt12thMeridian != null;

    // Prepare all element updates
    const elementUpdates = {
      "meridian talent": GameInitializer.getMeridianEstimate(),
      "average age": gameState.averageLifeStats.ageAtDeath,
    };

    // Add conditional elements based on consolidated logic
    if (isAdvancedPlayer) {
      elementUpdates["highest qi folds"] = gameState.highestQiFold;
      elementUpdates["highest dantian grade"] = gameState.highestDantian;
      elementUpdates["average qi folds"] =
        gameState.averageLifeStats.qiFoldsAtDeath;

      if (hasChakras) {
        elementUpdates["highest chakras"] = gameState.highestChakra;
      }

      if (hasAgeAt12thMeridian) {
        elementUpdates["average primary meridians"] =
          gameState.averageLifeStats.ageAt12thMeridian;
      } else {
        elementUpdates["average meridians"] =
          gameState.averageLifeStats.meridiansOpenedAtDeath;
      }
    } else {
      elementUpdates["highest meridian"] = gameState.highestMeridian;
      if (!hasAgeAt12thMeridian) {
        elementUpdates["average meridians"] =
          gameState.averageLifeStats.meridiansOpenedAtDeath;
      }
    }

    // Prepare container states using the same consolidated logic
    const containerStates = {
      "highest-qi-folds-container": isAdvancedPlayer,
      "highest-chakras-container": isAdvancedPlayer && hasChakras,
      "comprehension-container": isAdvancedPlayer,
      "average-qi-folds-container": isAdvancedPlayer,
      "average-primary-meridians-container":
        isAdvancedPlayer && hasAgeAt12thMeridian,
      "highest-meridian-container": !isAdvancedPlayer,
      "average-meridians-container":
        (!isAdvancedPlayer && !hasAgeAt12thMeridian) ||
        (isAdvancedPlayer && !hasAgeAt12thMeridian),
    };

    // Use consolidated update method
    this.updateUIWithConsolidatedLogic({
      elementUpdates,
      containerStates,
    });
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

      // Only show acupoints and chakras if dantian grade > 0
      if (gameState.dantianGrade > 0) {
        elements["acupoints"] = gameState.acupoints;
        elements["chakras opened"] = gameState.openedChakras;
      }
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
        id: "acupoints-container",
        show: gameState.meridiansOpened >= 12 && gameState.dantianGrade > 0,
      },
      {
        id: "chakras-container",
        show: gameState.meridiansOpened >= 12 && gameState.dantianGrade > 0,
      },
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
