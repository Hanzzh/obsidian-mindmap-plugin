import * as d3 from 'd3';
import { MindMapNode } from '../interfaces/mindmap-interfaces';

/**
 * MouseInteraction 的回调接口
 *
 * 用于解耦 MouseInteraction 和 D3TreeRenderer 之间的依赖关系
 * MouseInteraction 通过这些回调与外部通信，而不直接依赖 D3TreeRenderer
 */
 
export interface MouseInteractionCallbacks {
	/**
	 * 节点被选中时调用（单击）
	 * @param node 被选中的节点
	 */
	onNodeSelect?: (node: d3.HierarchyNode<MindMapNode>) => void;

	/**
	 * 节点被双击时调用
	 * @param node 被双击的节点
	 * @param event 原始鼠标事件（用于查找DOM元素）
	 */
	onNodeDoubleClick?: (node: d3.HierarchyNode<MindMapNode>, event: MouseEvent) => void;

	/**
	 * 鼠标悬停在节点上时调用
	 * @param node 被悬停的节点
	 */
	onNodeHover?: (node: d3.HierarchyNode<MindMapNode>) => void;

	/**
	 * 鼠标离开节点时调用
	 * @param node 被离开的节点
	 */
	onNodeLeave?: (node: d3.HierarchyNode<MindMapNode>) => void;

	/**
	 * 点击画布空白区域时调用（用于取消选择）
	 */
	onCanvasClick?: () => void;

	/**
	 * 画布被拖拽时调用
	 * @param dx X轴拖拽距离
	 * @param dy Y轴拖拽距离
	 */
	onCanvasDrag?: (dx: number, dy: number) => void;

	/**
	 * 检查画布交互是否启用（如不在编辑模式）
	 * @returns true 如果画布交互启用
	 */
	isCanvasInteractionEnabled?: () => boolean;

	/**
	 * 检查是否正在编辑节点
	 * @returns true 如果正在编辑
	 */
	isEditing?: () => boolean;

	/**
	 * 获取当前正在编辑的节点
	 * @returns 当前正在编辑的节点，如果没有则返回 null
	 */
	getEditingNode?: () => d3.HierarchyNode<MindMapNode> | null;

	/**
	 * 画布交互状态改变时调用（用于重置拖拽状态）
	 * @param enabled 画布交互是否启用
	 */
	onCanvasInteractionChanged?: (enabled: boolean) => void;
}
 

/**
 * MouseInteraction 的配置选项
 */
export interface MouseInteractionOptions {
	/**
	 * 双击检测的时间窗口（毫秒）
	 * 默认: 300ms
	 */
	doubleClickTimeout?: number;

	/**
	 * 是否启用画布拖拽
	 * 默认: true
	 */
	enableCanvasDrag?: boolean;
}
