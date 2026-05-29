# HAP App Builder

明道云（HAP）应用智能构建器。通过 AI Agent 与明道云 MCP 服务，从业务需求描述到完整应用搭建的全自动流程。

## 功能

- **方案设计（Plan）**：根据用户的业务需求描述，自动生成完整的应用方案（工作表、字段、视图、角色、工作流等）
- **物理搭建（Build）**：方案确认后，自动调用明道云 MCP 接口完成 11 个搭建步骤
- **过程留存**：搭建过程数据（`plan`、`context`等）会自动保存在当前工作目录下，作为后续步骤的参数依据，同时也支持中断后可从上次进度继续搭建
- **示例数据**：自动生成贴近真实场景的示例数据
- **subAgent模式**：当工具支持subAgent时，会从step4开始自动使用subAgent模式进行搭建，避免长对话造成的AI退化问题。

> **使用须知**：
> 1. 因部分接口只在sandbox环境有效，所以需要使用 api3.mingdao.com/mcp 服务，在沙盒中测试搭建。
> 2. 搭建过程需要多次调用工具和运行脚本，建议使用完全使用权限执行，以达到自动化效果。
> 3. codex的机制需要人工确认后才能调用subAgent, 所以执行到step4仍会自动暂停，需要手动确认后才能继续。

## 前置依赖

- 明道云沙盒 MCP 个人授权
- Python 3.9+（用于 `generate_fill_templates.py` 脚本）

## 安装

**在 AI 工具（Antigravity / Claude Code / Codex 等）的对话中输入**：

```text
安装技能 https://github.com/xuezongm/hap-app-builder ，同时配置好 MCP 服务
```

AI 会自动克隆仓库、安装技能并配置 MCP 服务。各平台的安装路径和 MCP 配置格式详见 [INSTALL.md](./INSTALL.md)。

> [!IMPORTANT]
> 安装必须同时完成 **Skill 安装** 和 **MCP 服务配置**，缺一不可。仅安装 skill 而未配置 MCP 服务，搭建将无法执行。

### Token 获取

安装过程中 AI 会向你索要 Token。获取方式：

1. 登录 [sandbox.mingdao.com](https://sandbox.mingdao.com)
2. 打开浏览器开发者工具（F12 → Network）
3. 刷新页面，点开任意请求，从 Request Headers 中复制 `md_pss_id` 的值
4. 将完整的 Token 粘贴给 AI 即可

### 验证

安装完成后，在对话中输入以下内容验证是否正常工作：

```text
使用 HAP App Builder 帮我设计并搭建一个图书借阅管理应用。
```


如果技能已正确加载，Agent 会自动读取 `SKILL.md` 并进入方案设计流程。

## 自动更新

每次启动时，技能会自动检测 GitHub 上是否有新版本。如果检测到更新，AI 会展示更新说明并询问是否立即更新——同意后自动完成，无需手动操作。

> 版本检查为异步请求（2 秒超时），网络不通时静默跳过，不影响正常使用。

## 目录结构

```
hap-app-builder/
├── plugin.json                        # 插件/技能元数据
├── .codex-plugin/plugin.json          # Codex 平台适配
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

## 搭建产物

搭建产物保存在**用户当前工作目录**的 `apps/` 文件夹下（不在插件目录内），按应用名称分目录存放：

```
{用户当前工作目录}/
└── apps/
    └── 图书借阅管理/
        ├── overview.md              # 方案总览（含应用链接）
        ├── hap-plan.json            # 完整的结构化方案
        ├── hap-context.json         # 搭建进度与运行时上下文
        └── worksheetContext.json    # 刷新后的字段结构快照
```

- `apps/` 目录在首次搭建时自动创建，无需手动建立
- 每个应用的产物相互独立，支持断点恢复——中断后重新启动会自动读取 `hap-context.json` 继续

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
    ├── Step 4：创建自定义动作 ─┬─ ⚡ Step 6：写入示例数据（并行）
    ├── Step 5：创建视图       ─┘
    ├── Step 7：创建自定义页面与 AI 助手
    ├── Step 8：创建角色与权限
    ├── Step 9：设计工作流
    ├── Step 10：创建并发布系统工作流       ─┐（并行）
    └── Step 11：创建并发布自定义动作工作流 ─┘
    ↓
✅ 搭建完成
```

## License

MIT
