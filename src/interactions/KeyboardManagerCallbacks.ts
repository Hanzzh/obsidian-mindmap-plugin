import * as d3 from 'd3';
import { MindMapNode } from '../interfaces/mindmap-interfaces';
import { MindMapConfig } from '../config/types';

/**
 * 键盘事件处理器接口
 *
 * 用于解耦 KeyboardManager 和 D3TreeRenderer 之间的依赖关系
 * KeyboardManager 通过这些回调与外部通信
 */
 
export interface KeyboardHandlers {
	/**
	 * Tab键 - 添加子节点
	 */
	onTab?: (selectedNode: d3.HierarchyNode<MindMapNode>) => void;

	/**
	 * Delete键 - 删除节点
	 */
	onDelete?: (selectedNode: d3.HierarchyNode<MindMapNode>) => void;

	/**
	 * Enter键 - 添加兄弟节点
	 */
	onEnter?: (selectedNode: d3.HierarchyNode<MindMapNode>) => void;

	/**
	 * Ctrl+C / Cmd+C - 复制节点
	 */
	onCopy?: (selectedNode: d3.HierarchyNode<MindMapNode>) => Promise<boolean>;

	/**
	 * Ctrl+X / Cmd+X - 剪切节点
	 */
	onCut?: (selectedNode: d3.HierarchyNode<MindMapNode>) => Promise<boolean>;

	/**
	 * Ctrl+V / Cmd+V - 粘贴到节点
	 */
	onPaste?: (selectedNode: d3.HierarchyNode<MindMapNode>) => Promise<boolean>;

	/**
	 * Ctrl+Z / Cmd+Z - 撤销
	 */
	onUndo?: () => void;

	/**
	 * Ctrl+Shift+Z / Ctrl+Y / Cmd+Shift+Z / Cmd+Y - 重做
	 */
	onRedo?: () => void;
}
 

/**
 * KeyboardManager 配置接口
 */
export interface KeyboardManagerConfig {
	/**
	 * MindMap 配置（用于判断设备类型）
	 */
	config?: MindMapConfig;

	/**
	 * 判断是否处于编辑模式
	 */
	isEditing: () => boolean;

	/**
	 * 获取当前选中节点
	 */
	getSelectedNode: () => d3.HierarchyNode<MindMapNode> | null;

	/**
	 * 判断脑图视图是否为当前活动视图
	 * 用于防止快捷键在其他视图（如普通markdown编辑器）中生效
	 */
	isActiveView?: () => boolean;
}

/**
 * KeyboardManager 选项
 */
export interface KeyboardManagerOptions {
	/**
	 * 是否启用快捷键
	 * 默认: true
	 */
	enableShortcuts?: boolean;

	/**
	 * 是否在移动端禁用某些快捷键
	 * 默认: true
	 */
	disableMobileShortcuts?: boolean;
}
