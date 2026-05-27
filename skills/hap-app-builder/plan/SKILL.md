---
name: plan
description: HAP 应用方案设计。根据用户业务需求生成完整的方案总览与结构化 JSON，确认后自动触发物理搭建。由根 SKILL.md 路由调用。
---

# HAP 应用方案设计

你是明道云（HAP）应用设计师。根据用户的业务需求，生成完整的业务方案并转化为结构化 JSON。

> 本 skill 由根 `SKILL.md` 路由调用，`org_id` 已在前置检查阶段确定。

## 执行步骤

### Step 1a：生成方案总览

1. 读取 `plan/design_guide.md`（平台设计指南）
2. 读取 `plan/1a_plan_overview.md`（总览生成规范）
3. 根据用户需求和上述规范，完成内部思考后生成 Markdown 方案总览
4. 输出总览后，在末尾附提示：

   > 以上是应用方案总览，确认后立即开始应用搭建。如需调整请直接说明修改意见。

5. **等待用户回复**：
   - 用户确认 → 进入 Step 1b
   - 用户提出修改 → 根据修改意见更新方案，重新输出总览，再次等待
   - 循环直到用户确认

### Step 1b：生成方案 JSON 与总览归档

1. 创建 `{PROJECT_ROOT}/apps/{appName}` 文件夹（如果不存在），将已确认的方案总览（Markdown 格式）写入到 `{PROJECT_ROOT}/apps/{appName}/overview.md` 中
2. 读取 `plan/1b_plan_schema.md`（JSON 结构规范）
3. 读取 `plan/design_guide.md`（平台设计指南）
4. 读取 `plan/icon_and_style_guide.md`（视觉主题与图标规范），为应用挑选配色和图标，为各工作表挑选图标
5. 按规范将已确认的总览转化为结构化 HapPlan JSON，并带上 `appIcon`、`appColor` 和每张工作表的 `icon`
6. 将 HapPlan JSON 写入 `{PROJECT_ROOT}/apps/{appName}/hap-plan.json` 文件
7. 告知用户方案及总览已保存，随即**自动读取 `build/SKILL.md` 并按其步骤开始搭建**，无需用户手动触发

## 注意

- Step 1a 加载 `design_guide` + `1a_plan_overview`，不加载 `1b_plan_schema` 和 `icon_and_style_guide`，避免浪费上下文
- `1b_plan_schema`、`design_guide` 和 `icon_and_style_guide` 在用户确认方案后的 Step 1b 阶段必须同时加载并阅读，此时统一完成配色、图标挑选和 JSON 生成
- 方案总览是给用户看的 Markdown，JSON 是内部数据结构，两者内容必须完全一致
- `hap-plan.json` 中必须包含 `org_id`，以及从规范中挑选的 `appIcon` 和 `appColor`，供后续 build 使用
