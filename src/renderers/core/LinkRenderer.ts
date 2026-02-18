import * as d3 from 'd3';
import { MindMapNode } from '../../interfaces/mindmap-interfaces';
import { TextMeasurer } from '../../utils/TextMeasurer';
import { CoordinateConverter } from '../../utils/coordinate-system';

/**
 * 连线渲染配置接口
 */
export interface LinkRendererConfig {
	lineOffset: number;
}

/**
 * 连线渲染器
 *
 * 【职责】
 * - 渲染节点间连线
 * - 绘制三次贝塞尔曲线（root → level 1）
 * - 绘制圆角连线（其他层级）
 * - 计算连接点坐标
 * - 处理不同层级的连线样式
 *
 * 【依赖】
 * - TextMeasurer: 获取节点尺寸
 * - CoordinateConverter: 坐标转换
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
	 * 渲染所有连线
	 *
	 * @param svg SVG容器
	 * @param links D3层级连线数组
	 * @param offsetX X轴偏移量
	 * @param offsetY Y轴偏移量
	 */
	renderLinks(
		svg: d3.Selection<SVGGElement, unknown, null, undefined>,
		links: d3.HierarchyLink<MindMapNode>[],
		offsetX: number,
		offsetY: number
	): void {
		const linkGroup = svg.append("g").attr("class", "links");

		if (links.length === 0) return;

		// 按层级分离连线：第零层到第一层使用三次贝塞尔曲线，其他层级使用圆角连线
		const rootToFirstLevelLinks: d3.HierarchyLink<MindMapNode>[] = [];
		const roundedLinks: d3.HierarchyLink<MindMapNode>[] = [];

		links.forEach(link => {
			if (link.source.depth === 0 && link.target.depth === 1) {
				rootToFirstLevelLinks.push(link);
			} else {
				roundedLinks.push(link);
			}
		});

		// 渲染第零层到第一层的三次贝塞尔曲线连接
		if (rootToFirstLevelLinks.length > 0) {
			this.renderRootToFirstLevelCubicLinks(linkGroup, rootToFirstLevelLinks, offsetX, offsetY);
		}

		// 渲染其他层级的圆角连接
		if (roundedLinks.length > 0) {
			this.renderRoundedLinks(linkGroup, roundedLinks, offsetX, offsetY);
		}
	}

	/**
	 * 渲染根节点到第一层的三次贝塞尔曲线
	 *
	 * @param group SVG组元素
	 * @param links 连线数组
	 * @param offsetX X轴偏移量
	 * @param offsetY Y轴偏移量
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

			// 计算三次贝塞尔曲线的控制点
			const deltaX = targetX - sourceX;

			// 第一个控制点：从源节点出发，沿X轴正方向
			const control1X = sourceX + deltaX * 0.3;
			const control1Y = sourceY;

			// 第二个控制点：接近目标节点，保持目标节点的Y坐标
			const control2X = targetX - deltaX * 0.3;
			const control2Y = targetY;

			// 创建三次贝塞尔曲线路径
			const pathData = `M ${sourceX},${sourceY} C ${control1X},${control1Y} ${control2X},${control2Y} ${targetX},${targetY}`;

			// 使用统一的连线颜色
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
	 * 渲染圆角连线（用于除0-1层外的所有其他层级）
	 *
	 * @param group SVG组元素
	 * @param links 连线数组
	 * @param offsetX X轴偏移量
	 * @param offsetY Y轴偏移量
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

			// 生成圆角路径（使用默认8px圆角半径）
			const pathData = this.generateRoundedPath(sourceX, sourceY, targetX, targetY, 8);

			// 使用现有的连线颜色 #b8b8b8
			group.append("path")
				.attr("d", pathData)
				.attr("stroke", "#b8b8b8")
				.attr("stroke-width", 2)
				.attr("fill", "none")
				.attr("stroke-linecap", "round")
				.attr("stroke-linejoin", "round")  // 添加连接点圆角
				.style("opacity", 0.8)
				.attr("class", "rounded-link");
		});
	}

	/**
	 * 生成圆角连线路径
	 *
	 * @param sourceX 源节点X坐标
	 * @param sourceY 源节点Y坐标
	 * @param targetX 目标节点X坐标
	 * @param targetY 目标节点Y坐标
	 * @param cornerRadius 圆角半径
	 * @returns SVG path d属性字符串
	 */
	private generateRoundedPath(
		sourceX: number,
		sourceY: number,
		targetX: number,
		targetY: number,
		cornerRadius: number = 8
	): string {
		const horizontalDistance = targetX - sourceX;
		const turn1X = sourceX + horizontalDistance * 0.45;

		// 智能圆角半径计算，避免过大或过小的圆角
		const radius = Math.min(
			cornerRadius,
			Math.abs(targetX - turn1X) * 0.4,
			Math.abs(targetY - sourceY) * 0.4
		);

		// 计算圆角转折点
		const verticalEndY = targetY + (sourceY < targetY ? -radius : radius);
		const cornerStartX = turn1X;
		const cornerStartY = verticalEndY;
		const cornerEndX = turn1X + (targetX > turn1X ? radius : -radius);
		const cornerEndY = targetY;

		// 构建圆角路径：水平线 → 垂直线 → 圆角过渡 → 水平线
		return `M ${sourceX},${sourceY}
			L ${turn1X},${sourceY}
			L ${cornerStartX},${cornerStartY}
			Q ${cornerStartX},${targetY} ${cornerEndX},${cornerEndY}
			L ${targetX},${targetY}`;
	}

	/**
	 * 计算连线连接点坐标
	 *
	 * 【坐标系统】混合坐标系统
	 * - 源节点：link.source.y (左边缘X), link.source.x (中心Y)
	 * - 目标节点：link.target.y (左边缘X), link.target.x (中心Y)
	 *
	 * @param link D3层级连线对象
	 * @param offsetX X轴偏移量
	 * @param offsetY Y轴偏移量
	 * @returns 连接点坐标
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
		// 获取源节点和目标节点的尺寸
		const sourceDimensions = this.textMeasurer.getNodeDimensions(
			link.source.depth,
			link.source.data.text
		);

		// 获取对应的padding值
		const sourcePadding = this.getNodePadding(link.source.depth);
		const targetPadding = this.getNodePadding(link.target.depth);

		// 使用坐标转换工具计算连接点
		const sourceX = CoordinateConverter.toRightEdge(
			link.source.y,           // 布局Y（左边缘）
			sourceDimensions.width,  // 节点宽度
			sourcePadding,            // padding
			this.config.lineOffset,   // 连线偏移
			offsetX
		);

		const targetX = CoordinateConverter.toLeftEdge(
			link.target.y,        // 布局Y（左边缘）
			targetPadding,         // padding
			this.config.lineOffset,  // 连线偏移
			offsetX
		);

		// Y坐标：布局X即中心，直接加偏移即可
		const sourceY = CoordinateConverter.toCanvasY(link.source.x, 0, offsetY);
		const targetY = CoordinateConverter.toCanvasY(link.target.x, 0, offsetY);

		return { sourceX, sourceY, targetX, targetY };
	}

	/**
	 * 获取节点padding值
	 *
	 * @param depth 节点深度
	 * @returns padding值（像素）
	 */
	private getNodePadding(depth: number): number {
		if (depth === 0) return 24;    // 根节点padding
		else if (depth === 1) return 20; // 第1层padding
		else return 16;                 // 第2层及以后padding
	}
}
