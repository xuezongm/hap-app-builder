# HAP App Builder

明道云（HAP）应用智能构建器。通过 AI Agent 与明道云 MCP 服务，从业务需求描述到完整应用搭建的全自动流程。

## 功能

- **方案设计（Plan）**：根据用户的业务需求描述，自动生成完整的应用方案（工作表、字段、视图、角色、工作流等）
- **物理搭建（Build）**：方案确认后，自动调用明道云 MCP 接口完成 11 个搭建步骤
- **断点恢复**：搭建过程中断后可从上次进度继续
- **示例数据**：自动生成贴近真实场景的示例数据

## 跨 IDE 支持

本项目采用 `core/` + `adapters/` 分层架构：

- `core/`：平台无关的业务规则（Plan 规范、Build 步骤、状态定义、输出契约）
- `adapters/`：各 IDE 的运行适配层

| IDE | 状态 |
|-----|------|
| Antigravity | ✅ 可用 |
| Claude Code | 📋 计划中 |
| OpenAI Codex | 📋 计划中 |

## 快速开始（Antigravity IDE）

详见 [adapters/antigravity/INSTALL.md](adapters/antigravity/INSTALL.md)

```bash
# 1. 克隆仓库
git clone https://github.com/<your-username>/hap-app-builder.git ~/hap-app-builder

# 2. 创建插件软链
ln -s ~/hap-app-builder/adapters/antigravity \
  ~/.gemini/config/plugins/hap-app-builder-plugin

# 3. 配置 mingdaoSandbox MCP 服务（连接 https://api3.mingdao.com/mcp）

# 4. 在 Antigravity IDE 中输入「帮我搭建一个客户管理应用」
```

## 前置依赖

- 明道云账号及 MCP 授权 Token
- MCP 服务名称必须为 `mingdaoSandbox`，连接地址为 `https://api3.mingdao.com/mcp`
- Python 3.9+（用于 `generate_fill_templates.py` 脚本）

## 目录结构

```
hap-app-builder/
├── core/                              # 平台无关核心规则
│   ├── plan/                          # 方案设计规范
│   │   ├── design_guide.md            # 平台设计指南
│   │   ├── 1a_plan_overview.md        # 方案总览生成规范
│   │   ├── 1b_plan_schema.md          # 方案 JSON 结构规范
│   │   ├── icon_and_style_guide.md    # 视觉主题与图标规范
│   │   └── scripts/
│   │       └── scan_apps.cjs          # 应用扫描脚本
│   │
│   └── build/                         # 搭建步骤与状态定义
│       ├── CONTEXT.md                 # hap-context.json 结构定义
│       ├── PROGRESS.md                # 进度状态机定义
│       ├── OUTPUT_CONTRACT.md         # 步骤输出契约
│       ├── resources/
│       │   └── sample_images.json     # 示例数据图片资源
│       ├── scripts/
│       │   └── generate_fill_templates.py
│       └── steps/                     # 11 个搭建步骤
│           ├── 1_create_app.md
│           ├── 2_create_worksheets.md
│           ├── ...
│           └── workflow_rules.md
│
├── adapters/
│   ├── antigravity/                   # Antigravity IDE 适配层
│   │   ├── plugin.json
│   │   ├── INSTALL.md
│   │   └── skills/
│   │       └── hap-app-builder/
│   │           ├── SKILL.md           # 根入口
│   │           ├── plan/SKILL.md      # Plan 入口
│   │           └── build/SKILL.md     # Build 入口
│   │
│   ├── claude-code/                   # Claude Code 适配（计划中）
│   └── codex/                         # OpenAI Codex 适配（计划中）
│
├── README.md
├── LICENSE
└── .gitignore
```

## 搭建流程概览

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
