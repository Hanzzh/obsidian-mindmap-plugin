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
    minNodeGap: number;                    // 最小节点间距
    horizontalSpacing: number;             // 水平基础间距
    verticalSpacing: number;               // 垂直基础间距
    minVerticalGap: number;                // 最小垂直间距

    // Adaptive horizontal spacing configuration
    adaptiveHorizontalSpacing: {
        minSpacing: number;                // 最小水平间距（防止重叠）
        maxSpacing: number;                // 最大水平间距（避免过度分散）
        sourceNodeRatio: number;           // 基于源节点宽度的比例
        targetNodeRatio: number;           // 基于目标节点宽度的比例
        baseSpacing: number;               // 基础间距
        safetyMargin: number;              // 安全边距
    };

    // Canvas dimensions
    treeHeight: number;                    // 树高度
    treeWidth: number;                     // 树宽度
    canvasWidth: number;                   // 画布宽度
    canvasHeight: number;                  // 画布高度

    // Node spacing
    nodeHeightBuffer: number;              // 节点高度缓冲

    // Centering calculations
    centerOffsetX: number;                 // 水平居中偏移
    centerOffsetY: number;                 // 垂直居中偏移
}

/**
 * Style configuration for fonts, colors, and dimensions
 */
export interface StyleConfig {
    // Font sizes by node level
    rootFontSize: string;                  // 根节点字体大小
    level1FontSize: string;                // 一级节点字体大小
    defaultFontSize: string;               // 默认字体大小

    // Additional font sizes for UI components
    textMeasurementFontSize: string;       // 文本测量字体大小
    interactionUiFontSize: string;         // 交互UI字体大小

    // Node dimensions
    rootNodeMinWidth: number;              // 根节点最小宽度
    nodeMinWidth: number;                  // 普通节点最小宽度

    // Text calculations
    charWidthRatio: number;                // 字符宽度比例

    // Timing constants
    renderFrameDelay: number;              // 渲染帧延迟（约一帧的时间）
}

/**
 * Color configuration for nodes, links, and UI elements
 */
export interface ColorConfig {
    // Default node colors by level
    root_node_color: string;               // 根节点颜色
    level_1_color: string;                 // 一级节点颜色
    default_node_color: string;            // 默认节点颜色

    // Selection colors
    selected_node_color: string;           // 选中节点颜色
    hover_node_color: string;              // 悬停节点颜色

    // Link colors
    link_color: string;                    // 连接线颜色
    link_width: number;                    // 连接线宽度
}

/**
 * Animation configuration for transitions and effects
 */
export interface AnimationConfig {
    // Transition durations (in milliseconds)
    fastTransition: number;                // 快速过渡
    normalTransition: number;              // 正常过渡
    slowTransition: number;                // 慢速过渡

    // Easing functions
    easingDefault: string;                 // 默认缓动函数
    easingElastic: string;                 // 弹性缓动
}

/**
 * Performance configuration for rendering and caching
 */
export interface PerformanceConfig {
    // Rendering thresholds
    maxNodesBeforeVirtualization: number;  // 虚拟化阈值

    // Debounce delays (in milliseconds)
    renderDebounceDelay: number;           // 渲染防抖延迟
    inputDebounceDelay: number;            // 输入防抖延迟

    // Cache settings
    maxCacheSize: number;                  // 最大缓存大小
    cacheExpiryTime: number;               // 缓存过期时间（5分钟）
}

/**
 * Interaction configuration for user inputs and gestures
 */
export interface InteractionConfig {
    // Enable/disable features
    enableDrag: boolean;                   // 启用拖拽
    enableZoom: boolean;                   // 启用缩放

    // Zoom configuration
    zoomScaleExtent: [number, number];     // 缩放范围 [最小, 最大]

    // Touch configuration (mobile-specific)
    touchTargetSize?: number;              // 触摸目标最小尺寸 (px)
    enableTouchGestures?: boolean;         // 启用触摸手势
}

/**
 * Main configuration interface combining all config sections
 */
export interface MindMapConfig {
    // Device identification
    isMobile: boolean;                     // 是否为移动设备
    language: SupportedLanguage;           // 语言设置 (默认: 'en')

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
