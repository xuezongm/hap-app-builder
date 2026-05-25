# HAP App Builder

明道云（HAP）应用智能构建器。通过 AI Agent 与明道云 MCP 服务，从业务需求描述到完整应用搭建的全自动流程。

## 功能

- **方案设计（Plan）**：根据用户的业务需求描述，自动生成完整的应用方案（工作表、字段、视图、角色、工作流等）
- **物理搭建（Build）**：方案确认后，自动调用明道云 MCP 接口完成 11 个搭建步骤
- **断点恢复**：搭建过程中断后可从上次进度继续
- **示例数据**：自动生成贴近真实场景的示例数据

## 安装与使用

`skills/hap-app-builder/` 是自包含的 Skill，各 IDE 的安装方式不同：

| IDE | 状态 | 安装方式 |
|-----|------|---------|
| Antigravity | ✅ 可用 | 直接 clone 到插件目录 |
| Claude Code | 📋 适配层开发中 | clone 仓库 → 配置 skill 引用 + MCP |
| OpenAI Codex | 📋 适配层开发中 | clone 仓库 → 注册 Agent Skill + MCP |
| Cursor | 📋 适配层开发中 | clone 仓库 → 配置 MCP |

---

### Antigravity IDE ✅

```bash
git clone https://github.com/xuezongm/hap-app-builder.git \
  ~/.gemini/config/plugins/hap-app-builder-plugin
```

配置 MCP：添加名为 `mingdaoSandbox` 的服务，连接 `https://api3.mingdao.com/mcp`。

使用：在对话中输入「帮我搭建一个客户管理应用」。

---

### Claude Code 📋

> 适配层开发中，以下为预计步骤。

```bash
# 1. clone 仓库
git clone https://github.com/xuezongm/hap-app-builder.git ~/hap-app-builder

# 2. 配置 MCP（项目级）
cd your-project
claude mcp add mingdaoSandbox https://api3.mingdao.com/mcp

# 3. 将 skill 引用到项目（适配层完成后）
# 参考 adapters/claude-code/README.md
```

---

### OpenAI Codex 📋

> 适配层开发中，以下为预计步骤。

```bash
# 1. clone 仓库
git clone https://github.com/xuezongm/hap-app-builder.git ~/hap-app-builder

# 2. 配置 MCP（在 .codex/config.toml 或用户级配置中添加）
# [mcp_servers.mingdaoSandbox]
# url = "https://api3.mingdao.com/mcp"

# 3. 注册 Agent Skill（适配层完成后）
# 参考 adapters/codex/README.md
```

---

### Cursor 📋

> 适配层开发中，以下为预计步骤。

```bash
# 1. clone 仓库
git clone https://github.com/xuezongm/hap-app-builder.git ~/hap-app-builder

# 2. 配置 MCP
# 在 Cursor Settings → MCP 中添加 mingdaoSandbox 服务

# 3. 引用 skill 文件（适配层完成后）
# 参考 adapters/cursor/README.md
```

> **所有 IDE 共用前提**：需要明道云账号及 MCP 授权 Token，MCP 服务名称必须为 `mingdaoSandbox`。

## 前置依赖

- 明道云账号及 MCP 授权 Token
- MCP 服务名称必须为 `mingdaoSandbox`，连接地址为 `https://api3.mingdao.com/mcp`
- Python 3.9+（用于 `generate_fill_templates.py` 脚本）

## 目录结构

```
hap-app-builder/
├── plugin.json                        # Antigravity 插件描述
├── skills/
│   └── hap-app-builder/               # 自包含 Skill（Antigravity 直接加载）
│       ├── SKILL.md                   # 根入口
│       ├── plan/                      # 方案设计
│       │   ├── SKILL.md
│       │   ├── design_guide.md
│       │   ├── 1a_plan_overview.md
│       │   ├── 1b_plan_schema.md
│       │   ├── icon_and_style_guide.md
│       │   └── scripts/scan_apps.cjs
│       └── build/                     # 物理搭建
│           ├── SKILL.md
│           ├── CONTEXT.md
│           ├── PROGRESS.md
│           ├── OUTPUT_CONTRACT.md
│           ├── resources/sample_images.json
│           ├── scripts/generate_fill_templates.py
│           └── steps/                 # 11 个搭建步骤
│
├── adapters/                          # 其他 IDE 适配层（计划中）
│   ├── claude-code/
│   ├── codex/
│   └── cursor/
│
├── README.md
├── LICENSE
└── .gitignore
```

## 搭建流程

```
用户描述需求
    ↓
方案设计（Plan）
    ├── Step 1a：生成方案总览 → 用户确认
    └── Step 1b：生成结构化 JSON
    ↓
物理搭建（Build）
    ├── Step 1：创建应用与导航分组
    ├── Step 2：创建工作表与字段
    ├── Step 3：刷新字段结构
    ├── Step 4：创建自定义动作
    ├── Step 5：创建视图
    ├── Step 6：写入示例数据
    ├── Step 7：创建自定义页面与 AI 助手
    ├── Step 8：创建角色与权限
    ├── Step 9：设计工作流
    ├── Step 10：创建并发布系统工作流
    └── Step 11：创建并发布自定义动作工作流
    ↓
✅ 搭建完成
```

## License

MIT
