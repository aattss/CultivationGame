import { CONSTANTS } from "../config/constants.js";
import { gameState } from "../data/gameState.js";
import { shopItems } from "../data/shopItems.js";
import { CultivationSystem } from "../mechanics/cultivationSystem.js";
import { gameSave } from "../core/persistence.js";
import { Utility } from "../utils/utility.js";
/**
 * UI System
 * Handles all user interface updates and interactions
 */
export class UISystem {
    /**
     * Get a cached DOM element
     * @param elementId - The ID of the element to retrieve
     * @returns The cached element or null if not found
     */
    static getElement(elementId) {
        if (!this.elementCache.has(elementId)) {
            const element = document.getElementById(elementId);
            if (element) {
                this.elementCache.set(elementId, element);
            }
        }
        return this.elementCache.get(elementId) || null;
    }
    /**
     * Toggle visibility of a container element
     * @param containerId - The ID of the container to toggle
     * @param show - Whether to show or hide the container
     */
    static toggleContainerVisibility(containerId, show) {
        // Skip if state hasn't changed
        const lastState = this.lastContainerStates.get(containerId);
        if (lastState === show)
            return;
        const container = this.getElement(containerId);
        if (container) {
            container.style.display = show ? "block" : "none";
            this.lastContainerStates.set(containerId, show);
        }
    }
    /**
     * Update the content of an element if it has changed
     * @param elementId - The ID of the element to update
     * @param value - The new value to set
     */
    static updateElementContent(elementId, value) {
        // Skip if value hasn't changed
        const lastValue = this.lastValues.get(elementId);
        if (lastValue === value)
            return;
        const element = this.getElement(elementId);
        if (element) {
            element.innerHTML = String(value);
            this.lastValues.set(elementId, value);
        }
    }
    /**
     * Update multiple elements in a single batch operation, optionally filtering by visible containers
     * @param elements - Object mapping element IDs to new values
     * @param visibleContainers - Optional set of visible container IDs to filter updates
     */
    static updateMultipleElements(elements, visibleContainers = null) {
        // Batch DOM updates by collecting all changes first
        const updates = [];
        Object.entries(elements).forEach(([id, value]) => {
            // Skip updates for elements in hidden containers if filtering is enabled
            if (visibleContainers &&
                !this.isElementInVisibleContainer(id, visibleContainers)) {
                return;
            }
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
                element.innerHTML = String(value);
                this.lastValues.set(id, value);
            });
        }
    }
    /**
     * Toggle visibility of multiple containers in a single batch operation
     * @param containerConfigs - Array of container configurations
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
     * @param elementId - The element ID to check
     * @param visibleContainers - Set of visible container IDs
     * @returns True if element is in a visible container or no container mapping exists
     */
    static isElementInVisibleContainer(elementId, visibleContainers) {
        const containerMapping = this.getElementContainerMapping();
        const containerId = containerMapping[elementId];
        return !containerId || visibleContainers.has(containerId);
    }
    /**
     * Get mapping of element IDs to their container IDs
     * @returns Mapping of element IDs to container IDs
     */
    static getElementContainerMapping() {
        return {
            "meridian talent": "meridian-talent-container",
            "average age": null, // Always visible
            "highest qi folds": "highest-qi-folds-container",
            "highest dantian grade": "highest-dantian-container", // Part of advanced stats, controlled by logic
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
            "cycles cleansed": "dantian-formation-container", // Same container as qi capacity
            "organs purified": "qi-capacity-container", // Same container as qi capacity
            pillars: "dantian-formation-container", // Same container as qi capacity
            "dantian grade": "dantian-formation-container", // Same container as qi capacity
            "circulation skill": "circulation-skill-container",
            "circulation grade": "circulation-skill-container", // Same container as circulation skill
            acupoints: "acupoints-container",
            "chakras opened": "chakras-container",
            "toggle extra meridians": "toggle-extra-meridians-container",
        };
    }
    /**
     * Unified UI update that consolidates element updates and container visibility
     * @param config - Configuration object with elements and containers
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
        const containerConfigs = Object.entries(containerStates).map(([id, show]) => ({ id, show }));
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
        const hasOpenedMeridians = gameState.highestMeridian >= 12;
        const hasChakras = gameState.highestChakra > 0;
        const hasAgeAt12thMeridian = gameState.averageLifeStats.ageAt12thMeridian != null;
        const showMeridianTalent = gameState.totalLives > 8;
        // Prepare ALL element updates - no conditional logic here
        const elementUpdates = {
            "meridian talent": Utility.getPotentialEstimate(gameState.meridianTalent),
            "average age": gameState.averageLifeStats.ageAtDeath,
            "highest qi folds": gameState.highestQiFold,
            "highest dantian grade": gameState.highestDantian,
            "average qi folds": gameState.averageLifeStats.qiFoldsAtDeath,
            "highest chakras": gameState.highestChakra,
            "average primary meridians": gameState.averageLifeStats.ageAt12thMeridian || 0,
            "average meridians": gameState.averageLifeStats.meridiansOpenedAtDeath,
            "highest meridian": gameState.highestMeridian,
        };
        // Prepare container states using the same consolidated logic
        const containerStates = {
            "meridian-talent-container": showMeridianTalent,
            "highest-qi-folds-container": hasOpenedMeridians,
            "highest-chakras-container": hasOpenedMeridians && hasChakras,
            "comprehension-container": hasOpenedMeridians,
            "average-qi-folds-container": hasOpenedMeridians,
            "average-primary-meridians-container": hasOpenedMeridians && hasAgeAt12thMeridian,
            "highest-meridian-container": !hasOpenedMeridians,
            "highest-dantian-container": gameState.highestDantian > 0,
            "average-meridians-container": (!hasOpenedMeridians && !hasAgeAt12thMeridian) ||
                (hasOpenedMeridians && !hasAgeAt12thMeridian),
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
        // Consolidated logic: determine all visibility states once
        const hasAdvancedMeridians = gameState.meridiansOpened >= 12;
        const hasComprehension = gameState.highestMeridian >= 12;
        const hasCleanseCycle = gameState.cyclesCleansed > 0;
        const hasAdvancedDantian = gameState.dantianGrade > 0;
        const showVitality = gameState.totalLives > 2;
        const showWisdom = gameState.totalLives > 14;
        const showLuck = gameState.totalLives > 20;
        const showQiPurity = gameState.totalLives > 40;
        // Prepare ALL element updates - no conditional logic here
        const elementUpdates = {
            age: gameState.age,
            "combat power": CultivationSystem.getCombatPower() || 0,
            qi: gameState.qi,
            "meridian opened": gameState.meridiansOpened,
            vitality: gameState.vitality,
            wisdom: gameState.wisdom,
            luck: gameState.luck,
            "samsara-points": gameState.samsaraPoints,
            "qi purity": gameState.qiPurity,
            comprehension: gameState.comprehension,
            "qi capacity": CultivationSystem.getQiCapacity(),
            "qi folds": gameState.qiFolds,
            "organs purified": gameState.organsPurified,
            "cycles cleansed": gameState.cyclesCleansed,
            pillars: gameState.pillars,
            "dantian grade": gameState.dantianGrade,
            "circulation skill": gameState.circulationSkill,
            "circulation grade": gameState.circulationGrade,
            acupoints: gameState.acupoints,
            "chakras opened": gameState.openedChakras,
            "toggle extra meridians": gameState.extraMeridiansEnabled
                ? "Disable extra meridians"
                : "Enable extra meridians",
        };
        // Only update log if it actually changed
        if (logUpdated) {
            elementUpdates["log"] = gameState.log.join("\r\n");
        }
        // Container visibility controls what gets displayed - this is the ONLY conditional logic
        const containerStates = {
            "vitality-container": showVitality,
            "wisdom-container": showWisdom,
            "luck-container": showLuck,
            "qi-purity-container": showQiPurity,
            "comprehension-container": hasComprehension,
            "qi-capacity-container": hasAdvancedMeridians,
            "dantian-formation-container": hasCleanseCycle,
            "qi-folds-container": hasAdvancedMeridians,
            "acupoints-container": hasAdvancedMeridians,
            "chakras-container": hasAdvancedMeridians && hasAdvancedDantian,
            "circulation-skill-container": hasAdvancedMeridians,
            "toggle-extra-meridians-container": gameState.shopUpgrades.extraMeridians >= 1,
        };
        // Use consolidated update method
        this.updateUIWithConsolidatedLogic({
            elementUpdates,
            containerStates,
        });
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
        if (!upgradeList)
            return;
        // Get all upgrades and sort by price
        const upgrades = Object.entries(shopItems).sort((a, b) => a[1].price - b[1].price);
        upgradeList.innerHTML = "";
        let displayedCount = 0;
        const maxDisplayed = 4;
        for (const [key, upgrade] of upgrades) {
            // Stop if we've already displayed 4 upgrades
            if (displayedCount >= maxDisplayed) {
                break;
            }
            // Check if upgrade should be available based on condition
            const isAvailable = upgrade.condition();
            if (!isAvailable) {
                continue;
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
            }
            else {
                // Upgrade is available and affordable
                upgradeButton.onclick = () => this.purchaseUpgrade(key, upgrade);
            }
            upgradeList.appendChild(upgradeButton);
            displayedCount++;
        }
    }
    /**
     * Handle upgrade purchase
     * @param key - The upgrade key
     * @param upgrade - The upgrade object
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
UISystem.elementCache = new Map();
UISystem.lastValues = new Map();
UISystem.lastContainerStates = new Map();
UISystem.lastLogLength = 0;
UISystem.lastSamsaraPoints = null;
//# sourceMappingURL=uiSystem.js.map