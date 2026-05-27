# Step 3：刷新字段结构

你是 HAP 字段结构采集器，负责获取所有已创建工作表的完整字段列表并构建内存数据源。

## 输入数据

- `worksheetIdByName`：工作表名称 → worksheetId 映射（来自 `hap-context.json`）

## 执行流程

1. 创建临时目录 `{PROJECT_ROOT}/apps/{appName}/_raw_structures/`
2. 将 `worksheetIdByName` 写入 `_raw_structures/_worksheetIdByName.json`
3. 对每张已创建的工作表，调用 `get_worksheet_structure`（**必须设置 `responseFormat: "json"`**），将原始 JSON 响应**直接写入** `_raw_structures/{工作表名称}.json`（不做任何格式化处理）
4. 运行构建脚本：
   ```bash
   python3 {SKILL_DIR}/build/scripts/build_worksheet_context.py \
     {PROJECT_ROOT}/apps/{appName}/_raw_structures \
     {PROJECT_ROOT}/apps/{appName}/worksheetContext.json
   ```
5. 验证脚本输出后，删除临时目录 `_raw_structures/`
6. 更新 `hap-context.json`：不写 `progress`（由调度器统一管理）

> **为什么用脚本**：AI 手动组装大 JSON 并写入文件非常慢。让 AI 只保存原始数据，脚本完成格式化和写入，速度快且无格式错误。

**⛔ 验证断言**：`worksheetContext.json` 文件存在且非空，条目数 = 已创建工作表数，每表的 `fields` 数组非空。
