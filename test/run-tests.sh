#!/bin/bash

# 思维导图插件测试运行脚本

echo "🧠 思维导图插件测试套件"
echo "=========================="

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"

# 运行Node.js验证测试
echo ""
echo "🔍 运行重叠验证测试..."
node test-overlap-verification.js
TEST_RESULT=$?

if [ $TEST_RESULT -eq 0 ]; then
    echo ""
    echo "✅ Node.js 测试通过"
else
    echo ""
    echo "❌ Node.js 测试失败"
    exit 1
fi

# 询问是否打开HTML可视化测试
echo ""
read -p "🌐 是否打开HTML可视化测试页面? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 打开HTML测试页面..."
    if command -v xdg-open &> /dev/null; then
        xdg-open test-overlap.html
    elif command -v open &> /dev/null; then
        open test-overlap.html
    else
        echo "⚠️  请手动打开 test-overlap.html 文件"
    fi
fi

echo ""
echo "🎉 测试完成！"
echo ""
echo "📚 测试文件说明:"
echo "  - test-overlap.html: 可视化测试页面"
echo "  - test-overlap-verification.js: Node.js 自动化测试"
echo "  - test-data.md: 测试用的思维导图数据"
echo "  - README.md: 详细的测试文档"