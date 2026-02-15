/**
 * Font Size Manager
 *
 * Centralized font size management for mind map components
 * Provides type-safe methods for getting font sizes by depth
 */

import { STYLE_CONSTANTS, getFontSizeByDepth, getNumericFontSizeByDepth } from '../constants/mindmap-constants';

/**
 * Font Size Manager Class
 *
 * Provides a centralized interface for managing font sizes
 * across all mind map components and renderers
 */
export class FontSizeManager {

    /**
     * Get font size by node depth
     * @param depth - The depth level of the node (0 = root, 1 = first level, etc.)
     * @returns Font size string with px unit
     */
    static getFontSize(depth: number): string {
        return getFontSizeByDepth(depth);
    }

    /**
     * Get numeric font size by node depth
     * @param depth - The depth level of the node (0 = root, 1 = first level, etc.)
     * @returns Numeric font size without px unit
     */
    static getNumericFontSize(depth: number): number {
        return getNumericFontSizeByDepth(depth);
    }

    /**
     * Get text measurement font size
     * @returns Font size string for text measurement operations
     */
    static getTextMeasurementFontSize(): string {
        return STYLE_CONSTANTS.TEXT_MEASUREMENT_FONT_SIZE;
    }

    /**
     * Get interaction UI font size
     * @returns Font size string for UI interaction elements
     */
    static getInteractionUIFontSize(): string {
        return STYLE_CONSTANTS.INTERACTION_UI_FONT_SIZE;
    }

    /**
     * Validate if a font size string is valid
     * @param fontSize - Font size string to validate
     * @returns True if valid, false otherwise
     */
    static isValidFontSize(fontSize: string): boolean {
        return /^\d+px$/.test(fontSize);
    }

    /**
     * Convert font size string to number
     * @param fontSize - Font size string (e.g., "15px")
     * @returns Numeric font size without px unit
     */
    static fontSizeToNumber(fontSize: string): number {
        return parseInt(fontSize.replace('px', ''));
    }

    /**
     * Get all available font sizes by depth
     * @returns Object mapping depths to font sizes
     */
    static getAllFontSizes(): { [depth: number]: string } {
        return {
            0: STYLE_CONSTANTS.ROOT_FONT_SIZE,
            1: STYLE_CONSTANTS.LEVEL_1_FONT_SIZE,
            2: STYLE_CONSTANTS.DEFAULT_FONT_SIZE
        };
    }

    /**
     * Check if font sizes are consistent between different depths
     * @returns True if font sizes are properly ordered (root > level1 > default)
     */
    static validateFontSizeConsistency(): boolean {
        const rootSize = this.fontSizeToNumber(STYLE_CONSTANTS.ROOT_FONT_SIZE);
        const level1Size = this.fontSizeToNumber(STYLE_CONSTANTS.LEVEL_1_FONT_SIZE);
        const defaultSize = this.fontSizeToNumber(STYLE_CONSTANTS.DEFAULT_FONT_SIZE);

        return rootSize > level1Size && level1Size >= defaultSize;
    }
}

/**
 * Font size constants for easy access
 */
export const FONT_SIZES = {
    ROOT: STYLE_CONSTANTS.ROOT_FONT_SIZE,
    LEVEL_1: STYLE_CONSTANTS.LEVEL_1_FONT_SIZE,
    DEFAULT: STYLE_CONSTANTS.DEFAULT_FONT_SIZE,
    TEXT_MEASUREMENT: STYLE_CONSTANTS.TEXT_MEASUREMENT_FONT_SIZE,
    INTERACTION_UI: STYLE_CONSTANTS.INTERACTION_UI_FONT_SIZE
} as const;