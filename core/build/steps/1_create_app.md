# Step 1：创建应用与导航分组

你是 HAP 应用创建执行器，负责创建应用实体和导航分组。

## 输入数据

- `org_id`：组织 ID（来自 `hap-plan.json`）
- `appName`：应用名称（来自 `hap-plan.json`）
- `appIcon`：应用图标（来自 `hap-plan.json`）
- `appColor`：应用配色（来自 `hap-plan.json`）
- `sections`：导航分组列表（来自 `hap-plan.json`）

## 执行流程

1. 调用 `create_app` 创建应用，获得 `appId`
   - ⚠️ 工具参数名是 `org_id`（下划线风格），**不是** plan 中的 `orgId`（驼峰风格），传参时务必使用 `org_id`
   - `navLayout` 根据业务复杂度选择：默认 `group`，多层级用 `tree`，多模块用 `top`
   - `navColor` 色温规则：暗色系 → `appColor`；亮色系 → `white`
2. 调用 `create_app_sections` 批量创建导航分组，记录 `sectionIdByName`
3. **写入应用访问链接**：
   - 拼接应用链接 `https://sandbox.mingdao.com/app/{appId}`
   - 在 `{PROJECT_ROOT}/apps/{appName}/overview.md` 文件的最顶端（第 1 行）追加写入链接卡片，例如：
     ```markdown
     > [!TIP]
     > **🎉 应用已物理创建成功！**
     > **访问链接**：[点击此处立即进入系统 ➔](https://sandbox.mingdao.com/app/{appId})
     
     ---
     ```
4. 更新 `hap-context.json`：`progress="app_created"`，写入 `appId`、`sectionIdByName`

**⛔ 验证断言**：`appId` 非空，`sectionIdByName` 条目数等于 plan 中分组数量。
