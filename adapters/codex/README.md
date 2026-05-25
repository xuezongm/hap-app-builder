# OpenAI Codex 适配层

> ✅ 已适配。skill 文件可通过 `skill-installer` 直接从 GitHub 安装。

## 安装步骤

### 1. 安装 Skill

在 Codex 中运行：

```
安装 GitHub skill xuezongm/hap-app-builder，路径 skills/hap-app-builder
```

或直接执行安装脚本：

```bash
python3 ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --repo xuezongm/hap-app-builder \
  --path skills/hap-app-builder
```

### 2. 配置 MCP 服务

在 `~/.codex/config.toml` 中添加：

```toml
[mcp_servers.mingdaoSandbox]
url = "https://api3.mingdao.com/mcp"
bearer_token_env_var = "HAP-Appkey=<your-appkey>&HAP-Sign=<your-sign>"
enabled = true
```

> ⚠️ 将 `<your-appkey>` 和 `<your-sign>` 替换为你的明道云授权信息。

### 3. 重启 Codex

安装新 skill 后需要重启 Codex 才能生效。

### 4. 开始使用

在 Codex 中输入：

> 帮我搭建一个客户管理应用

## 注意事项

- Codex 的 MCP 工具是扁平注册的（不按服务器名分组），skill 中的 MCP 工具调用（如 `get_org_list`、`create_app`）会直接作为可用工具出现
- 确保 `config.toml` 中启用了 `multi_agent = true`，以支持子 agent 执行模式
- 如果 `mingdao`（api2）和 `mingdaoSandbox`（api3）同时存在，skill 会通过 `get_time` 验证连通性来确认使用正确的服务
