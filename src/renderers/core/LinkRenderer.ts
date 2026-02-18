import * as d3 from 'd3';
import { MindMapNode } from '../../interfaces/mindmap-interfaces';
import { TextMeasurer } from '../../utils/TextMeasurer';
import { CoordinateConverter } from '../../utils/coordinate-system';

/**
 * Link rendering configuration interface
 */
export interface LinkRendererConfig {
	lineOffset: number;
}

/**
 * Link renderer
 *
 * [Responsibilities]
 * - Render links between nodes
 * - Draw cubic bezier curves (root → level 1)
 * - Draw rounded links (other levels)
 * - Calculate connection point coordinates
 * - Handle link styles for different levels
 *
 * [Dependencies]
 * - TextMeasurer: Get node dimensions
 * - CoordinateConverter: Coordinate conversion
 */
export class LinkRenderer {
	private config: LinkRendererConfig;

	constructor(
		private textMeasurer: TextMeasurer,
		config?: Partial<LinkRendererConfig>
	) {
		this.config = {
			lineOffset: config?.lineOffset || 6
		};
	}

	/**
	 * Render all links
	 *
	 * @param svg SVG container
	 * @param links D3 hierarchy link array
	 * @param offsetX X-axis offset
	 * @param offsetY Y-axis offset
	 */
	renderLinks(
		svg: d3.Selection<SVGGElement, unknown, null, undefined>,
		links: d3.HierarchyLink<MindMapNode>[],
		offsetX: number,
		offsetY: number
	): void {
		const linkGroup = svg.append("g").attr("class", "links");

		if (links.length === 0) return;

		// Separate links by level: level 0 to 1 use cubic bezier curves, other levels use rounded links
		const rootToFirstLevelLinks: d3.HierarchyLink<MindMapNode>[] = [];
		const roundedLinks: d3.HierarchyLink<MindMapNode>[] = [];

		links.forEach(link => {
			if (link.source.depth === 0 && link.target.depth === 1) {
				rootToFirstLevelLinks.push(link);
			} else {
				roundedLinks.push(link);
			}
		});

		// Render cubic bezier curve links from level 0 to 1
		if (rootToFirstLevelLinks.length > 0) {
			this.renderRootToFirstLevelCubicLinks(linkGroup, rootToFirstLevelLinks, offsetX, offsetY);
		}

		// Render rounded links for other levels
		if (roundedLinks.length > 0) {
			this.renderRoundedLinks(linkGroup, roundedLinks, offsetX, offsetY);
		}
	}

	/**
	 * Render cubic bezier curves from root to level 1
	 *
	 * @param group SVG group element
	 * @param links Link array
	 * @param offsetX X-axis offset
	 * @param offsetY Y-axis offset
	 */
	private renderRootToFirstLevelCubicLinks(
		group: d3.Selection<SVGGElement, unknown, null, undefined>,
		links: d3.HierarchyLink<MindMapNode>[],
		offsetX: number,
		offsetY: number
	): void {
		links.forEach(link => {
			const connectionPoints = this.getLinkConnectionPoints(link, offsetX, offsetY);
			const sourceX = connectionPoints.sourceX;
			const sourceY = connectionPoints.sourceY;
			const targetX = connectionPoints.targetX;
			const targetY = connectionPoints.targetY;

			// Calculate cubic bezier curve control points
			const deltaX = targetX - sourceX;

			// First control point: from source node, along positive X direction
			const control1X = sourceX + deltaX * 0.3;
			const control1Y = sourceY;

			// Second control point: near target node, keeping target node's Y coordinate
			const control2X = targetX - deltaX * 0.3;
			const control2Y = targetY;

			// Create cubic bezier curve path
			const pathData = `M ${sourceX},${sourceY} C ${control1X},${control1Y} ${control2X},${control2Y} ${targetX},${targetY}`;

			// Use unified link color
			group.append("path")
				.attr("d", pathData)
				.attr("stroke", "#b8b8b8")
				.attr("stroke-width", 2)
				.attr("fill", "none")
				.attr("stroke-linecap", "round")
				.style("opacity", 0.8)
				.attr("class", "root-to-first-level-link");
		});
	}

	/**
	 * Render rounded links (for all levels except 0-1)
	 *
	 * @param group SVG group element
	 * @param links Link array
	 * @param offsetX X-axis offset
	 * @param offsetY Y-axis offset
	 */
	private renderRoundedLinks(
		group: d3.Selection<SVGGElement, unknown, null, undefined>,
		links: d3.HierarchyLink<MindMapNode>[],
		offsetX: number,
		offsetY: number
	): void {
		links.forEach(link => {
			const connectionPoints = this.getLinkConnectionPoints(link, offsetX, offsetY);
			const sourceX = connectionPoints.sourceX;
			const sourceY = connectionPoints.sourceY;
			const targetX = connectionPoints.targetX;
			const targetY = connectionPoints.targetY;

			// Generate rounded path (using default 8px corner radius)
			const pathData = this.generateRoundedPath(sourceX, sourceY, targetX, targetY, 8);

			// Use existing link color #b8b8b8
			group.append("path")
				.attr("d", pathData)
				.attr("stroke", "#b8b8b8")
				.attr("stroke-width", 2)
				.attr("fill", "none")
				.attr("stroke-linecap", "round")
				.attr("stroke-linejoin", "round")  // Add connection point rounding
				.style("opacity", 0.8)
				.attr("class", "rounded-link");
		});
	}

	/**
	 * Generate rounded link path
	 *
	 * @param sourceX Source node X coordinate
	 * @param sourceY Source node Y coordinate
	 * @param targetX Target node X coordinate
	 * @param targetY Target node Y coordinate
	 * @param cornerRadius Corner radius
	 * @returns SVG path d attribute string
	 */
	private generateRoundedPath(
		sourceX: number,
		sourceY: number,
		targetX: number,
		targetY: number,
		cornerRadius = 8
	): string {
		const horizontalDistance = targetX - sourceX;
		const turn1X = sourceX + horizontalDistance * 0.45;

		// Smart corner radius calculation, avoid too large or too small corners
		const radius = Math.min(
			cornerRadius,
			Math.abs(targetX - turn1X) * 0.4,
			Math.abs(targetY - sourceY) * 0.4
		);

		// Calculate corner turning points
		const verticalEndY = targetY + (sourceY < targetY ? -radius : radius);
		const cornerStartX = turn1X;
		const cornerStartY = verticalEndY;
		const cornerEndX = turn1X + (targetX > turn1X ? radius : -radius);
		const cornerEndY = targetY;

		// Build rounded path: horizontal line → vertical line → corner transition → horizontal line
		return `M ${sourceX},${sourceY}
			L ${turn1X},${sourceY}
			L ${cornerStartX},${cornerStartY}
			Q ${cornerStartX},${targetY} ${cornerEndX},${cornerEndY}
			L ${targetX},${targetY}`;
	}

	/**
	 * Calculate link connection point coordinates
	 *
	 * [Coordinate System] Mixed coordinate system
	 * - Source node: link.source.y (left edge X), link.source.x (center Y)
	 * - Target node: link.target.y (left edge X), link.target.x (center Y)
	 *
	 * @param link D3 hierarchy link object
	 * @param offsetX X-axis offset
	 * @param offsetY Y-axis offset
	 * @returns Connection point coordinates
	 */
	private getLinkConnectionPoints(
		link: d3.HierarchyLink<MindMapNode>,
		offsetX: number,
		offsetY: number
	): {
		sourceX: number;
		sourceY: number;
		targetX: number;
		targetY: number;
	} {
		// Get source and target node dimensions
		const sourceDimensions = this.textMeasurer.getNodeDimensions(
			link.source.depth,
			link.source.data.text
		);

		// Get corresponding padding values
		const sourcePadding = this.getNodePadding(link.source.depth);
		const targetPadding = this.getNodePadding(link.target.depth);

		// Use coordinate conversion tool to calculate connection points
		const sourceX = CoordinateConverter.toRightEdge(
			link.source.y,           // Layout Y (left edge)
			sourceDimensions.width,  // Node width
			sourcePadding,            // padding
			this.config.lineOffset,   // Link offset
			offsetX
		);

		const targetX = CoordinateConverter.toLeftEdge(
			link.target.y,        // Layout Y (left edge)
			targetPadding,         // padding
			this.config.lineOffset,  // Link offset
			offsetX
		);

		// Y coordinate: layout X is center, just add offset
		const sourceY = CoordinateConverter.toCanvasY(link.source.x, 0, offsetY);
		const targetY = CoordinateConverter.toCanvasY(link.target.x, 0, offsetY);

		return { sourceX, sourceY, targetX, targetY };
	}

	/**
	 * Get node padding value
	 *
	 * @param depth Node depth
	 * @returns Padding value (pixels)
	 */
	private getNodePadding(depth: number): number {
		if (depth === 0) return 24;    // Root node padding
		else if (depth === 1) return 20; // Level 1 padding
		else return 16;                 // Level 2 and beyond padding
	}
}
