/**
 * Mind Map Plugin Constants
 *
 * Centralized constants for consistent configuration
 */

// ============================================================================
// View Type Constants
// ============================================================================

export const MIND_MAP_VIEW_TYPE = "mind-map-view";

// ============================================================================
// File Detection Constants
// ============================================================================

export const MINDMAP_IDENTIFIER = "#mindmap";
export const MARKDOWN_EXTENSION = "md";

// ============================================================================
// Layout Constants
// ============================================================================

export const LAYOUT_CONSTANTS = {
    // Spacing constants
    MIN_NODE_GAP: 25,                    // 最小节点间距
    HORIZONTAL_SPACING: 220,             // 水平基础间距（备用值）
    VERTICAL_SPACING: 110,               // 垂直基础间距
    MIN_VERTICAL_GAP: 25,                // 最小垂直间距

    // 自适应水平间距配置
    ADAPTIVE_HORIZONTAL_SPACING: {
        MIN_SPACING: 80,                 // 最小水平间距（防止重叠）
        MAX_SPACING: 300,                // 最大水平间距（避免过度分散）
        SOURCE_NODE_RATIO: 0.15,         // 基于源节点宽度的比例
        TARGET_NODE_RATIO: 0.10,         // 基于目标节点宽度的比例
        BASE_SPACING: 60,                // 基础间距
        SAFETY_MARGIN: 10,               // 安全边距
    } as const,

    // Canvas dimensions (will become dynamic)
    TREE_HEIGHT: 800,                    // 树高度
    TREE_WIDTH: 1400,                    // 树宽度
    CANVAS_WIDTH: 1600,                  // 画布宽度
    CANVAS_HEIGHT: 1000,                 // 画布高度

    // Node spacing
    NODE_HEIGHT_BUFFER: 15,              // 节点高度缓冲

    // Centering calculations
    CENTER_OFFSET_X: (1600 - 1600) / 2,  // 水平居中偏移
    CENTER_OFFSET_Y: (1000 - 1000) / 2,  // 垂直居中偏移
} as const;

// ============================================================================
// Style Constants
// ============================================================================

export const STYLE_CONSTANTS = {
    // Font sizes by node level
    ROOT_FONT_SIZE: "20px",              // 根节点字体大小
    LEVEL_1_FONT_SIZE: "18px",           // 一级节点字体大小
    DEFAULT_FONT_SIZE: "15px",           // 默认字体大小（从13px增加到15px）

    // Additional font sizes for UI components
    TEXT_MEASUREMENT_FONT_SIZE: "14px",  // 文本测量字体大小
    INTERACTION_UI_FONT_SIZE: "14px",    // 交互UI字体大小

    // Node dimensions
    ROOT_NODE_MIN_WIDTH: 120,            // 根节点最小宽度
    NODE_MIN_WIDTH: 100,                 // 普通节点最小宽度

    // Text calculations
    CHAR_WIDTH_RATIO: 0.62,              // 字符宽度比例

    // Timing constants
    RENDER_FRAME_DELAY: 16,              // 渲染帧延迟（约一帧的时间）
} as const;

/**
 * Get font size by node depth
 * @param depth - The depth level of the node (0 = root, 1 = first level, etc.)
 * @returns Font size string with px unit
 */
export const getFontSizeByDepth = (depth: number): string => {
    switch (depth) {
        case 0: return STYLE_CONSTANTS.ROOT_FONT_SIZE;
        case 1: return STYLE_CONSTANTS.LEVEL_1_FONT_SIZE;
        default: return STYLE_CONSTANTS.DEFAULT_FONT_SIZE;
    }
};

/**
 * Get numeric font size by node depth
 * @param depth - The depth level of the node (0 = root, 1 = first level, etc.)
 * @returns Numeric font size without px unit
 */
export const getNumericFontSizeByDepth = (depth: number): number => {
    return parseInt(getFontSizeByDepth(depth).replace('px', ''));
};

// ============================================================================
// Color Constants
// ============================================================================

export const COLOR_CONSTANTS = {
    // Default node colors by level
    ROOT_NODE_COLOR: "#4CAF50",          // 根节点颜色
    LEVEL_1_COLOR: "#2196F3",            // 一级节点颜色
    DEFAULT_NODE_COLOR: "#666666",       // 默认节点颜色

    // Selection colors
    SELECTED_NODE_COLOR: "#FF9800",      // 选中节点颜色
    HOVER_NODE_COLOR: "#FFC107",         // 悬停节点颜色

    // Link colors
    LINK_COLOR: "#999999",               // 连接线颜色
    LINK_WIDTH: 2,                       // 连接线宽度
} as const;

// ============================================================================
// Animation Constants
// ============================================================================

export const ANIMATION_CONSTANTS = {
    // Transition durations (in milliseconds)
    FAST_TRANSITION: 150,                // 快速过渡
    NORMAL_TRANSITION: 300,              // 正常过渡
    SLOW_TRANSITION: 500,                // 慢速过渡

    // Easing functions
    EASING_DEFAULT: "ease-in-out",       // 默认缓动函数
    EASING_ELASTIC: "elastic",           // 弹性缓动
} as const;

// ============================================================================
// Performance Constants
// ============================================================================

export const PERFORMANCE_CONSTANTS = {
    // Rendering thresholds
    MAX_NODES_BEFORE_VIRTUALIZATION: 500, // 虚拟化阈值

    // Debounce delays (in milliseconds)
    RENDER_DEBOUNCE_DELAY: 100,          // 渲染防抖延迟
    INPUT_DEBOUNCE_DELAY: 300,           // 输入防抖延迟

    // Cache settings
    MAX_CACHE_SIZE: 1000,                // 最大缓存大小
    CACHE_EXPIRY_TIME: 300000,           // 缓存过期时间（5分钟）
} as const;

// ============================================================================
// DOM Constants
// ============================================================================

export const DOM_CONSTANTS = {
    // Style element ID
    STYLE_ELEMENT_ID: "mind-map-styles",

    // CSS classes
    MIND_MAP_CONTAINER_CLASS: "mind-map-container",
    MIND_MAP_RIBBON_CLASS: "mind-map-ribbon-class",

    // Status bar text
    STATUS_READY_TEXT: "openMindMap Ready",

    // Command IDs
    COMMAND_OPEN_MIND_MAP: "open-mind-map",
    COMMAND_OPEN_CURRENT: "open-mind-map-current",
} as const;

// ============================================================================
// Validation Constants
// ============================================================================

export const VALIDATION_CONSTANTS = {
    // Text validation
    MAX_TEXT_LENGTH: 500,                // 最大文本长度
    INVALID_CHARACTERS: ['\t'],          // 无效字符（只禁止制表符，保留缩进结构）

    // File validation
    MAX_FILE_SIZE: 1024 * 1024,          // 最大文件大小（1MB）
} as const;