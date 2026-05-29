# 版本更新机制

## 工作原理

用户每次启动技能时，前置检查阶段会执行 `scan_apps.cjs` 脚本。该脚本在扫描已有应用的同时，异步请求 GitHub 远程仓库的 `plugin.json`，比对 `version` 字段：

```
本地 plugin.json (version: 1.0.0)
        ↓ 比对
远程 raw.githubusercontent.com/.../plugin.json (version: 1.1.0)
        ↓ 不一致
输出 update: { available: true, local: "1.0.0", remote: "1.1.0", notes: "..." }
        ↓
AI Agent 展示更新说明，询问用户是否更新
        ↓ 用户同意
AI Agent 自动执行 git pull
```

- **超时**：2 秒，失败静默跳过，不影响正常使用
- **远程地址**：自动从本地 `plugin.json` 的 `repository` 字段构造

## 发版流程

发布新版本时，更新以下文件后 `git push`：

| 文件 | 需更新字段 | 说明 |
|------|------------|------|
| `plugin.json`（根目录） | `version` + `releaseNotes` | **必须**。版本检查的数据源 |
| `.codex-plugin/plugin.json` | `version` + `releaseNotes` | **必须**。与根目录保持同步 |

### releaseNotes 写法

一句话概括本次更新的核心变更，用中文分号分隔多项：

```json
{
  "version": "1.1.0",
  "releaseNotes": "新增外部角色工作台设计指导；优化工作流闭环自检"
}
```

## 涉及文件

| 文件 | 职责 |
|------|------|
| `plugin.json` | 存储 `version`、`releaseNotes`、`repository` |
| `skills/.../plan/scripts/scan_apps.cjs` | 执行版本检查，输出 `update` 字段 |
| `skills/.../SKILL.md` | 指导 AI Agent 处理 `update` 字段并交互 |
