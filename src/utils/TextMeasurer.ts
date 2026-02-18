import { getFontSizeByDepth } from '../constants/mindmap-constants';
import { cleanTextContent } from './mindmap-utils';

/**
 * Helper function to set multiple CSS properties at once
 * This provides a cleaner alternative to direct style manipulation
 */
function setCssProps(element: HTMLElement, props: Record<string, string>): void {
	Object.assign(element.style, props);
}

/**
 * Node dimension configuration interface
 */
export interface NodeDimensions {
	width: number;
	height: number;
	textX: number;
	textY: number;
	fontSize: string;
	fontWeight: string;
	lines: string[];
	padding: number;
	minWidth: number;
	maxWidth: number | null;
}

/**
 * Text measurer
 *
 * [Responsibilities]
 * Accurately measure text dimensions, handle text wrapping, calculate node dimensions
 *
 * [Core Functions]
 * 1. Accurate text measurement: Use hidden DOM elements to accurately measure text dimensions
 * 2. Smart text wrapping: Automatically wrap based on max width or keep single line
 * 3. Node dimension calculation: Calculate complete node dimension configuration based on node depth and text content
 * 4. Cache optimization: Cache measurement results to improve performance
 *
 * [Performance Optimization]
 * - textMeasurementCache: Text measurement result cache
 * - nodeDimensionsCache: Node dimension cache
 * - Hidden DOM element reuse
 *
 * [Usage Example]
 * ```typescript
 * const measurer = new TextMeasurer();
 * const dimensions = measurer.getNodeDimensions(0, "Central Topic");
 * measurer.destroy(); // Clean up after use
 * ```
 */
export class TextMeasurer {
	// Text measurement element (hidden DOM element for accurate measurement)
	private textMeasurementElement: HTMLDivElement | null = null;

	// Text measurement cache
	private textMeasurementCache = new Map<string, { width: number; height: number }>();

	// Node dimension cache
	private nodeDimensionsCache = new Map<string, NodeDimensions>();

	/**
	 * Accurately measure text dimensions
	 *
	 * Use hidden DOM elements to accurately measure text width and height, with cache support
	 *
	 * @param text Text to measure
	 * @param fontSize Font size (pixels)
	 * @param fontWeight Font weight (normal/bold, etc.)
	 * @returns Text width and height dimensions
	 */
	public measureTextAccurately(text: string, fontSize: number, fontWeight = 'normal') {
		const cacheKey = `${text}-${fontSize}-${fontWeight}`;

		if (this.textMeasurementCache.has(cacheKey)) {
			const cached = this.textMeasurementCache.get(cacheKey);
			if (cached) {
				return cached;
			}
		}

		this.initializeTextMeasurementElement();

		if (this.textMeasurementElement) {
			setCssProps(this.textMeasurementElement, {
				fontSize: `${fontSize}px`,
				fontWeight: fontWeight
			});
			this.textMeasurementElement.textContent = text;

			const rect = this.textMeasurementElement.getBoundingClientRect();
			const result = {
				width: rect.width,
				height: rect.height
			};

			this.textMeasurementCache.set(cacheKey, result);
			return result;
		}

		// Fallback to estimation method
		const charWidth = fontSize * 0.62;
		const lineHeight = fontSize * 1.2;
		return {
			width: text.length * charWidth,
			height: lineHeight
		};
	}

	/**
	 * Smart text wrapping
	 *
	 * Automatically wrap based on max width, or keep single line display
	 *
	 * @param text Original text
	 * @param maxWidth Maximum width (null means no width limit)
	 * @param fontSize Font size
	 * @returns Wrapped text array
	 */
	public wrapText(text: string, maxWidth: number | null, fontSize: number): string[] {
		if (!text || text.length === 0) return [""];

		// If maxWidth is null, allow single line display, no auto wrapping
		if (maxWidth === null) {
			// Check if contains manual line breaks
			if (text.includes('\n')) {
				const lines = text.split('\n');
				return lines;
			}
			return [text];
		}

		// Simple character width estimation (can be optimized as needed)
		const charWidth = fontSize * 0.62; // Balanced character width estimation
		const maxChars = Math.floor(maxWidth / charWidth);

		if (text.length <= maxChars) {
			return [text];
		}

		const words = text.split(' ');
		const lines: string[] = [];
		let currentLine = "";

		for (const word of words) {
			const testLine = currentLine ? `${currentLine} ${word}` : word;
			if (testLine.length <= maxChars) {
				currentLine = testLine;
			} else {
				if (currentLine) {
					lines.push(currentLine);
				}
				currentLine = word;
			}
		}

		if (currentLine) {
			lines.push(currentLine);
		}

		return lines.length > 0 ? lines : [text.substring(0, maxChars)];
	}

	/**
	 * Measure multi-line text dimensions (improved version)
	 *
	 * @param lines Text line array
	 * @param fontSize Font size
	 * @param fontWeight Font weight
	 * @returns Total text width and height
	 */
	public measureTextSize(lines: string[], fontSize: number, fontWeight = 'normal'): {
		width: number;
		height: number;
	} {
		if (lines.length === 0) {
			return { width: 40, height: fontSize * 1.3 }; // Reduce minimum width: 60→40
		}

		const lineHeight = fontSize * 1.3; // Line height is 1.3x font size (optimization: 1.5→1.3, save 13%)
		let maxWidth = 0;

		// Use accurate measurement method
		for (const line of lines) {
			const measurement = this.measureTextAccurately(line, fontSize, fontWeight);
			if (measurement.width > maxWidth) {
				maxWidth = measurement.width;
			}
		}

		const height = lines.length * lineHeight;
		const width = Math.max(maxWidth, 35); // Significantly reduce minimum width: 60→35 (approximately one character width)

		const result = { width: Math.ceil(width), height: Math.ceil(height) };

		return result;
	}

	/**
	 * Get node dimension configuration (adaptive version)
	 *
	 * Calculate complete node dimension configuration based on node depth and text content
	 * Including width, height, text position, font style, etc.
	 *
	 * @param depth Node depth (0=root, 1=first level, 2+=other levels)
	 * @param text Node text content
	 * @returns Node dimension configuration object
	 */
	public getNodeDimensions(depth: number, text: string): NodeDimensions {
		// Create cache key
		const cacheKey = `${depth}-${text}-${text.length}`;

		// Check cache
		if (this.nodeDimensionsCache.has(cacheKey)) {
			const cached = this.nodeDimensionsCache.get(cacheKey);
			if (cached) {
				return cached;
			}
		}
		const cleanedText = cleanTextContent(text);

		let fontSize: string;
		let fontWeight: string;
		let maxWidth: number | null;
		let minWidth: number;
		let padding: number;

		if (depth === 0) {
			// Root node: enhanced style
			fontSize = getFontSizeByDepth(0);
			fontWeight = "bold";
			maxWidth = null; // Remove width limit, allow dynamic adjustment
			minWidth = 40; // Significantly reduce: 70→40, allow single character node self-adaptation (only as baseline protection)
			padding = 18; // Optimize: 24→18, reduce 25%
		} else if (depth === 1) {
			// Level 1: enhanced style
			fontSize = getFontSizeByDepth(1);
			fontWeight = "bold";
			maxWidth = null; // Remove width limit, allow dynamic adjustment
			minWidth = 38; // Significantly reduce: 65→38, allow single character node self-adaptation
			padding = 16; // Optimize: 20→16, reduce 20%
		} else {
			// Level 2 and beyond: more compact style
			fontSize = getFontSizeByDepth(depth);
			fontWeight = "normal";
			maxWidth = null; // Remove width limit, allow dynamic adjustment
			minWidth = 20; // Extreme compression: 35→20, maximize compactness
			padding = 10; // Optimize: 12→10, reduce 17%
		}

		const fontSizeNum = parseInt(fontSize);
		const effectiveMaxWidth = maxWidth !== null ? maxWidth - padding * 2 : null;
		const lines = this.wrapText(cleanedText, effectiveMaxWidth, fontSizeNum);
		const textSize = this.measureTextSize(lines, fontSizeNum, fontWeight);

		// Calculate final node dimensions
		const safetyBuffer = Math.max(8, textSize.width * 0.05); // At least 8px or 5% buffer
		const width = Math.max(textSize.width + padding * 2 + safetyBuffer, minWidth);
		const height = Math.max(textSize.height + padding * 2, fontSizeNum * 2.0); // Minimum height is 2.0x font size (optimization: 2.5→2.0, save 20%)

		// Calculate text position (center aligned)
		const textX = width / 2;
		const textY = textSize.height / 2 + padding / 2; // Fix vertical centering // Fine-tune Y position

		const result: NodeDimensions = {
			width,
			height,
			textX,
			textY,
			fontSize,
			fontWeight,
			lines,
			padding,
			minWidth,
			maxWidth
		};

		// Cache calculation result
		this.nodeDimensionsCache.set(cacheKey, result);

		return result;
	}

	/**
	 * Clear cache for specific text
	 *
	 * Clear related cache when text content is modified to avoid using stale data
	 *
	 * @param text Text to clear cache for
	 */
	public clearNodeDimensionsCacheForText(text: string): void {
		const keysToDelete: string[] = [];
		for (const key of this.nodeDimensionsCache.keys()) {
			if (key.includes(text)) {
				keysToDelete.push(key);
			}
		}
		keysToDelete.forEach(key => this.nodeDimensionsCache.delete(key));

		// 同时清除文本测量缓存
		const textKeysToDelete: string[] = [];
		for (const key of this.textMeasurementCache.keys()) {
			if (key.includes(text)) {
				textKeysToDelete.push(key);
			}
		}
		textKeysToDelete.forEach(key => this.textMeasurementCache.delete(key));
	}

	/**
	 * Initialize text measurement element (private method)
	 *
	 * Create a hidden DOM element for accurately measuring text dimensions
	 */
	private initializeTextMeasurementElement(): void {
		if (!this.textMeasurementElement) {
			this.textMeasurementElement = document.createElement('div');
			this.textMeasurementElement.addClass('mindmap-text-measurer');
			document.body.appendChild(this.textMeasurementElement);
		}
	}

	/**
	 * Destroy measurer, clean up resources
	 *
	 * Clean up hidden DOM elements and all caches
	 */
	public destroy(): void {
		// Clean up text measurement element
		if (this.textMeasurementElement && this.textMeasurementElement.parentNode) {
			this.textMeasurementElement.parentNode.removeChild(this.textMeasurementElement);
			this.textMeasurementElement = null;
		}

		// Clean up caches
		this.textMeasurementCache.clear();
		this.nodeDimensionsCache.clear();
	}
}
