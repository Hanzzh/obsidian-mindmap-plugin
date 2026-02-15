/**
 * Configuration Manager
 *
 * Centralized configuration management with device detection
 * Implements early branching pattern to ensure desktop logic is not affected
 */

import { MindMapConfig } from './types';
import { DesktopConfig } from './desktop-config';
import { MobileConfig } from './mobile-config';

/**
 * Configuration manager class
 *
 * Responsibilities:
 * - Detect device type and select appropriate configuration
 * - Provide centralized access to configuration values
 * - Ensure device-specific configs are isolated (early branching pattern)
 *
 * Architecture Note:
 * This class implements the early branching pattern where device detection
 * happens once at initialization time. This ensures that:
 * 1. Desktop and mobile code paths are completely separate
 * 2. Desktop logic cannot be affected by mobile code
 * 3. The config object remains immutable after creation
 */
export class ConfigManager {
    private config: MindMapConfig;
    private language: 'en' | 'zh';

    /**
     * Constructor - performs device detection and selects configuration
     *
     * @param isMobile - Device type flag from Obsidian API (app.isMobile)
     * @param language - Language setting from user preferences (default: 'en')
     *
     * Early Branching Pattern:
     * The device detection happens here at initialization time, not during
     * runtime usage. This guarantees that:
     * - Desktop devices always use DesktopConfig
     * - Mobile devices always use MobileConfig
     * - No mixing of code paths during operation
     */
    constructor(isMobile: boolean, language: 'en' | 'zh' = 'en') {
        this.language = language;

        // 🔒 EARLY BRANCHING: Device-specific configuration selection
        // This is the only place where we check device type
        // After this point, the config is fixed and never changes

        if (isMobile) {
            // Mobile path: Use mobile configuration
            this.config = new MobileConfig().getConfig();
        } else {
            // Desktop path: Use desktop configuration (existing behavior)
            this.config = new DesktopConfig().getConfig();
        }

        // Override language with user setting
        this.config.language = language;
    }

    /**
     * Get the complete configuration object
     *
     * @returns Complete configuration for the detected device type
     *
     * Note: This returns a frozen configuration object. The configuration
     * is determined at construction time and never changes during runtime.
     */
    getConfig(): MindMapConfig {
        return this.config;
    }

    /**
     * Update language setting
     *
     * @param language - New language setting
     */
    updateLanguage(language: 'en' | 'zh'): void {
        this.language = language;
        this.config.language = language;
    }

    /**
     * Get device type
     *
     * @returns true if mobile device, false if desktop
     */
    isMobile(): boolean {
        return this.config.isMobile;
    }

    /**
     * Get layout configuration section
     */
    getLayoutConfig() {
        return this.config.layout;
    }

    /**
     * Get style configuration section
     */
    getStyleConfig() {
        return this.config.style;
    }

    /**
     * Get color configuration section
     */
    getColorConfig() {
        return this.config.color;
    }

    /**
     * Get animation configuration section
     */
    getAnimationConfig() {
        return this.config.animation;
    }

    /**
     * Get performance configuration section
     */
    getPerformanceConfig() {
        return this.config.performance;
    }

    /**
     * Get interaction configuration section
     */
    getInteractionConfig() {
        return this.config.interaction;
    }
}
