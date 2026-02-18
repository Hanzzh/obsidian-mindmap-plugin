/**
 * 坐标系统转换工具
 *
 * 【目的】
 *
 * 本项目使用混合坐标系统（详见类文档），该工具提供：
 * 1. 清晰的坐标转换方法
 * 2. 避免直接操作坐标导致的混乱
 * 3. 自文档化的API设计
 * 4. 便于测试和调试
 *
 * 【混合坐标系统】
 *
 * 布局坐标系（LayoutCalculator 计算）：
 *   - layoutX: 垂直位置，表示节点的中心
 *   - layoutY: 水平位置，表示节点的左边缘
 *
 * 画布坐标系（SVG 渲染）：
 *   - canvasX: 水平位置，从左到右
 *   - canvasY: 垂直位置，从上到下
 *
 * 转换关系：
 *   - canvasX = layoutY（直接映射）
 *   - canvasY = layoutX - nodeHeight/2（中心到顶边）
 *
 * 【使用示例】
 *
 * ```typescript
 * import { CoordinateConverter } from './utils/coordinate-system';
 *
 * // 场景1：计算节点组的transform
 * const canvasX = CoordinateConverter.toCanvasX(layoutY, offsetX);
 * const canvasY = CoordinateConverter.toCanvasY(layoutX, nodeHeight, offsetY);
 * const transform = `translate(${canvasX}, ${canvasY})`;
 *
 * // 场景2：计算连线的起点
 * const sourceCanvasX = CoordinateConverter.toRightEdge(layoutY, nodeWidth, padding, lineOffset);
 *
 * // 场景3：计算节点边界
 * const bounds = CoordinateConverter.getNodeBounds(canvasX, canvasY, width, height);
 * ```
 */

/**
 * 坐标转换工具类
 *
 * 提供布局坐标和画布坐标之间的双向转换
 */
export class CoordinateConverter {
	/**
	 * 将布局Y坐标（左边缘）转换为画布X坐标
	 *
	 * 【说明】
	 * 在布局系统中，Y坐标表示节点的左边缘位置（水平方向）
	 * 在画布系统中，X坐标表示水平位置
	 * 两者直接映射，不需要转换
	 *
	 * @param layoutY 布局Y坐标（节点的左边缘，水平位置）
	 * @param offsetX X轴偏移量（通常为0）
	 * @returns 画布X坐标（水平位置）
	 *
	 * @example
	 * ```typescript
	 * const canvasX = CoordinateConverter.toCanvasX(200, 0);
	 * // 返回: 200 (直接映射)
	 * ```
	 */
	static toCanvasX(layoutY: number, offsetX = 0): number {
		return layoutY + offsetX;
	}

	/**
	 * 将布局X坐标（中心）转换为画布Y坐标（顶边）
	 *
	 * 【说明】
	 * 在布局系统中，X坐标表示节点的中心位置（垂直方向）
	 * 在画布系统中，Y坐标表示顶边位置（从上到下）
	 * 需要减去节点高度的一半，将中心转换为顶边
	 *
	 * 【为什么这样转换？】
	 * SVG的rect元素从(0, 0)开始绘制
	 * 如果我们希望节点的中心在 layoutX，rect的y应该是 layoutX - height/2
	 *
	 * @param layoutX 布局X坐标（节点的中心，垂直位置）
	 * @param nodeHeight 节点高度（像素）
	 * @param offsetY Y轴偏移量（通常为0）
	 * @returns 画布Y坐标（顶边位置）
	 *
	 * @example
	 * ```typescript
	 * const canvasY = CoordinateConverter.toCanvasY(100, 50, 0);
	 * // 返回: 75 (100 - 50/2)
	 * // 解释: 节点中心在100，高度50，顶边应该在75
	 * ```
	 */
	static toCanvasY(layoutX: number, nodeHeight: number, offsetY = 0): number {
		return layoutX + offsetY - nodeHeight / 2;
	}

	/**
	 * 将画布Y坐标（顶边）转换为布局X坐标（中心）
	 *
	 * 【说明】
	 * toCanvasY 的逆操作
	 * 从画布的顶边位置恢复到布局的中心位置
	 *
	 * @param canvasY 画布Y坐标（顶边位置）
	 * @param nodeHeight 节点高度（像素）
	 * @param offsetY Y轴偏移量（通常为0）
	 * @returns 布局X坐标（中心位置）
	 *
	 * @example
	 * ```typescript
	 * const layoutX = CoordinateConverter.toLayoutX(75, 50, 0);
	 * // 返回: 100 (75 + 50/2)
	 * ```
	 */
	static toLayoutX(canvasY: number, nodeHeight: number, offsetY = 0): number {
		return canvasY - offsetY + nodeHeight / 2;
	}

	/**
	 * 计算节点右边缘的画布X坐标
	 *
	 * 【用途】
	 * 用于计算连线的起点（父节点右边缘）
	 *
	 * @param layoutY 布局Y坐标（左边缘）
	 * @param nodeWidth 节点宽度
	 * @param padding 内边距
	 * @param lineOffset 连线偏移（与边缘的间距）
	 * @param offsetX X轴偏移量
	 * @returns 右边缘的画布X坐标
	 *
	 * @example
	 * ```typescript
	 * const rightEdge = CoordinateConverter.toRightEdge(200, 100, 20, 6, 0);
	 * // 返回: 286 (200 + 100 - 20 + 6)
	 * ```
	 */
	static toRightEdge(
		layoutY: number,
		nodeWidth: number,
		padding: number,
		lineOffset: number,
		offsetX = 0
	): number {
		return layoutY + nodeWidth - padding + lineOffset + offsetX;
	}

	/**
	 * 计算节点左边缘的画布X坐标（带padding）
	 *
	 * 【用途】
	 * 用于计算连线的终点（子节点左边缘）
	 *
	 * @param layoutY 布局Y坐标（左边缘）
	 * @param padding 内边距
	 * @param lineOffset 连线偏移（与边缘的间距）
	 * @param offsetX X轴偏移量
	 * @returns 左边缘的画布X坐标（包含padding）
	 *
	 * @example
	 * ```typescript
	 * const leftEdge = CoordinateConverter.toLeftEdge(400, 20, 6, 0);
	 * // 返回: 414 (400 + 20 - 6)
	 * ```
	 */
	static toLeftEdge(
		layoutY: number,
		padding: number,
		lineOffset: number,
		offsetX = 0
	): number {
		return layoutY + padding - lineOffset + offsetX;
	}

	/**
	 * 计算节点的渲染边界矩形
	 *
	 * 【说明】
	 * 根据节点的左上角坐标和尺寸，计算其边界
	 * 用于碰撞检测、点击检测等场景
	 *
	 * @param canvasX 节点左上角的X坐标
	 * @param canvasY 节点左上角的Y坐标
	 * @param width 节点宽度
	 * @param height 节点高度
	 * @returns 边界矩形对象
	 *
	 * @example
	 * ```typescript
	 * const bounds = CoordinateConverter.getNodeBounds(100, 75, 50, 50);
	 * // 返回: { x: 100, y: 75, right: 150, bottom: 125, width: 50, height: 50 }
	 * ```
	 */
	static getNodeBounds(
		canvasX: number,
		canvasY: number,
		width: number,
		height: number
	): {
		x: number;
		y: number;
		right: number;
		bottom: number;
		width: number;
		height: number;
	} {
		return {
			x: canvasX,
			y: canvasY,
			right: canvasX + width,
			bottom: canvasY + height,
			width: width,
			height: height
		};
	}

	/**
	 * 计算两个节点之间的垂直距离
	 *
	 * 【说明】
	 * 计算两个节点中心点之间的垂直距离
	 * 用于判断节点是否重叠或距离过近
	 *
	 * @param layoutX1 第一个节点的布局X（中心）
	 * @param layoutX2 第二个节点的布局X（中心）
	 * @returns 垂直距离（绝对值）
	 *
	 * @example
	 * ```typescript
	 * const distance = CoordinateConverter.getVerticalDistance(75, 193);
	 * // 返回: 118 (|75 - 193|)
	 * ```
	 */
	static getVerticalDistance(layoutX1: number, layoutX2: number): number {
		return Math.abs(layoutX1 - layoutX2);
	}

	/**
	 * 检查两个节点在垂直方向上是否重叠
	 *
	 * 【说明】
	 * 基于节点的高度和中心位置，判断两个节点是否重叠
	 * 考虑了安全间距
	 *
	 * @param layoutX1 第一个节点的布局X（中心）
	 * @param height1 第一个节点的高度
	 * @param layoutX2 第二个节点的布局X（中心）
	 * @param height2 第二个节点的高度
	 * @param gap 安全间距（默认为0）
	 * @returns 是否重叠
	 *
	 * @example
	 * ```typescript
	 * const overlaps = CoordinateConverter.isOverlapping(
	 *   75, 176,  // 节点1: 中心在75，高度176
	 *   193, 40,  // 节点2: 中心在193，高度40
	 *   10        // 安全间距10px
	 * );
	 * // 计算：
	 * // 节点1范围: 75 - 88 = -13 到 75 + 88 = 163
	 * // 节点2范围: 193 - 20 = 173 到 193 + 20 = 213
	 * // 间距: 173 - 163 = 10px，不重叠
	 * // 返回: false
	 * ```
	 */
	static isOverlapping(
		layoutX1: number,
		height1: number,
		layoutX2: number,
		height2: number,
		gap = 0
	): boolean {
		// 计算每个节点的上下边界
		const top1 = layoutX1 - height1 / 2;
		const bottom1 = layoutX1 + height1 / 2;
		const top2 = layoutX2 - height2 / 2;
		const bottom2 = layoutX2 + height2 / 2;

		// 检查是否重叠（考虑安全间距）
		return !(bottom1 + gap <= top2 || bottom2 + gap <= top1);
	}

	/**
	 * 创建节点的transform字符串
	 *
	 * 【说明】
	 * 便捷方法，直接生成SVG transform属性值
	 *
	 * @param layoutX 布局X坐标（中心）
	 * @param layoutY 布局Y坐标（左边缘）
	 * @param nodeWidth 节点宽度
	 * @param nodeHeight 节点高度
	 * @param offsetX X轴偏移
	 * @param offsetY Y轴偏移
	 * @returns transform字符串，如 "translate(200, 75)"
	 *
	 * @example
	 * ```typescript
	 * const transform = CoordinateConverter.createTransform(100, 200, 100, 50, 0, 0);
	 * // 返回: "translate(200, 75)"
	 * // 解释: X=200 (左边缘), Y=75 (中心100 - 高度50/2)
	 * ```
	 */
	static createTransform(
		layoutX: number,
		layoutY: number,
		nodeWidth: number,
		nodeHeight: number,
		offsetX = 0,
		offsetY = 0
	): string {
		const canvasX = this.toCanvasX(layoutY, offsetX);
		const canvasY = this.toCanvasY(layoutX, nodeHeight, offsetY);
		return `translate(${canvasX}, ${canvasY})`;
	}

	/**
	 * 计算两个节点之间的实际间距
	 *
	 * 【说明】
	 * 计算两个相邻节点之间的实际垂直间距
	 * 正值表示有间距，负值表示重叠
	 *
	 * @param layoutX1 上方节点的布局X（中心）
	 * @param height1 上方节点的高度
	 * @param layoutX2 下方节点的布局X（中心）
	 * @param height2 下方节点的高度
	 * @returns 实际间距（像素）
	 *
	 * @example
	 * ```typescript
	 * const gap = CoordinateConverter.calculateActualGap(
	 *   75, 176,   // 节点1: 中心75, 高度176
	 *   193, 40    // 节点2: 中心193, 高度40
	 * );
	 * // 计算：
	 * // 节点1下边缘: 75 + 88 = 163
	 * // 节点2上边缘: 193 - 20 = 173
	 * // 间距: 173 - 163 = 10px
	 * // 返回: 10
	 * ```
	 */
	static calculateActualGap(
		layoutX1: number,
		height1: number,
		layoutX2: number,
		height2: number
	): number {
		const bottom1 = layoutX1 + height1 / 2;
		const top2 = layoutX2 - height2 / 2;
		return top2 - bottom1;
	}
}
