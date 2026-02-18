/**
 * Configuration Types
 *
 * Type definitions for device-specific configurations
 */

import { SupportedLanguage } from '../i18n/types';

// ============================================================================
// Configuration Interfaces
// ============================================================================

/**
 * Layout configuration for node positioning and spacing
 */
export interface LayoutConfig {
    // Spacing constants
    minNodeGap: number;                    // Minimum node gap
    horizontalSpacing: number;             // Horizontal base spacing
    verticalSpacing: number;               // Vertical base spacing
    minVerticalGap: number;                // Minimum vertical gap

    // Adaptive horizontal spacing configuration
    adaptiveHorizontalSpacing: {
        minSpacing: number;                // Minimum horizontal spacing (prevent overlap)
        maxSpacing: number;                // Maximum horizontal spacing (avoid excessive spread)
        sourceNodeRatio: number;           // Ratio based on source node width
        targetNodeRatio: number;           // Ratio based on target node width
        baseSpacing: number;               // Base spacing
        safetyMargin: number;              // Safety margin
    };

    // Canvas dimensions
    treeHeight: number;                    // Tree height
    treeWidth: number;                     // Tree width
    canvasWidth: number;                   // Canvas width
    canvasHeight: number;                  // Canvas height

    // Node spacing
    nodeHeightBuffer: number;              // Node height buffer

    // Centering calculations
    centerOffsetX: number;                 // Horizontal center offset
    centerOffsetY: number;                 // Vertical center offset
}

/**
 * Style configuration for fonts, colors, and dimensions
 */
export interface StyleConfig {
    // Font sizes by node level
    rootFontSize: string;                  // Root node font size
    level1FontSize: string;                // Level 1 node font size
    defaultFontSize: string;               // Default font size

    // Additional font sizes for UI components
    textMeasurementFontSize: string;       // Text measurement font size
    interactionUiFontSize: string;         // Interaction UI font size

    // Node dimensions
    rootNodeMinWidth: number;              // Root node minimum width
    nodeMinWidth: number;                  // Regular node minimum width

    // Text calculations
    charWidthRatio: number;                // Character width ratio

    // Timing constants
    renderFrameDelay: number;              // Render frame delay (approximately one frame)
}

/**
 * Color configuration for nodes, links, and UI elements
 */
export interface ColorConfig {
    // Default node colors by level
    root_node_color: string;               // Root node color
    level_1_color: string;                 // Level 1 node color
    default_node_color: string;            // Default node color

    // Selection colors
    selected_node_color: string;           // Selected node color
    hover_node_color: string;              // Hover node color

    // Link colors
    link_color: string;                    // Connection line color
    link_width: number;                    // Connection line width
}

/**
 * Animation configuration for transitions and effects
 */
export interface AnimationConfig {
    // Transition durations (in milliseconds)
    fastTransition: number;                // Fast transition
    normalTransition: number;              // Normal transition
    slowTransition: number;                // Slow transition

    // Easing functions
    easingDefault: string;                 // Default easing function
    easingElastic: string;                 // Elastic easing
}

/**
 * Performance configuration for rendering and caching
 */
export interface PerformanceConfig {
    // Rendering thresholds
    maxNodesBeforeVirtualization: number;  // Virtualization threshold

    // Debounce delays (in milliseconds)
    renderDebounceDelay: number;           // Render debounce delay
    inputDebounceDelay: number;            // Input debounce delay

    // Cache settings
    maxCacheSize: number;                  // Maximum cache size
    cacheExpiryTime: number;               // Cache expiry time (5 minutes)
}

/**
 * Interaction configuration for user inputs and gestures
 */
export interface InteractionConfig {
    // Enable/disable features
    enableDrag: boolean;                   // Enable drag
    enableZoom: boolean;                   // Enable zoom

    // Zoom configuration
    zoomScaleExtent: [number, number];     // Zoom range [min, max]

    // Touch configuration (mobile-specific)
    touchTargetSize?: number;              // Touch target minimum size (px)
    enableTouchGestures?: boolean;         // Enable touch gestures
}

/**
 * Main configuration interface combining all config sections
 */
export interface MindMapConfig {
    // Device identification
    isMobile: boolean;                     // Whether mobile device
    language: SupportedLanguage;           // Language setting (default: 'en')

    // Configuration sections
    layout: LayoutConfig;
    style: StyleConfig;
    color: ColorConfig;
    animation: AnimationConfig;
    performance: PerformanceConfig;
    interaction: InteractionConfig;
}

/**
 * Font size callback type for getting font by depth
 */
export type FontSizeByDepth = (depth: number) => string;

/**
 * Numeric font size callback type
 */
export type NumericFontSizeByDepth = (depth: number) => number;
