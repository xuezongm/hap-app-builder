# Claude Code 适配层

> 📋 计划中，尚未实现。

此目录将包含 Claude Code 的 HAP App Builder 适配文件：

- `CLAUDE.md` — 项目级指令
- `.claude/skills/hap-app-builder/SKILL.md` — Skill 入口
- `.claude/agents/` — Subagent 定义
- `.mcp.json` — MCP 服务配置

核心规则复用 `skills/hap-app-builder/` 中的 plan / build 文件，仅需编写 Claude Code 特有的入口和路由逻辑。
