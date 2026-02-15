/**
 * Mobile Configuration
 *
 * Configuration for mobile devices
 * Phase 2: Implemented with mobile-optimized values
 */

import { MindMapConfig } from './types';
import { DesktopConfig } from './desktop-config';

/**
 * Mobile configuration class
 * Phase 2: Fully implemented with mobile-specific optimizations
 *
 * Mobile optimizations applied:
 * - Reduced spacing values (20-30% smaller) for compact mobile screens
 * - Larger touch targets (minimum 44px) for better touch interaction
 * - Optimized font sizes for mobile readability
 * - Shorter animation durations for mobile performance
 * - More aggressive debouncing for touch interactions
 */
export class MobileConfig {
    /**
     * Get the complete mobile configuration
     * Phase 2: Returns fully optimized mobile configuration
     */
    getConfig(): MindMapConfig {
        // Get desktop config as base
        const desktopConfig = new DesktopConfig();
        const desktopValues = desktopConfig.getConfig();

        return {
            // Device identification
            isMobile: true,
            language: 'en',  // 默认英文

            // Layout configuration - Mobile optimized
            layout: {
                // Spacing constants - Reduced by 20-30% for compact mobile screens
                minNodeGap: 20,                      // Reduced from 25 (20% reduction)
                horizontalSpacing: 154,              // Reduced from 220 (30% reduction)
                verticalSpacing: 88,                 // Reduced from 110 (20% reduction)
                minVerticalGap: 20,                  // Reduced from 25 (20% reduction)

                // Adaptive horizontal spacing - Mobile optimized
                adaptiveHorizontalSpacing: {
                    minSpacing: 56,                  // Reduced from 80 (30% reduction)
                    maxSpacing: 210,                 // Reduced from 300 (30% reduction)
                    sourceNodeRatio: 0.15,           // Same as desktop
                    targetNodeRatio: 0.10,           // Same as desktop
                    baseSpacing: 42,                 // Reduced from 60 (30% reduction)
                    safetyMargin: 7,                 // Reduced from 10 (30% reduction)
                },

                // Canvas dimensions - Same as desktop (canvas size independent of device)
                treeHeight: desktopValues.layout.treeHeight,
                treeWidth: desktopValues.layout.treeWidth,
                canvasWidth: desktopValues.layout.canvasWidth,
                canvasHeight: desktopValues.layout.canvasHeight,

                // Node spacing
                nodeHeightBuffer: 12,                // Reduced from 15 (20% reduction)

                // Centering calculations
                centerOffsetX: desktopValues.layout.centerOffsetX,
                centerOffsetY: desktopValues.layout.centerOffsetY,
            },

            // Style configuration - Mobile optimized for readability
            style: {
                // Font sizes - Slightly larger for mobile readability
                rootFontSize: desktopValues.style.rootFontSize,
                level1FontSize: "19px",              // Increased from 18px for better readability
                defaultFontSize: "16px",             // Increased from 15px for mobile

                // Additional font sizes
                textMeasurementFontSize: desktopValues.style.textMeasurementFontSize,
                interactionUiFontSize: desktopValues.style.interactionUiFontSize,

                // Node dimensions
                rootNodeMinWidth: desktopValues.style.rootNodeMinWidth,
                nodeMinWidth: desktopValues.style.nodeMinWidth,

                // Text calculations
                charWidthRatio: desktopValues.style.charWidthRatio,

                // Timing constants
                renderFrameDelay: desktopValues.style.renderFrameDelay,
            },

            // Color configuration - Same as desktop
            color: desktopValues.color,

            // Animation configuration - Optimized for mobile performance
            animation: {
                // Transition durations - Shorter for better mobile performance
                fastTransition: 100,                 // Reduced from 150ms
                normalTransition: 200,               // Reduced from 300ms
                slowTransition: 300,                 // Reduced from 500ms

                // Easing functions
                easingDefault: desktopValues.animation.easingDefault,
                easingElastic: desktopValues.animation.easingElastic,
            },

            // Performance configuration - Mobile optimized
            performance: {
                // Rendering thresholds
                maxNodesBeforeVirtualization: desktopValues.performance.maxNodesBeforeVirtualization,

                // Debounce delays - More aggressive for mobile touch interactions
                renderDebounceDelay: 150,            // Increased from 100ms (reduce re-renders)
                inputDebounceDelay: 400,             // Increased from 300ms (better for touch)

                // Cache settings
                maxCacheSize: desktopValues.performance.maxCacheSize,
                cacheExpiryTime: desktopValues.performance.cacheExpiryTime,
            },

            // Interaction configuration - Mobile specific
            interaction: {
                // Enable/disable features
                enableDrag: true,
                enableZoom: true,

                // Zoom configuration
                zoomScaleExtent: [0.5, 3],           // Same as desktop

                // Mobile-specific: Touch interaction settings
                touchTargetSize: 44,                 // iOS HIG standard (44pt minimum)
                enableTouchGestures: true,           // Enable pinch zoom, touch drag
            },
        };
    }
}
