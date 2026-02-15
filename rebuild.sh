#!/bin/bash

###############################################################################
# 思维导图插件快速重新编译脚本
#
# 用途：跳过TypeScript类型检查，直接使用esbuild编译
# 适用场景：修改代码后快速重新编译，不关注类型错误
#
# 使用方法：
#   ./rebuild.sh
#
# 注意：此脚本会直接覆盖 main.js 文件
###############################################################################

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目目录
PLUGIN_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PLUGIN_DIR"

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}思维导图插件快速重新编译${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""

# 显示当前文件信息
echo -e "${YELLOW}当前文件状态：${NC}"
if [ -f "main.js" ]; then
    ls -lh main.js | awk '{print "  大小: " $5 "  修改时间: " $6 " " $7 " " $8}'
else
    echo -e "  ${RED}main.js 不存在${NC}"
fi
echo ""

# 开始编译
echo -e "${GREEN}开始编译...${NC}"
echo ""

# 使用esbuild编译（跳过TypeScript类型检查）
npx esbuild src/main.ts \
    --bundle \
    --external:obsidian \
    --external:electron \
    --external:@codemirror/autocomplete \
    --external:@codemirror/collab \
    --external:@codemirror/commands \
    --external:@codemirror/language \
    --external:@codemirror/lint \
    --external:@codemirror/search \
    --external:@codemirror/state \
    --external:@codemirror/view \
    --external:@lezer/common \
    --external:@lezer/highlight \
    --external:@lezer/json \
    --format=cjs \
    --outfile=main.js \
    --sourcemap=inline

echo ""

# 检查编译结果
if [ -f "main.js" ]; then
    echo -e "${GREEN}✅ 编译成功！${NC}"
    echo ""
    echo -e "${YELLOW}编译后文件信息：${NC}"
    ls -lh main.js | awk '{print "  大小: " $5 "  修改时间: " $6 " " $7 " " $8}'
    echo ""

    # 统计console.log数量
    LOG_COUNT=$(grep -c "console.log" main.js || echo "0")
    echo -e "${YELLOW}调试日志统计：${NC}"
    echo -e "  console.log 数量: ${BLUE}$LOG_COUNT${NC}"

    if [ "$LOG_COUNT" -le 2 ]; then
        echo -e "  ${GREEN}✓ 日志已清理${NC}"
    else
        echo -e "  ${YELLOW}⚠ 注意：仍有 $LOG_COUNT 个日志输出${NC}"
    fi
    echo ""

    echo -e "${BLUE}======================================${NC}"
    echo -e "${GREEN}下一步：在Obsidian中重新加载插件${NC}"
    echo -e "${BLUE}======================================${NC}"
    echo ""
    echo -e "方法1: 按 ${YELLOW}Ctrl+R${NC} (Windows/Linux) 或 ${YELLOW}Cmd+R${NC} (Mac)"
    echo -e "方法2: 关闭并重新打开Obsidian"
    echo ""
else
    echo -e "${RED}❌ 编译失败：main.js 未生成${NC}"
    exit 1
fi
