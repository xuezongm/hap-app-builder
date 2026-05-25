# Antigravity IDE 适配层

> ✅ 已实现。Antigravity 的适配层就是仓库根目录。

仓库根目录直接作为 Antigravity 插件目录使用：

```
hap-app-builder/          ← 仓库根 = 插件根
├── plugin.json           ← Antigravity 插件描述
└── skills/
    └── hap-app-builder/  ← 自包含 Skill
        ├── SKILL.md
        ├── plan/
        └── build/
```

## 安装

```bash
git clone https://github.com/xuezongm/hap-app-builder.git ~/.gemini/config/plugins/hap-app-builder-plugin
```

## MCP 配置

需要配置名为 `mingdaoSandbox` 的 MCP 服务，连接地址为 `https://api3.mingdao.com/mcp`。
