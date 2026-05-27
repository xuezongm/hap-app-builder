#!/bin/bash
# HAP App Builder 发布前校验脚本
# 用法: bash scripts/validate.sh

set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ERRORS=0

check() {
  if [ "$1" -ne 0 ]; then
    echo "❌ $2"
    ERRORS=$((ERRORS + 1))
  else
    echo "✅ $2"
  fi
}

echo "🔍 HAP App Builder 发布前校验"
echo "================================"
echo ""

# 1. plugin.json 文件存在且是合法 JSON
for f in "$ROOT/plugin.json" "$ROOT/.claude-plugin/plugin.json" "$ROOT/.codex-plugin/plugin.json"; do
  if [ -f "$f" ]; then
    python3 -c "import json; json.load(open('$f'))" 2>/dev/null
    check $? "$(basename "$(dirname "$f")")/$(basename "$f") 是合法 JSON"
  else
    check 1 "$(basename "$(dirname "$f")")/$(basename "$f") 不存在"
  fi
done

# 2. SKILL.md 入口存在
[ -f "$ROOT/skills/hap-app-builder/SKILL.md" ]
check $? "skills/hap-app-builder/SKILL.md 存在"

# 3. .mcp.json 存在
[ -f "$ROOT/.mcp.json" ]
check $? ".mcp.json 存在"

# 4. .mcp.json 不含明文 token（只应有变量引用）
if [ -f "$ROOT/.mcp.json" ]; then
  # 检查是否包含 md_pss_id 明文值（非变量引用格式）
  if grep -qE '"Authorization[^"]*":\s*"[^${}]' "$ROOT/.mcp.json" 2>/dev/null; then
    check 1 ".mcp.json 不含明文 Token"
  else
    check 0 ".mcp.json 不含明文 Token"
  fi
fi

# 5. README 包含安装说明关键词
grep -q "MINGDAO_AUTH" "$ROOT/README.md" 2>/dev/null
check $? "README 包含 MINGDAO_AUTH 配置说明"

grep -q "Codex" "$ROOT/README.md" 2>/dev/null
check $? "README 包含 Codex 安装说明"

echo ""
echo "================================"
if [ "$ERRORS" -eq 0 ]; then
  echo "✅ 全部检查通过，可以发布！"
  exit 0
else
  echo "❌ 发现 $ERRORS 个问题，请修复后再发布。"
  exit 1
fi
