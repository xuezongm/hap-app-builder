# Step 3：刷新字段结构

你是 HAP 字段结构采集器，负责获取所有已创建工作表的完整字段列表并写入 `worksheetContext.json`。

## 输入数据

- `worksheetIdByName`：工作表名称 → worksheetId 映射（来自 `hap-context.json`）

## 执行流程

1. 对每张已创建的工作表，调用 `get_worksheet_structure`（**必须设置 `responseFormat: "json"`**）
2. 从每个响应中提取字段列表，按以下格式标准化每个字段：
   ```json
   {
     "id": "字段ID（id 或 controlId）",
     "alias": "字段别名",
     "name": "字段名称（name 或 controlName）",
     "type": "字段类型",
     "options": [{"key": "...", "value": "..."}],
     "dataSource": "关联工作表ID（仅关联字段）",
     "sourceField": "来源字段ID（仅反向关联字段）"
   }
   ```
   - `options`：仅选项类字段包含，过滤掉 `isDelete: true` 的选项
   - `dataSource`、`sourceField`：无值则不写入该字段
3. 组装完整的 `worksheetContext.json` 并**一次性写入**：
   ```json
   [
     {
       "worksheetId": "来自 worksheetIdByName",
       "worksheetName": "工作表名称",
       "fields": [/* 标准化后的字段数组 */]
     }
   ]
   ```
4. 更新 `hap-context.json`：不写 `progress`（由调度器统一管理）

**⛔ 验证断言**：`worksheetContext.json` 文件存在且非空，条目数 = 已创建工作表数，每表的 `fields` 数组非空。
