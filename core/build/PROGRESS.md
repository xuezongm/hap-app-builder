# Progress 状态机

`hap-context.json` 中的 `progress` 字段是一个有限状态机，每步只允许推进一格。

## 状态定义

| 状态值 | 含义 | 前置状态 | 由哪个 Step 写入 |
|--------|------|---------|----- |
| _(空/不存在)_ | 初始状态 | — | — |
| `app_created` | 应用和导航分组已创建 | _(空)_ | Step 1 |
| `worksheets_created` | 所有工作表已创建 | `app_created` | Step 2 |
| `fields_refreshed` | 字段结构已刷新 | `worksheets_created` | Step 3 |
| `actions_created` | 自定义动作已创建 | `fields_refreshed` | Step 4 |
| `views_created` | 视图已创建 | `actions_created` | Step 5 |
| `sample_data_created` | 示例数据已写入 | `views_created` | Step 6 |
| `pages_created` | 自定义页面与 AI 助手已创建 | `sample_data_created` | Step 7 |
| `roles_created` | 角色已创建 | `pages_created` | Step 8 |
| `workflows_designed` | 工作流已设计 | `roles_created` | Step 9 |
| `system_workflows_published` | 系统工作流已发布 | `workflows_designed` | Step 10 |
| `completed` | 全部完成 | `system_workflows_published` | Step 11 |
| `failed` | 执行失败 | _(任意)_ | 任意步骤 |

## 规则

- **只能前进不能后退**——每步只能将 progress 推进到下一个状态
- **不能跳跃**——不允许从 `app_created` 直接跳到 `views_created`
- **failed 是终态**——进入 `failed` 后必须人工介入
