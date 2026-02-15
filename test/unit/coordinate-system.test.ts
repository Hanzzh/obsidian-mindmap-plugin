/**
 * CoordinateConverter 单元测试
 *
 * 测试坐标系统转换工具的正确性
 */

import { CoordinateConverter } from '../src/utils/coordinate-system';

describe('CoordinateConverter', () => {
	describe('基础坐标转换', () => {
		test('toCanvasX: 布局Y直接映射为画布X', () => {
			expect(CoordinateConverter.toCanvasX(100, 0)).toBe(100);
			expect(CoordinateConverter.toCanvasX(200, 10)).toBe(210);
			expect(CoordinateConverter.toCanvasX(0, 0)).toBe(0);
		});

		test('toCanvasY: 布局X（中心）转换为画布Y（顶边）', () => {
			// 节点中心在100，高度50，顶边应该在75
			expect(CoordinateConverter.toCanvasY(100, 50, 0)).toBe(75);

			// 节点中心在200，高度100，顶边应该在150
			expect(CoordinateConverter.toCanvasY(200, 100, 0)).toBe(150);

			// 节点中心在0，高度60，顶边应该在-30
			expect(CoordinateConverter.toCanvasY(0, 60, 0)).toBe(-30);

			// 带偏移
			expect(CoordinateConverter.toCanvasY(100, 50, 10)).toBe(85);
		});

		test('toLayoutX: 画布Y（顶边）转换为布局X（中心）', () => {
			// 顶边在75，高度50，中心应该在100
			expect(CoordinateConverter.toLayoutX(75, 50, 0)).toBe(100);

			// 顶边在150，高度100，中心应该在200
			expect(CoordinateConverter.toLayoutX(150, 100, 0)).toBe(200);

			// 带偏移
			expect(CoordinateConverter.toLayoutX(85, 50, 10)).toBe(100);
		});
	});

	describe('边缘计算', () => {
		test('toRightEdge: 计算节点右边缘', () => {
			// layoutY=200, width=100, padding=20, offset=6
			// 预期: 200 + 100 - 20 + 6 = 286
			expect(CoordinateConverter.toRightEdge(200, 100, 20, 6, 0)).toBe(286);

			// 带全局偏移
			expect(CoordinateConverter.toRightEdge(200, 100, 20, 6, 10)).toBe(296);
		});

		test('toLeftEdge: 计算节点左边缘（带padding）', () => {
			// layoutY=400, padding=20, offset=6
			// 预期: 400 + 20 - 6 = 414
			expect(CoordinateConverter.toLeftEdge(400, 20, 6, 0)).toBe(414);

			// 带全局偏移
			expect(CoordinateConverter.toLeftEdge(400, 20, 6, 10)).toBe(424);
		});
	});

	describe('边界计算', () => {
		test('getNodeBounds: 计算节点边界矩形', () => {
			const bounds = CoordinateConverter.getNodeBounds(100, 75, 50, 50);

			expect(bounds.x).toBe(100);
			expect(bounds.y).toBe(75);
			expect(bounds.right).toBe(150);
			expect(bounds.bottom).toBe(125);
			expect(bounds.width).toBe(50);
			expect(bounds.height).toBe(50);
		});

		test('getNodeBounds: 处理负数坐标', () => {
			const bounds = CoordinateConverter.getNodeBounds(-10, -20, 30, 40);

			expect(bounds.x).toBe(-10);
			expect(bounds.y).toBe(-20);
			expect(bounds.right).toBe(20);
			expect(bounds.bottom).toBe(20);
		});
	});

	describe('距离和重叠检测', () => {
		test('getVerticalDistance: 计算垂直距离', () => {
			expect(CoordinateConverter.getVerticalDistance(100, 200)).toBe(100);
			expect(CoordinateConverter.getVerticalDistance(75, 193)).toBe(118);
			expect(CoordinateConverter.getVerticalDistance(50, 50)).toBe(0);
		});

		test('isOverlapping: 检测节点重叠', () => {
			// 重叠的情况
			expect(CoordinateConverter.isOverlapping(100, 50, 120, 50, 0)).toBe(true);

			// 刚好接触
			expect(CoordinateConverter.isOverlapping(100, 50, 150, 50, 0)).toBe(false);

			// 有间距
			expect(CoordinateConverter.isOverlapping(75, 176, 193, 40, 10)).toBe(false);

			// 考虑安全间距
			expect(CoordinateConverter.isOverlapping(75, 176, 185, 40, 10)).toBe(true);
		});

		test('calculateActualGap: 计算实际间距', () => {
			// 节点1: 中心75, 高度176 → 范围[-13, 163]
			// 节点2: 中心193, 高度40 → 范围[173, 213]
			// 间距: 173 - 163 = 10px
			expect(CoordinateConverter.calculateActualGap(75, 176, 193, 40)).toBe(10);

			// 重叠的情况
			expect(CoordinateConverter.calculateActualGap(100, 50, 130, 50)).toBe(-25);

			// 刚好接触
			expect(CoordinateConverter.calculateActualGap(100, 50, 150, 50)).toBe(0);
		});
	});

	describe('便捷方法', () => {
		test('createTransform: 生成transform字符串', () => {
			const transform = CoordinateConverter.createTransform(100, 200, 100, 50, 0, 0);
			expect(transform).toBe('translate(200, 75)'); // X=200, Y=100-25=75
		});

		test('createTransform: 带偏移量', () => {
			const transform = CoordinateConverter.createTransform(100, 200, 100, 50, 10, 5);
			expect(transform).toBe('translate(210, 80)'); // X=200+10, Y=100-25+5=80
		});
	});

	describe('实际场景测试', () => {
		test('场景1: 8行节点与1行节点的间距', () => {
			// 模拟 test-multiline-node.md 的情况
			const node1Center = 75;
			const node1Height = 176;
			const node2Center = 193;
			const node2Height = 40;

			// 计算间距
			const gap = CoordinateConverter.calculateActualGap(
				node1Center,
				node1Height,
				node2Center,
				node2Height
			);

			// 预期间距: 10px (根据布局计算)
			expect(gap).toBe(10);

			// 验证不重叠（间距 > 0）
			expect(gap).toBeGreaterThan(0);

			// 验证重叠检测
			const isOverlapping = CoordinateConverter.isOverlapping(
				node1Center,
				node1Height,
				node2Center,
				node2Height,
				0
			);
			expect(isOverlapping).toBe(false);
		});

		test('场景2: 父子节点连线计算', () => {
			// 父节点: layoutY=200, width=120, padding=20
			// 子节点: layoutY=400, padding=20
			const sourceX = CoordinateConverter.toRightEdge(200, 120, 20, 6, 0);
			const targetX = CoordinateConverter.toLeftEdge(400, 20, 6, 0);

			expect(sourceX).toBe(286); // 200 + 120 - 20 + 6
			expect(targetX).toBe(414); // 400 + 20 - 6
		});

		test('场景3: 完整的节点transform', () => {
			// 模拟一个节点的transform计算
			const layoutX = 75;   // 垂直中心
			const layoutY = 570.3; // 水平左边缘
			const width = 63;
			const height = 176;

			const transform = CoordinateConverter.createTransform(
				layoutX,
				layoutY,
				width,
				height,
				0,
				0
			);

			// 预期: translate(570.3, -13.0)
			// X = 570.3 (直接映射)
			// Y = 75 - 88 = -13 (中心转顶边)
			expect(transform).toBe('translate(570.3, -13)');
		});
	});
});
