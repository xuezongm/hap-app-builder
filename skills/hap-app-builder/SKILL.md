---
name: hap-app-builder
description: 全自动一站式 HAP 应用构建器。从业务方案设计（Plan）开始，确认后自动物理搭建（Build）。若已存在方案，可直接一键继续/恢复物理搭建。用户输入 /hap-builder 或直接用对话描述您的系统诉求（如"帮我搭建一个客户管理应用"）触发。
---

# HAP 应用构建器

你是明道云（HAP）应用设计师与搭建器。根据用户的业务需求，完成从方案设计到物理搭建的全流程。

## 前置依赖

- **MCP Server**：本构建器需要连接到明道云**沙箱环境** `https://api3.mingdao.com/mcp` 的 MCP 服务。
  
  > 因部分接口仅沙箱可用，暂时仅支持 `api3.mingdao.com/mcp` 进行应用搭建。
  > **严禁调用连接到其他环境（如 `api2.mingdao.com`）的 MCP 服务**，以防止脏数据。
  >
  > **各 IDE 配置方式**：
  > - **Antigravity**：在 MCP 配置中添加名为 `mingdaoSandbox` 的服务
  > - **Codex**：在 `~/.codex/config.toml` 中添加 `[mcp_servers.mingdaoSandbox]`
  > - **Claude Code**：运行 `claude mcp add mingdaoSandbox https://api3.mingdao.com/mcp`

## 前置检查

### 1. 沙箱服务自检（硬性阻断点）

AI 必须首先尝试调用明道云 MCP 工具 `get_time` 来验证沙箱连通性：

- **调用成功（返回时间）** ➔ 自动继续下一步
- **调用失败 / 工具不存在 / 超时** ➔ 向用户输出以下停止卡片，**严禁执行任何其他操作**：
  ```markdown
  🚨 **未检测到明道云沙箱 MCP 服务！**
  应用搭建需要连接到明道云沙箱环境的 MCP 服务。
  **解决办法**：请配置连接到 `https://api3.mingdao.com/mcp` 的 MCP 服务（建议服务名称为 `mingdaoSandbox`），配置完成后重新运行。
  ```

> **MCP 工具调用方式**（各 IDE 不同）：
> - **Antigravity**：通过 `call_mcp_tool`（指定 ServerName: mingdaoSandbox）调用
> - **Codex**：MCP 工具被扁平注册，直接调用 `get_time` 等工具名即可
> - **Claude Code**：通过 `use_mcp_tool`（server_name: mingdaoSandbox）调用
>
> **读取文件方式**（各 IDE 不同）：
> - **Antigravity**：使用 `view_file` 工具
> - **Codex**：使用 `exec_command` 读取文件内容，例如 `sed -n '1,260p' <file>`
> - **Claude Code**：使用 `read_file` 工具

### 2. 确定项目根目录（PROJECT_ROOT）

从用户当前活动的 **workspace URI** 提取项目根目录，记为 `PROJECT_ROOT`。

> [!CAUTION]
> **后续所有文件操作必须使用 `{PROJECT_ROOT}/apps/{appName}/...` 的绝对路径。** 严禁使用相对路径 `apps/{appName}`，否则文件可能被创建到错误位置。

### 3. 扫描已有应用并路由

找到本 SKILL.md 所在目录，执行其中的扫描脚本：

```bash
node {SKILL_DIR}/plan/scripts/scan_apps.cjs {PROJECT_ROOT}
```

> `{SKILL_DIR}` 是本 SKILL.md 文件所在的目录路径。各 IDE 请自行解析。

根据扫描结果，进入以下路径：

---

#### 路径 A：发现未完成的匹配应用

**触发条件**：扫描发现与用户请求名称匹配的应用，且状态为 `in_progress` 或 `planned`。

> [!CAUTION]
> **⛔ STOP — 必须先询问用户，严禁自动继续搭建。**
> 向用户展示已有应用的名称和当前进度，然后询问：
> 1. **继续搭建** → 读取 `build/SKILL.md` 从断点恢复（不用选择组织，org_id 已经保存在hap-plan.json中）
> 2. **新建独立应用** → 进入下方「选择组织」流程

---

#### 其他情况：一律按新建处理

以下情况**不询问用户，直接进入「选择组织」流程**：
- 扫描无匹配应用
- 匹配的应用已完成（`completed`）

---

### 选择组织

1. 调用 `get_org_list` 获取用户的组织列表
2. 若只有一个组织 → 自动选择并告知用户
3. 若有多个 → 列出所有组织让用户选择

> [!CAUTION]
> **⛔ STOP — 等待用户确认组织后再继续。** 严禁在同一轮回复中同时输出组织选择和方案设计。

4. 用户确认后，记录 `org_id`，读取 `plan/SKILL.md` 从方案设计开始

