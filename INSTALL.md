# 安装指南

## Skill 安装

将仓库中 `skills/hap-app-builder/` 目录复制到对应平台的技能目录：

| 平台 | 技能目录 |
|------|----------|
| Antigravity | `~/.gemini/config/plugins/hap-app-builder/` |
| Claude Code | `~/.claude/skills/hap-app-builder/` |
| Codex | `~/.codex/skills/hap-app-builder/` |
| Cursor | `~/.cursor/skills/hap-app-builder/` |
| Windsurf | `~/.codeium/windsurf/skills/hap-app-builder/` |
| Trae | `~/.trae/skills/hap-app-builder/` |
| CodeBuddy | `~/.codebuddy/skills/hap-app-builder/` |

> 部分平台（如 Antigravity）会克隆整个仓库作为插件，此时无需手动复制。

## MCP 服务配置

本技能需要连接到明道云沙箱 MCP 服务。安装时必须同时完成 MCP 配置，否则搭建无法执行。

### Token 获取

参见 [README.md](./README.md#token-获取)。

### 各平台配置格式

获取到 Token 后，写入对应平台的 MCP 配置文件。**注意：各平台的字段名和格式不同。**

#### Antigravity

文件：`~/.gemini/config/mcp_config.json`

- 字段名用 `serverUrl`（不是 `url`）
- 不支持 `${VAR}` 环境变量，必须写入明文 Token
- 不需要 `type` 字段

```json
{
  "mingdaoSandbox": {
    "serverUrl": "https://api3.mingdao.com/mcp?Authorization=md_pss_id%20{替换为你的Token}"
  }
}
```

#### Claude Code

文件：`~/.mcp.json`

- 外层键名为 `mcpServers`
- 需要 `type` 字段
- 支持 `${VAR}` 环境变量

```json
{
  "mcpServers": {
    "mingdaoSandbox": {
      "type": "streamable-http",
      "url": "https://api3.mingdao.com/mcp?Authorization=md_pss_id%20{替换为你的Token}"
    }
  }
}
```

#### Cursor

文件：`~/.cursor/mcp.json`

- 格式与 Claude Code 基本一致，外层键名为 `mcpServers`
- 支持 `headers` 字段传递鉴权（也可直接拼在 URL 中）

```json
{
  "mcpServers": {
    "mingdaoSandbox": {
      "url": "https://api3.mingdao.com/mcp?Authorization=md_pss_id%20{替换为你的Token}"
    }
  }
}
```

#### Windsurf

文件：`~/.codeium/windsurf/mcp_config.json`

- 格式与 Claude Code 基本一致，外层键名为 `mcpServers`

```json
{
  "mcpServers": {
    "mingdaoSandbox": {
      "serverUrl": "https://api3.mingdao.com/mcp?Authorization=md_pss_id%20{替换为你的Token}"
    }
  }
}
```

#### Trae

文件：`~/.trae/mcp.json`

- 格式与 Claude Code 一致，外层键名为 `mcpServers`

```json
{
  "mcpServers": {
    "mingdaoSandbox": {
      "url": "https://api3.mingdao.com/mcp?Authorization=md_pss_id%20{替换为你的Token}"
    }
  }
}
```

#### CodeBuddy（腾讯云代码助手）

文件：`~/.codebuddy/settings.json`

- 外层键名为 `mcpServers`
- 也可通过 IDE 界面 Settings → MCP → Add MCP 配置

```json
{
  "mcpServers": {
    "mingdaoSandbox": {
      "url": "https://api3.mingdao.com/mcp?Authorization=md_pss_id%20{替换为你的Token}"
    }
  }
}
```

#### Codex

文件：`~/.codex/config.toml`

```toml
[mcp_servers.mingdaoSandbox]
type = "url"
url = "https://api3.mingdao.com/mcp?Authorization=md_pss_id%20{替换为你的Token}"
```

> **提示**：`md_pss_id` 原始格式为 `md_pss_id {token}`（中间有空格），写入 URL 时空格需编码为 `%20`。
