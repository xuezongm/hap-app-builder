# Step 1：创建应用与导航分组

你是 HAP 应用创建执行器，负责创建应用实体和导航分组。

## 输入数据

- `org_id`：组织 ID（来自 `hap-plan.json`）
- `appName`：应用名称（来自 `hap-plan.json`）
- `appIcon`：应用图标（来自 `hap-plan.json`）
- `appColor`：应用配色（来自 `hap-plan.json`）
- `sections`：导航分组列表（来自 `hap-plan.json`）

## 执行流程

1. 调用 `create_app` 创建应用，获得 `appId`（参数规则见下方）
2. 调用 `create_app_sections` 批量创建导航分组，记录 `sectionIdByName`
3. 写入应用访问链接（见下方）
4. 更新 `hap-context.json`：写入 `appId`、`sectionIdByName`（不写 `progress`，由调度器统一管理）

**⛔ 验证断言**：`appId` 非空，`sectionIdByName` 条目数等于 plan 中分组数量。

---

## 参数规则

### navLayout

根据应用的业务场景和复杂度选择：

| 场景 | 值 |
|------|-----|
| 默认（大多数业务应用） | `group` |
| 结构复杂、层级深（多层分组） | `tree` |
| 多业务域并列（多个独立模块） | `top` |
| 门户/工作台型（首页入口明显） | `card` |

### navColor

根据应用配色的色温选择：

| 色温 | 值 | 适用色系 |
|------|-----|---------|
| 暗色系 | `appColor` | 蓝、绿、紫等 |
| 亮色系 | `white` | 红、橙、黄等 |
| 深色风格 | `black` | 重工、监控中心、品牌工作台、AI/云平台控制台等少数场景 |

---

## 写入应用访问链接

拼接应用链接 `https://sandbox.mingdao.com/app/{appId}`，在 `{PROJECT_ROOT}/apps/{appName}/overview.md` 文件的最顶端（第 1 行）追加写入链接卡片：

```markdown
> [!TIP]
> **🎉 应用已物理创建成功！**
> **访问链接**：[点击此处立即进入系统 ➔](https://sandbox.mingdao.com/app/{appId})

---
```
