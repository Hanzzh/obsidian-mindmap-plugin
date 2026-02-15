# 思维导图插件测试架构

## 📁 新的测试架构说明

本目录已重构为真正的测试架构，解决了原测试文件中代码重复和维护困难的问题。

## 🏗️ 架构设计

### 核心模块 (`src/mindmap-core.ts`)
- **目的**: 提取核心功能为独立模块，可被主代码和测试文件共享使用
- **包含功能**:
  - `getNodeDimensions()` - 节点尺寸计算
  - `simulateTreeLayout()` - 树布局模拟
  - `detectOverlaps()` - 重叠检测

### 构建系统
- **主构建**: `esbuild.config.mjs` - 生成 `main.js` 用于Obsidian插件
- **测试构建**: `esbuild.test.config.mjs` - 生成 `dist/mindmap-core.js` 用于测试
- **自动集成**: `npm test` 命令自动构建核心模块并运行测试

### 测试类型

#### 1. 集成测试 (`test-overlap-verification.js`)
- **用途**: 验证完整的思维导图布局和重叠检测
- **特点**: 使用真实数据，测试实际场景
- **运行**: `npm run test` 或 `npm test`

#### 2. 单元测试 (`unit-tests.js`)
- **用途**: 测试各个函数的独立功能
- **特点**: 细粒度测试，覆盖边界情况
- **运行**: `npm run test:unit`

## 🚀 使用方法

### 快速开始
```bash
# 运行所有测试（包括构建核心模块）
npm test

# 仅运行单元测试
npm run test:unit

# 仅构建核心模块
npm run build:core
```

### 开发工作流
1. **修改核心功能**: 编辑 `src/main.ts` 或 `src/mindmap-core.ts`
2. **运行测试**: `npm test` 确保功能正常
3. **验证构建**: `npm run build` 生成最终插件

## 🎯 解决的问题

### ✅ 代码重复消除
- **之前**: 测试文件中有重复的实现代码
- **现在**: 测试文件导入核心模块，实现真正的"测试而非重复"

### ✅ 维护简化
- **之前**: 修改主代码后需要手动同步测试文件
- **现在**: 核心模块单一来源，测试自动使用最新版本

### ✅ 测试准确性
- **之前**: 测试的可能是过时的实现
- **现在**: 测试直接使用实际运行的核心函数

### ✅ 构建集成
- **之前**: 需要手动处理模块导入问题
- **现在**: 自动构建和导入，支持fallback机制

## 📊 测试覆盖

### 单元测试覆盖
- ✅ 节点尺寸计算 (4个测试用例)
- ✅ 树布局模拟 (5个测试用例)
- ✅ 重叠检测 (4个测试用例)
- ✅ 复杂场景 (2个测试用例)

### 集成测试覆盖
- ✅ 真实数据验证
- ✅ 性能评估
- ✅ 布局质量检查
- ✅ 重叠问题检测

## 🛠️ 技术细节

### 模块导出/导入
```typescript
// 核心模块导出
export { getNodeDimensions, simulateTreeLayout, detectOverlaps };

// 测试文件导入
const { getNodeDimensions, simulateTreeLayout, detectOverlaps } = require('../dist/mindmap-core.js');
```

### Fallback机制
当编译后的核心模块不存在时，测试文件自动使用内置的fallback实现，确保测试始终可以运行。

### 错误处理
- 智能模块加载检测
- 清晰的错误提示信息
- 自动构建核心模块

## 📈 未来扩展

### 计划中的测试改进
- 🔄 持续集成 (CI/CD)
- 📊 代码覆盖率报告
- 🧪 更多的边界情况测试
- 🎯 性能基准测试

### 测试工具
- 📋 更丰富的断言库
- 📝 测试报告生成
- 🔍 详细的调试信息
- 📱 可视化测试工具

## 🐛 故障排除

### 常见问题
1. **"Core module not found"**: 运行 `npm run build:core`
2. **测试失败**: 检查核心模块是否正确构建
3. **导入错误**: 确保 `dist/` 目录存在且有权限

### 调试技巧
- 查看构建日志: `npm run build:core -- --verbose`
- 检查核心模块: `ls -la dist/`
- 运行单独测试: `node test/unit-tests.js`

---

**注意**: 这个新架构确保测试始终与实际实现保持同步，大大提高了代码质量和维护效率。