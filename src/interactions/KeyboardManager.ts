import * as d3 from 'd3';
import { MindMapNode } from '../interfaces/mindmap-interfaces';
import {
	KeyboardHandlers,
	KeyboardManagerConfig,
	KeyboardManagerOptions
} from './KeyboardManagerCallbacks';

/**
 * KeyboardManager - 处理所有键盘交互逻辑
 *
 * 【职责】
 * - 全局键盘事件监听
 * - 快捷键处理（Tab、Delete、Enter、Ctrl+C/X/V）
 * - 编辑模式检测（编辑模式下阻止大部分快捷键）
 * - 移动端兼容（移动端禁用某些快捷键）
 *
 * 【设计原则】
 * - 通过回调与外部通信，不直接依赖 D3TreeRenderer
 * - 动态检测状态（避免引用失效）
 * - 异步处理剪贴板操作
 */
export class KeyboardManager {
	// 键盘事件监听器
	private keyboardListener: ((event: KeyboardEvent) => void) | null = null;

	// 配置选项
	private readonly options: Required<KeyboardManagerOptions>;

	// ========== 构造函数 ==========

	constructor(
		private config: KeyboardManagerConfig,
		private handlers: KeyboardHandlers
	) {
		// 默认配置
		this.options = {
			enableShortcuts: true,
			disableMobileShortcuts: true,
			...handlers
		};
	}

	// ========== 公共 API ==========

	/**
	 * 添加全局键盘事件监听器
	 */
	attachGlobalListener(): void {
		// 移除之前的事件监听器（如果存在）
		this.removeGlobalKeyboardListener();

		// 添加新的事件监听器
		this.keyboardListener = (event: KeyboardEvent) => {
			this.handleKeyDown(event);
		};

		document.addEventListener('keydown', this.keyboardListener);
	}

	/**
	 * 移除全局键盘事件监听器
	 */
	removeGlobalKeyboardListener(): void {
		if (this.keyboardListener) {
			document.removeEventListener('keydown', this.keyboardListener);
			this.keyboardListener = null;
		}
	}

	/**
	 * 销毁键盘管理器
	 */
	destroy(): void {
		this.removeGlobalKeyboardListener();
	}

	// ========== 私有方法 - 事件处理 ==========

	/**
	 * 处理键盘按下事件
	 */
	private handleKeyDown(event: KeyboardEvent): void {
		// 检查脑图视图是否为当前活动视图
		// 如果视图不活动，不拦截任何快捷键，允许默认行为
		if (this.config.isActiveView && !this.config.isActiveView()) {
			return; // 视图不活动，不拦截快捷键
		}

		// 编辑模式下，允许剪贴板操作（Ctrl+C/X/V），让浏览器默认处理
		if (this.config.isEditing()) {
			// 允许剪贴板操作通过，使用浏览器默认行为
			if ((event.ctrlKey || event.metaKey) && (event.key === "c" || event.key === "x" || event.key === "v")) {
				return; // 允许事件传播，使用浏览器默认剪贴板行为
			}
			return; // 阻止其他快捷键
		}

		if (event.key === "Tab") {
			event.preventDefault();
			this.handleTabKey();
		} else if (event.key === "Delete" || event.key === "Del") {
			event.preventDefault();
			this.handleDeleteKey();
		} else if (event.key === "Enter") {
			event.preventDefault();
			this.handleEnterKey();
		}
		// 桌面端快捷键：Ctrl+C / Cmd+C - 复制节点文本
		else if (!this.isMobile() && (event.ctrlKey || event.metaKey) && event.key === "c") {
			event.preventDefault();
			this.handleCopyShortcut();
		}
		// 桌面端快捷键：Ctrl+X / Cmd+X - 剪切节点
		else if (!this.isMobile() && (event.ctrlKey || event.metaKey) && event.key === "x") {
			event.preventDefault();
			this.handleCutShortcut();
		}
		// 桌面端快捷键：Ctrl+V / Cmd+V - 粘贴到节点
		else if (!this.isMobile() && (event.ctrlKey || event.metaKey) && event.key === "v") {
			event.preventDefault();
			this.handlePasteShortcut();
		}
		// 桌面端快捷键：Ctrl+Z / Cmd+Z - 撤销
		else if (!this.isMobile() && (event.ctrlKey || event.metaKey) && event.key === "z" && !event.shiftKey) {
			event.preventDefault();
			this.handleUndoShortcut();
		}
		// 桌面端快捷键：Ctrl+Shift+Z / Cmd+Shift+Z / Ctrl+Y / Cmd+Y - 重做
		else if (!this.isMobile() && (event.ctrlKey || event.metaKey) && (event.key === "y" || (event.key === "z" && event.shiftKey))) {
			event.preventDefault();
			this.handleRedoShortcut();
		}
	}

	/**
	 * 处理Tab键事件 - 添加子节点
	 */
	private handleTabKey(): void {
		const selectedNode = this.config.getSelectedNode();
		if (!selectedNode) {
			return; // 静默失败
		}

		// 调用与+号按钮相同的逻辑
		this.handlers.onTab?.(selectedNode);
	}

	/**
	 * 处理Delete键事件 - 删除节点
	 */
	private handleDeleteKey(): void {
		const selectedNode = this.config.getSelectedNode();
		if (!selectedNode) {
			return; // 静默失败
		}

		// 调用删除处理
		this.handlers.onDelete?.(selectedNode);
	}

	/**
	 * 处理Enter键事件 - 创建兄弟节点
	 */
	private handleEnterKey(): void {
		const selectedNode = this.config.getSelectedNode();
		if (!selectedNode) {
			return; // 静默失败
		}

		// 不能为根节点创建兄弟节点
		if (selectedNode.data.level === 0) {
			return;
		}

		// 调用Enter处理
		this.handlers.onEnter?.(selectedNode);
	}

	/**
	 * 处理 Ctrl+C / Cmd+C 快捷键 - 复制节点
	 */
	private handleCopyShortcut(): void {
		const selectedNode = this.config.getSelectedNode();
		if (!selectedNode) {
			return; // 静默失败
		}

		void this.handlers.onCopy?.(selectedNode);
	}

	/**
	 * 处理 Ctrl+X / Cmd+X 快捷键 - 剪切节点
	 */
	private handleCutShortcut(): void {
		const selectedNode = this.config.getSelectedNode();
		if (!selectedNode) {
			return; // 静默失败
		}

		void this.handlers.onCut?.(selectedNode);
	}

	/**
	 * 处理 Ctrl+V / Cmd+V 快捷键 - 粘贴到节点
	 */
	private handlePasteShortcut(): void {
		const selectedNode = this.config.getSelectedNode();
		if (!selectedNode) {
			return; // 静默失败
		}

		void this.handlers.onPaste?.(selectedNode);
	}

	/**
	 * 处理 Ctrl+Z / Cmd+Z 快捷键 - 撤销
	 */
	private handleUndoShortcut(): void {
		this.handlers.onUndo?.();
	}

	/**
	 * 处理 Ctrl+Shift+Z / Cmd+Shift+Z / Ctrl+Y / Cmd+Y 快捷键 - 重做
	 */
	private handleRedoShortcut(): void {
		this.handlers.onRedo?.();
	}

	// ========== 私有辅助方法 ==========

	/**
	 * 判断是否为移动端
	 */
	private isMobile(): boolean {
		return this.config.config?.isMobile || false;
	}
}
