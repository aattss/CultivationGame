import type { ElementCache, ValueCache, ContainerStateCache, ShopItem } from "../types/gameTypes.js";
/**
 * UI System
 * Handles all user interface updates and interactions
 */
export declare class UISystem {
    static elementCache: ElementCache;
    static lastValues: ValueCache;
    static lastContainerStates: ContainerStateCache;
    static lastLogLength: {
        [key: string]: number;
    };
    static currentLogType: string;
    static lastSamsaraPoints: number | null;
    /**
     * Get a cached DOM element
     * @param elementId - The ID of the element to retrieve
     * @returns The cached element or null if not found
     */
    static getElement(elementId: string): HTMLElement | null;
    /**
     * Toggle visibility of a container element
     * @param containerId - The ID of the container to toggle
     * @param show - Whether to show or hide the container
     */
    static toggleContainerVisibility(containerId: string, show: boolean): void;
    /**
     * Update the content of an element if it has changed
     * @param elementId - The ID of the element to update
     * @param value - The new value to set
     */
    static updateElementContent(elementId: string, value: string | number): void;
    /**
     * Update multiple elements in a single batch operation, optionally filtering by visible containers
     * @param elements - Object mapping element IDs to new values
     * @param visibleContainers - Optional set of visible container IDs to filter updates
     */
    static updateMultipleElements(elements: Record<string, string | number>, visibleContainers?: Set<string> | null): void;
    /**
     * Toggle visibility of multiple containers in a single batch operation
     * @param containerConfigs - Array of container configurations
     */
    static toggleMultipleContainers(containerConfigs: Array<string | {
        id: string;
        show: boolean;
    }>): void;
    /**
     * Check if an element is in a visible container
     * @param elementId - The element ID to check
     * @param visibleContainers - Set of visible container IDs
     * @returns True if element is in a visible container or no container mapping exists
     */
    static isElementInVisibleContainer(elementId: string, visibleContainers: Set<string>): boolean;
    /**
     * Get mapping of element IDs to their container IDs
     * @returns Mapping of element IDs to container IDs
     */
    static getElementContainerMapping(): Record<string, string | null>;
    /**
     * Unified UI update that consolidates element updates and container visibility
     * @param config - Configuration object with elements and containers
     */
    static updateUIWithConsolidatedLogic(config: {
        elementUpdates: Record<string, string | number>;
        containerStates: Record<string, boolean>;
    }): void;
    /**
     * Refresh UI for a new life - shows overview statistics
     */
    static refreshClientNewLife(): void;
    /**
     * Refresh the main game client UI during gameplay
     */
    static refreshClient(): void;
    /**
     * Clear all UI caches - used when game resets
     */
    static clearCache(): void;
    /**
     * Refresh the upgrade shop display
     */
    static refreshUpgradeShop(): void;
    /**
     * Handle upgrade purchase
     * @param key - The upgrade key
     * @param upgrade - The upgrade object
     */
    static purchaseUpgrade(key: string, upgrade: ShopItem): void;
    /**
     * Get the content of the currently selected log
     * @returns The current log content as a string
     */
    static getCurrentLogContent(): string;
    /**
     * Switch to a different log type
     * @param logType - The log type to switch to
     */
    static switchLogType(logType: string): void;
}
//# sourceMappingURL=uiSystem.d.ts.map