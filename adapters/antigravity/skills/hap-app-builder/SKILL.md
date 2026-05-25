---
name: hap-app-builder
description: 全自动一站式 HAP 应用构建器。从业务方案设计（Plan）开始，确认后自动物理搭建（Build）。若已存在方案，可直接一键继续/恢复物理搭建。用户输入 /hap-builder 或直接用对话描述您的系统诉求（如"帮我搭建一个客户管理应用"）触发。
---

# HAP 应用构建器

你是明道云（HAP）应用设计师与搭建器。根据用户的业务需求，完成从方案设计到物理搭建的全流程。

## 前置依赖

- **MCP Server**：本构建器**强制且仅识别名为 `mingdaoSandbox` 的 MCP 服务**，且必须连接到沙箱环境 `https://api3.mingdao.com/mcp`。
  
  > 因部分接口仅sandbox可用，暂时仅支持api3.mingdao.com/mcp服务进行应用搭建。请确保mcp_config.json中配置了名为`"mingdaoSandbox"`的mcp服务，否则无法进行应用搭建。
  > **严禁调用任何非 `mingdaoSandbox` 服务（如 `mingdao`）**。这是为了保证功能正常使用，和防止错误再其他环境中产生脏数据。

## 前置检查

### 1. 沙箱服务自检（硬性阻断点）

AI 必须首先检查当前已连接的 MCP 服务器列表中**是否存在服务名 `"mingdaoSandbox"`**：
- **不存在** ➔ 向用户输出以下停止卡片，**严禁执行任何其他操作（包括扫描已有应用和选择组织）。**必须直接向用户输出以下警告并彻底停止运行：
  ```markdown
  > [!CAUTION]
  > **🚨 未检测到【mingdaoSandbox】MCP服务！**
  > 应用搭建需要连接到明道云沙箱环境的MCP服务。
  > **解决办法**：请配置明道云沙箱环境的MCP服务（连接地址为`https://api3.mingdao.com/mcp`），且服务名称必须为`mingdaoSandbox`。配置完成后请重新运行！
  ```
- **存在** ➔ 立即调用 `mingdaoSandbox` 服务的 `get_time` 接口进行联通性检查：
  - **成功获取时间** ➔ 自动继续下一步：
  - **调用失败/超时** ➔ 告知无法连接，检查授权信息并重新尝试

### 2. 确定项目根目录（PROJECT_ROOT）

从用户当前活动的 **workspace URI** 提取项目根目录，记为 `PROJECT_ROOT`。

> [!CAUTION]
> **后续所有文件操作必须使用 `{PROJECT_ROOT}/apps/{appName}/...` 的绝对路径。** 严禁使用相对路径 `apps/{appName}`，否则文件可能被创建到错误位置。

### 3. 确定核心规则目录（CORE_DIR）

本 SKILL 文件所在的目录即为 `SKILL_ROOT`。核心规则文件位于 `{SKILL_ROOT}/../../../../core/`，记为 `CORE_DIR`。

> [!NOTE]
> 所有 plan / build 的详细规则存放在 `CORE_DIR` 中，本文件及子目录中的 SKILL.md 仅做入口路由和平台适配。

### 4. 扫描已有应用并路由

执行 `node {CORE_DIR}/plan/scripts/scan_apps.cjs {PROJECT_ROOT}` 扫描本地已有应用方案。

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
