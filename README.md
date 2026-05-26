# HAP App Builder

明道云（HAP）应用智能构建器。通过 AI Agent 与明道云 MCP 服务，从业务需求描述到完整应用搭建的全自动流程。

## 功能

- **方案设计（Plan）**：根据用户的业务需求描述，自动生成完整的应用方案（工作表、字段、视图、角色、工作流等）
- **物理搭建（Build）**：方案确认后，自动调用明道云 MCP 接口完成 11 个搭建步骤
- **断点恢复**：搭建过程中断后可从上次进度继续
- **示例数据**：自动生成贴近真实场景的示例数据

## 安装

### Antigravity

将本仓库克隆（或符号链接）到插件目录：

```bash
git clone https://github.com/xuezongm/hap-app-builder.git ~/.gemini/config/plugins/hap-app-builder
```

Antigravity 会自动发现 `plugin.json` 和 `skills/hap-app-builder/SKILL.md`。重启后即可使用。

### Claude Code

将本仓库克隆到项目根目录的 `/.claude` 文件夹：

```bash
git clone https://github.com/xuezongm/hap-app-builder.git .claude/hap-app-builder
```

`.mcp.json` 会自动注册 MCP 服务。详见 [Claude Skills 文档](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/skills)。

### Codex CLI

将 `skills/` 目录复制到 Codex skills 路径（通常为 `~/.codex/skills`）：

```bash
cp -r skills/hap-app-builder ~/.codex/skills/hap-app-builder
```

或使用 skill-installer：

```bash
python3 ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --repo xuezongm/hap-app-builder --path skills/hap-app-builder
```

### 通用

任何支持 [Agent Skills 规范](https://agentskills.io/specification) 的工具都可以直接使用 `skills/hap-app-builder/` 目录。

## 前置依赖

- 明道云账号及 MCP 授权 Token
- MCP 服务连接到沙箱环境 `https://api3.mingdao.com/mcp`（建议服务名称为 `mingdaoSandbox`）
- Python 3.9+（用于 `generate_fill_templates.py` 脚本）

## 目录结构

```
hap-app-builder/
├── plugin.json                        # Antigravity 插件描述
├── .claude-plugin/plugin.json         # Claude Code 插件描述
├── .codex-plugin/plugin.json          # Codex 插件描述
├── .mcp.json                          # MCP 服务配置（沙箱）
├── skills/                            # Skill 容器
│   └── hap-app-builder/               # HAP 应用构建 Skill
│       ├── SKILL.md                   # 入口
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
