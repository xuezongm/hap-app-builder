# HAP App Builder

明道云（HAP）应用智能构建器。通过 AI Agent 与明道云 MCP 服务，从业务需求描述到完整应用搭建的全自动流程。

## 功能

- **方案设计（Plan）**：根据用户的业务需求描述，自动生成完整的应用方案（工作表、字段、视图、角色、工作流等）
- **物理搭建（Build）**：方案确认后，自动调用明道云 MCP 接口完成 11 个搭建步骤
- **断点恢复**：搭建过程中断后可从上次进度继续
- **示例数据**：自动生成贴近真实场景的示例数据

## 前置依赖

- 明道云账号 MCP 授权 Token
- Python 3.9+（用于 `generate_fill_templates.py` 脚本）

## 安装

### 1. 获取 MCP 授权 Token

登录sandbox.migndao.com，打开F12，从任意接口请求的 Response headers 中复制完整 md_pss_id ，并设置为环境变量：

```bash
export MINGDAO_AUTH="your-token-here"
```

建议将此行添加到 `~/.zshrc` 或 `~/.bashrc` 中持久化。

---

### 2. 安装插件

#### Antigravity

将本仓库克隆到本地，Antigravity 会自动识别根目录的 `plugin.json` 和 `.mcp.json`：

```bash
git clone https://github.com/xuezongm/hap-app-builder.git
```

在 Antigravity 中打开项目目录即可使用。

#### Claude Code

```text
/install-plugin https://github.com/xuezongm/hap-app-builder
```

或手动克隆后使用 `--plugin-dir` 加载：

```bash
git clone https://github.com/xuezongm/hap-app-builder.git
claude --plugin-dir ./hap-app-builder
```

#### Codex

**方式 A：Skill 安装（稳定）**

将 skill 复制到 Codex 技能目录：

```bash
git clone https://github.com/xuezongm/hap-app-builder.git
cp -r hap-app-builder/skills/hap-app-builder ~/.codex/skills/hap-app-builder
```

同时将 `.mcp.json` 中的 MCP 服务配置到 Codex 的 MCP 设置中。

**方式 B：插件 / 市场安装**

如果你维护了自己的 Codex marketplace，将插件目录放入 marketplace 的 `plugins/` 下，并在 `marketplace.json` 中添加条目：

```json
{
  "name": "hap-app-builder",
  "source": {
    "source": "local",
    "path": "./plugins/hap-app-builder"
  },
  "policy": {
    "installation": "AVAILABLE",
    "authentication": "ON_INSTALL"
  },
  "category": "Productivity"
}
```

然后在 Codex TUI 中运行 `/plugins`，选择并安装 **hap-app-builder**。

---

### 3. 验证安装

安装完成后，在对话中输入以下内容验证插件是否正常工作：

```text
使用 HAP App Builder 帮我设计并搭建一个图书借阅管理应用。
```

如果插件已正确加载，Agent 会自动读取 `SKILL.md` 并进入方案设计流程。

> **⚠️ MCP 授权安全提示**
>
> `.mcp.json` 通过 `${MINGDAO_AUTH}` 环境变量引用 Token，**不要将明文 Token 提交到仓库**。
> 确保 `MINGDAO_AUTH` 已在本地 shell 环境中正确配置。

## 目录结构

```
hap-app-builder/
├── plugin.json                        # Antigravity 插件描述
├── .claude-plugin/plugin.json         # Claude Code 插件描述
├── .codex-plugin/plugin.json          # Codex 插件描述
├── .mcp.json                          # MCP 服务配置（沙箱）
├── assets/                            # 图标资源
│   ├── app-icon.png                   # 应用图标
│   └── hap-app-builder-small.svg      # Composer 小图标
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
