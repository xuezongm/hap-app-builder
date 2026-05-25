# Antigravity IDE 安装指南

## 前置条件

- [Antigravity IDE](https://antigravity.google) 已安装
- 明道云账号，且已获取 MCP 授权 Token

## 安装步骤

### 1. 克隆仓库

```bash
git clone https://github.com/<your-username>/hap-app-builder.git ~/hap-app-builder
```

### 2. 创建插件软链

```bash
ln -s ~/hap-app-builder/adapters/antigravity \
  ~/.gemini/config/plugins/hap-app-builder-plugin
```

### 3. 配置 MCP 服务

在 Antigravity IDE 的 MCP 配置中添加名为 `mingdaoSandbox` 的服务，连接地址为：

```
https://api3.mingdao.com/mcp
```

> ⚠️ 服务名称**必须**为 `mingdaoSandbox`，否则 Skill 无法识别。

### 4. 验证安装

重启 Antigravity IDE，在对话中输入「帮我搭建一个客户管理应用」。如果 Skill 被正确识别，AI 会自动进入 HAP 应用搭建流程。

## 卸载

```bash
# 删除插件软链
rm ~/.gemini/config/plugins/hap-app-builder-plugin

# 可选：删除仓库
rm -rf ~/hap-app-builder
```
