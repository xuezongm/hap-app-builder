#!/usr/bin/env python3
"""
从 get_worksheet_structure 的原始 JSON 响应构建 worksheetContext.json。

用法:
  python3 build_worksheet_context.py <raw_responses_dir> <output_path>

输入:
  raw_responses_dir — 存放原始响应文件的目录，每个文件名格式为 {worksheetName}.json，
                      内容为 get_worksheet_structure（responseFormat=json）的完整响应。

输出:
  worksheetContext.json — 标准化的工作表结构文件，供后续步骤使用。

工作流:
  1. AI 对每张工作表调用 get_worksheet_structure（responseFormat=json）
  2. AI 将每个响应的 JSON 原文直接写入 {raw_dir}/{worksheetName}.json
  3. AI 调用本脚本完成格式化与写入
"""

import json
import sys
from pathlib import Path


def extract_fields(raw_data):
    """从原始响应中提取字段列表。"""
    # 适配多种响应格式
    if isinstance(raw_data, dict):
        # 可能包在 data 里
        data = raw_data.get("data", raw_data)
        if isinstance(data, dict):
            fields = data.get("fields", data.get("controls", []))
            worksheet_id = data.get("worksheetId", data.get("id", ""))
            worksheet_name = data.get("worksheetName", data.get("name", ""))
            return worksheet_id, worksheet_name, fields
    return "", "", []


def normalize_field(field):
    """标准化单个字段为 worksheetContext 格式。"""
    result = {
        "id": field.get("id", field.get("controlId", "")),
        "alias": field.get("alias", ""),
        "name": field.get("name", field.get("controlName", "")),
        "type": field.get("type", ""),
    }

    # 选项字段
    options = field.get("options", [])
    if options:
        result["options"] = [
            {"key": opt.get("key", opt.get("value", "")), "value": opt.get("value", "")}
            for opt in options
            if not opt.get("isDelete", False)
        ]

    # 关联字段
    data_source = field.get("dataSource", "")
    if data_source:
        result["dataSource"] = data_source

    # 来源字段（反向关联）
    source_field = field.get("sourceField", "")
    if source_field:
        result["sourceField"] = source_field

    return result


def build_context(raw_dir, worksheet_id_by_name=None):
    """从原始响应目录构建 worksheetContext 数组。"""
    raw_path = Path(raw_dir)
    context = []

    for json_file in sorted(raw_path.glob("*.json")):
        with open(json_file, "r", encoding="utf-8") as f:
            raw_data = json.load(f)

        worksheet_id, worksheet_name, fields = extract_fields(raw_data)

        # 如果无法从响应中提取名称，使用文件名
        if not worksheet_name:
            worksheet_name = json_file.stem

        # 如果提供了 ID 映射，优先使用
        if worksheet_id_by_name and worksheet_name in worksheet_id_by_name:
            worksheet_id = worksheet_id_by_name[worksheet_name]

        normalized_fields = [normalize_field(f) for f in fields]

        context.append({
            "worksheetId": worksheet_id,
            "worksheetName": worksheet_name,
            "fields": normalized_fields,
        })

    return context


def main():
    if len(sys.argv) < 3:
        print(
            "用法: python3 build_worksheet_context.py <raw_responses_dir> <output_path>",
            file=sys.stderr,
        )
        sys.exit(1)

    raw_dir = Path(sys.argv[1])
    output_path = Path(sys.argv[2])

    if not raw_dir.exists():
        print(f"❌ 目录不存在: {raw_dir}", file=sys.stderr)
        sys.exit(1)

    # 可选：读取 worksheetIdByName 映射
    id_by_name_file = raw_dir / "_worksheetIdByName.json"
    worksheet_id_by_name = None
    if id_by_name_file.exists():
        with open(id_by_name_file, "r", encoding="utf-8") as f:
            worksheet_id_by_name = json.load(f)

    context = build_context(raw_dir, worksheet_id_by_name)

    # 写入输出
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(context, f, ensure_ascii=False, indent=2)

    # 摘要
    print(f"\n📋 worksheetContext 构建完成（共 {len(context)} 张表）：", file=sys.stderr)
    for ws in context:
        print(f"  • {ws['worksheetName']}: {len(ws['fields'])} 个字段", file=sys.stderr)
    print(f"\n✅ 输出: {output_path}", file=sys.stderr)


if __name__ == "__main__":
    main()
