/**
 * Desktop Configuration
 *
 * Configuration for desktop devices
 * Migrated from existing constants to maintain exact behavior
 */

import {
    MindMapConfig,
    LayoutConfig,
    StyleConfig,
    ColorConfig,
    AnimationConfig,
    PerformanceConfig,
    InteractionConfig,
    FontSizeByDepth,
    NumericFontSizeByDepth
} from './types';
import {
    LAYOUT_CONSTANTS,
    STYLE_CONSTANTS,
    COLOR_CONSTANTS,
    ANIMATION_CONSTANTS,
    PERFORMANCE_CONSTANTS,
    getFontSizeByDepth,
    getNumericFontSizeByDepth
} from '../constants/mindmap-constants';

/**
 * Desktop configuration class
 * Provides all configuration values for desktop devices
 */
export class DesktopConfig {
    /**
     * Get the complete desktop configuration
     */
    getConfig(): MindMapConfig {
        return {
            // Device identification
            isMobile: false,
            language: 'en',  // 默认英文

            // Layout configuration
            layout: this.getLayoutConfig(),

            // Style configuration
            style: this.getStyleConfig(),

            // Color configuration
            color: this.getColorConfig(),

            // Animation configuration
            animation: this.getAnimationConfig(),

            // Performance configuration
            performance: this.getPerformanceConfig(),

            // Interaction configuration
            interaction: this.getInteractionConfig(),
        };
    }

    /**
     * Get layout configuration
     * Migrated from LAYOUT_CONSTANTS
     */
    private getLayoutConfig(): LayoutConfig {
        return {
            // Spacing constants
            minNodeGap: LAYOUT_CONSTANTS.MIN_NODE_GAP,
            horizontalSpacing: LAYOUT_CONSTANTS.HORIZONTAL_SPACING,
            verticalSpacing: LAYOUT_CONSTANTS.VERTICAL_SPACING,
            minVerticalGap: LAYOUT_CONSTANTS.MIN_VERTICAL_GAP,

            // Adaptive horizontal spacing configuration
            adaptiveHorizontalSpacing: {
                minSpacing: LAYOUT_CONSTANTS.ADAPTIVE_HORIZONTAL_SPACING.MIN_SPACING,
                maxSpacing: LAYOUT_CONSTANTS.ADAPTIVE_HORIZONTAL_SPACING.MAX_SPACING,
                sourceNodeRatio: LAYOUT_CONSTANTS.ADAPTIVE_HORIZONTAL_SPACING.SOURCE_NODE_RATIO,
                targetNodeRatio: LAYOUT_CONSTANTS.ADAPTIVE_HORIZONTAL_SPACING.TARGET_NODE_RATIO,
                baseSpacing: LAYOUT_CONSTANTS.ADAPTIVE_HORIZONTAL_SPACING.BASE_SPACING,
                safetyMargin: LAYOUT_CONSTANTS.ADAPTIVE_HORIZONTAL_SPACING.SAFETY_MARGIN,
            },

            // Canvas dimensions
            treeHeight: LAYOUT_CONSTANTS.TREE_HEIGHT,
            treeWidth: LAYOUT_CONSTANTS.TREE_WIDTH,
            canvasWidth: LAYOUT_CONSTANTS.CANVAS_WIDTH,
            canvasHeight: LAYOUT_CONSTANTS.CANVAS_HEIGHT,

            // Node spacing
            nodeHeightBuffer: LAYOUT_CONSTANTS.NODE_HEIGHT_BUFFER,

            // Centering calculations
            centerOffsetX: LAYOUT_CONSTANTS.CENTER_OFFSET_X,
            centerOffsetY: LAYOUT_CONSTANTS.CENTER_OFFSET_Y,
        };
    }

    /**
     * Get style configuration
     * Migrated from STYLE_CONSTANTS
     */
    private getStyleConfig(): StyleConfig {
        return {
            // Font sizes by node level
            rootFontSize: STYLE_CONSTANTS.ROOT_FONT_SIZE,
            level1FontSize: STYLE_CONSTANTS.LEVEL_1_FONT_SIZE,
            defaultFontSize: STYLE_CONSTANTS.DEFAULT_FONT_SIZE,

            // Additional font sizes for UI components
            textMeasurementFontSize: STYLE_CONSTANTS.TEXT_MEASUREMENT_FONT_SIZE,
            interactionUiFontSize: STYLE_CONSTANTS.INTERACTION_UI_FONT_SIZE,

            // Node dimensions
            rootNodeMinWidth: STYLE_CONSTANTS.ROOT_NODE_MIN_WIDTH,
            nodeMinWidth: STYLE_CONSTANTS.NODE_MIN_WIDTH,

            // Text calculations
            charWidthRatio: STYLE_CONSTANTS.CHAR_WIDTH_RATIO,

            // Timing constants
            renderFrameDelay: STYLE_CONSTANTS.RENDER_FRAME_DELAY,
        };
    }

    /**
     * Get color configuration
     * Migrated from COLOR_CONSTANTS
     */
    private getColorConfig(): ColorConfig {
        return {
            // Default node colors by level
            root_node_color: COLOR_CONSTANTS.ROOT_NODE_COLOR,
            level_1_color: COLOR_CONSTANTS.LEVEL_1_COLOR,
            default_node_color: COLOR_CONSTANTS.DEFAULT_NODE_COLOR,

            // Selection colors
            selected_node_color: COLOR_CONSTANTS.SELECTED_NODE_COLOR,
            hover_node_color: COLOR_CONSTANTS.HOVER_NODE_COLOR,

            // Link colors
            link_color: COLOR_CONSTANTS.LINK_COLOR,
            link_width: COLOR_CONSTANTS.LINK_WIDTH,
        };
    }

    /**
     * Get animation configuration
     * Migrated from ANIMATION_CONSTANTS
     */
    private getAnimationConfig(): AnimationConfig {
        return {
            // Transition durations (in milliseconds)
            fastTransition: ANIMATION_CONSTANTS.FAST_TRANSITION,
            normalTransition: ANIMATION_CONSTANTS.NORMAL_TRANSITION,
            slowTransition: ANIMATION_CONSTANTS.SLOW_TRANSITION,

            // Easing functions
            easingDefault: ANIMATION_CONSTANTS.EASING_DEFAULT,
            easingElastic: ANIMATION_CONSTANTS.EASING_ELASTIC,
        };
    }

    /**
     * Get performance configuration
     * Migrated from PERFORMANCE_CONSTANTS
     */
    private getPerformanceConfig(): PerformanceConfig {
        return {
            // Rendering thresholds
            maxNodesBeforeVirtualization: PERFORMANCE_CONSTANTS.MAX_NODES_BEFORE_VIRTUALIZATION,

            // Debounce delays (in milliseconds)
            renderDebounceDelay: PERFORMANCE_CONSTANTS.RENDER_DEBOUNCE_DELAY,
            inputDebounceDelay: PERFORMANCE_CONSTANTS.INPUT_DEBOUNCE_DELAY,

            // Cache settings
            maxCacheSize: PERFORMANCE_CONSTANTS.MAX_CACHE_SIZE,
            cacheExpiryTime: PERFORMANCE_CONSTANTS.CACHE_EXPIRY_TIME,
        };
    }

    /**
     * Get interaction configuration
     * Desktop-specific interaction settings
     */
    private getInteractionConfig(): InteractionConfig {
        return {
            // Enable/disable features
            enableDrag: true,
            enableZoom: true,

            // Zoom configuration (desktop mouse wheel zoom)
            zoomScaleExtent: [0.5, 3],

            // Touch configuration (not applicable for desktop)
            touchTargetSize: undefined,
            enableTouchGestures: undefined,
        };
    }

    /**
     * Get font size by node depth
     * Delegates to the existing utility function
     */
    getFontSizeByDepth(): FontSizeByDepth {
        return getFontSizeByDepth;
    }

    /**
     * Get numeric font size by node depth
     * Delegates to the existing utility function
     */
    getNumericFontSizeByDepth(): NumericFontSizeByDepth {
        return getNumericFontSizeByDepth;
    }
}
