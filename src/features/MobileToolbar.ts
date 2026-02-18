/**
 * Mobile Toolbar - Mobile toolbar functionality
 *
 * [Responsibilities]
 * - Create and manage shared toolbar (edit, copy, paste, delete)
 * - Update toolbar position and display state
 * - Handle toolbar button click events
 * - Provide vibration feedback (mobile)
 *
 * [Design Principles]
 * - Communicate with external via callbacks, no direct dependency on D3TreeRenderer
 * - Manage toolbar display, hide and position updates
 * - Provide clear API for toolbar operations
 *
 * [Refactoring Source]
 * Extracted from D3TreeRenderer.ts (Phase 3.5)
 * - createToolbarContent() → create()
 * - createToolbarButton() → (internal method)
 * - updateSharedToolbar() → updatePosition()
 * - hideSharedToolbar() → hide()
 * - attachToolbarButtonHandlers() → attachHandlers()
 * - handleToolbar*Click() → (handled via callbacks)
 */

import * as d3 from 'd3';
import { MindMapNode } from '../interfaces/mindmap-interfaces';
import { TextMeasurer } from '../utils/TextMeasurer';
import { MindMapMessages } from '../i18n';

/**
 * Mobile Toolbar callback interface
 */
export interface MobileToolbarCallbacks {
	/**
	 * Called when edit button is clicked
	 */
	onEdit?: (node: d3.HierarchyNode<MindMapNode>) => void;

	/**
	 * Called when copy button is clicked
	 */
	onCopy?: (node: d3.HierarchyNode<MindMapNode>) => Promise<void>;

	/**
	 * Called when paste button is clicked
	 */
	onPaste?: (node: d3.HierarchyNode<MindMapNode>) => Promise<void>;

	/**
	 * Called when delete button is clicked
	 */
 onDelete?: (node: d3.HierarchyNode<MindMapNode>) => void;
}

/**
 * Mobile Toolbar class
 *
 * Manages complete lifecycle of mobile toolbar
 */
export class MobileToolbar {
	private toolbar: d3.Selection<SVGGElement, unknown, null, undefined> | null = null;
	private currentNode: d3.HierarchyNode<MindMapNode> | null = null;

	constructor(
		private textMeasurer: TextMeasurer,
		private messages: MindMapMessages,
		private callbacks: MobileToolbarCallbacks = {}
	) {
		// Instance variables are used in class methods
	}

	/**
	 * Create shared toolbar
	 *
	 * @param svg SVG selection set
	 */
	create(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>): void {
		// Simplification: if exists, destroy and recreate (ensure uniqueness and validity)
		if (this.toolbar) {
			this.toolbar.remove();
			this.toolbar = null;
		}

		// Fix: create in content group, ensure correct SVG level (refer to pre-refactoring implementation)
		const content = svg.select(".mindmap-content");
		if (content.empty()) {
			return;
		}

		const toolbarGroup = content.append("g")
			.attr("class", "shared-node-toolbar")
			.style("display", "none");

		// Create toolbar content
		this.createToolbarContent(toolbarGroup);

		// Save reference
		this.toolbar = toolbarGroup;
	}

	/**
	 * Update toolbar position and display state
	 *
	 * @param node Associated node
	 * @param offsetX X-axis offset
	 * @param offsetY Y-axis offset
	 */
	updatePosition(
		node: d3.HierarchyNode<MindMapNode>,
		offsetX: number,
		offsetY: number
	): void {
		if (!this.toolbar) {
			return;
		}

		// Get node dimensions
		const dimensions = this.textMeasurer.getNodeDimensions(node.depth, node.data.text);

		// Calculate toolbar absolute position (using canvas coordinates)
		const nodeCanvasX = node.y + offsetX;  // Node's horizontal position
		// node.x is the center point of layout coordinates, need to convert to top edge position of canvas coordinates
		const nodeCanvasY = node.x + offsetY - dimensions.height / 2;  // Node's vertical position (top edge)

		const toolbarWidth = 320;
		const toolbarHeight = 44;

		// Toolbar offset relative to node
		const toolbarOffsetX = (dimensions.width - toolbarWidth) / 2;  // Horizontal center
		const toolbarOffsetY = -toolbarHeight - 12;  // 12px above node

		// Toolbar's absolute coordinates
		const toolbarX = nodeCanvasX + toolbarOffsetX;
		const toolbarY = nodeCanvasY + toolbarOffsetY;

		// Update toolbar position
		// Interrupt any ongoing transition animation, ensure toolbar responds immediately
		this.toolbar
			.interrupt()
			.attr("transform", `translate(${toolbarX}, ${toolbarY})`)
			.style("display", "block")
			.style("opacity", 0);

		// Save currently associated node
		this.currentNode = node;

		// Update button event listeners (using new node reference)
		this.attachHandlers(node);

		// Smooth fade-in animation
		requestAnimationFrame(() => {
			if (this.toolbar) {
				this.toolbar
					.style("transition", "opacity 0.15s ease-out")
					.style("opacity", 1);
			}
		});
	}

	/**
	 * Hide toolbar
	 */
	hide(): void {
		if (!this.toolbar) {
			return;
		}

		this.toolbar
			.style("opacity", 0)
			.transition()
			.duration(150)
			.on("end", () => {
				this.toolbar?.style("display", "none");
				// Clear node reference only after animation completes
				this.currentNode = null;
			});
	}

	/**
	 * Destroy
	 */
	destroy(): void {
		if (this.toolbar) {
			this.toolbar.remove();
			this.toolbar = null;
		}
		this.currentNode = null;
	}

	// ========== Private Methods ==========

	/**
	 * Create toolbar content
	 */
	private createToolbarContent(
		toolbarGroup: d3.Selection<SVGGElement, unknown, null, undefined>
	): void {
		const toolbarWidth = 400;
		const toolbarHeight = 44;

		// Toolbar background (black rounded rectangle)
		toolbarGroup.append("rect")
			.attr("class", "toolbar-bg")
			.attr("width", toolbarWidth)
			.attr("height", toolbarHeight)
			.attr("rx", 8)
			.attr("ry", 8)
			.attr("fill", "#000000");

		// Toolbar arrow (pointing to node)
		toolbarGroup.append("path")
			.attr("class", "toolbar-arrow")
			.attr("d", "M 200 52 L 192 44 L 208 44 Z")
			.attr("fill", "#000000");

		// Three separator lines
		for (let i = 1; i <= 3; i++) {
			toolbarGroup.append("line")
				.attr("class", "toolbar-separator")
				.attr("x1", (toolbarWidth / 4) * i)
				.attr("y1", 8)
				.attr("x2", (toolbarWidth / 4) * i)
				.attr("y2", toolbarHeight - 8)
				.attr("stroke", "#333333")
				.attr("stroke-width", 1);
		}

		// Create four buttons
		this.createToolbarButton(toolbarGroup, 0, toolbarWidth, toolbarHeight, "edit");
		this.createToolbarButton(toolbarGroup, 1, toolbarWidth, toolbarHeight, "copy");
		this.createToolbarButton(toolbarGroup, 2, toolbarWidth, toolbarHeight, "paste");
		this.createToolbarButton(toolbarGroup, 3, toolbarWidth, toolbarHeight, "delete");
	}

	/**
	 * Create toolbar button
	 */
	private createToolbarButton(
		toolbarGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
		index: number,
		toolbarWidth: number,
		toolbarHeight: number,
		type: string
	): void {
		const buttonGroup = toolbarGroup.append("g")
			.attr("class", `toolbar-btn ${type}-btn`)
			.style("cursor", "pointer");

		buttonGroup.append("rect")
			.attr("x", (toolbarWidth / 4) * index)
			.attr("width", toolbarWidth / 4)
			.attr("height", toolbarHeight)
			.attr("fill", "transparent")
			.attr("rx", 8)
			.attr("ry", 8);

		// 按钮图标和文本配置
		const buttonConfig = {
			edit: { icon: "✏️", text: this.messages.ui.contextEdit },
			copy: { icon: "📋", text: this.messages.ui.contextCopy },
			paste: { icon: "📑", text: this.messages.ui.contextPaste },
			delete: { icon: "🗑️", text: this.messages.ui.contextDelete }
		};

		const config = buttonConfig[type as keyof typeof buttonConfig];
		const buttonCenterX = (toolbarWidth / 4) * index + (toolbarWidth / 8);

		buttonGroup.append("text")
			.attr("x", buttonCenterX - 16)
			.attr("y", toolbarHeight / 2)
			.attr("dominant-baseline", "middle")
			.attr("text-anchor", "middle")
			.attr("fill", "#ffffff")
			.attr("font-size", "14px")
			.style("pointer-events", "none")
			.text(config.icon);

		buttonGroup.append("text")
			.attr("x", buttonCenterX + 16)
			.attr("y", toolbarHeight / 2)
			.attr("dominant-baseline", "middle")
			.attr("text-anchor", "middle")
			.attr("fill", "#ffffff")
			.attr("font-size", "14px")
			.attr("font-weight", "500")
			.style("pointer-events", "none")
			.text(config.text);
	}

	/**
	 * Attach toolbar button event handlers
	 */
	private attachHandlers(node: d3.HierarchyNode<MindMapNode>): void {
		if (!this.toolbar) return;

		// Edit button
		this.toolbar.select(".edit-btn")
			.on("click", (event: MouseEvent) => {
				this.handleButtonClick(event, node, "edit");
			});

		// Copy button
		this.toolbar.select(".copy-btn")
			.on("click", (event: MouseEvent) => {
				this.handleButtonClick(event, node, "copy");
			});

		// Paste button
		this.toolbar.select(".paste-btn")
			.on("click", (event: MouseEvent) => {
				this.handleButtonClick(event, node, "paste");
			});

		// Delete button
		this.toolbar.select(".delete-btn")
			.on("click", (event: MouseEvent) => {
				this.handleButtonClick(event, node, "delete");
			});
	}

	/**
	 * Handle toolbar button click event
	 */
	private handleButtonClick(
		event: MouseEvent,
		node: d3.HierarchyNode<MindMapNode>,
		type: string
	): void {
		event.stopPropagation(); // Prevent event bubbling

		// Vibration feedback (if device supports)
		if (navigator.vibrate) {
			navigator.vibrate(50);
		}

		// Trigger corresponding callback
		switch (type) {
			case "edit":
				this.callbacks.onEdit?.(node);
				break;
			case "copy":
				this.callbacks.onCopy?.(node);
				break;
			case "paste":
				this.callbacks.onPaste?.(node);
				break;
			case "delete":
				this.callbacks.onDelete?.(node);
				break;
		}
	}
}
