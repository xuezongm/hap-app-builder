# OpenAI Codex 适配层

> 📋 计划中，尚未实现。

此目录将包含 OpenAI Codex 的 HAP App Builder 适配文件：

- `AGENTS.md` — Agent 定义
- `.codex/config.toml` — MCP 服务配置
- `skills/hap-app-builder/SKILL.md` — Agent Skill 入口
- `.codex/agents/` — Subagent 定义

核心规则复用 `core/` 目录，仅需编写 Codex 特有的入口和路由逻辑。
