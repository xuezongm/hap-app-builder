#!/usr/bin/env node
/**
 * scan_apps.cjs — 扫描 apps/ 目录，输出每个应用的名称和搭建状态。
 *
 * 用法：node scan_apps.cjs <projectRoot>
 * 示例：node scan_apps.cjs /Users/user/应用搭建测试
 * 输出：JSON 数组，每项包含 { dir, appName, progress, status }
 *   - status: "completed" | "in_progress" | "planned"
 */

const fs = require('fs');
const path = require('path');

// 优先从命令行参数获取项目根目录，否则 fallback 到 __dirname 向上 4 级
const projectRoot = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.resolve(__dirname, '..', '..', '..', '..');
const appsDir = path.join(projectRoot, 'apps');

if (!fs.existsSync(appsDir)) {
  console.log(JSON.stringify([]));
  process.exit(0);
}

const results = [];

for (const entry of fs.readdirSync(appsDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;

  const dirName = entry.name;
  const planPath = path.join(appsDir, dirName, 'hap-plan.json');

  if (!fs.existsSync(planPath)) continue; // 没有方案文件，跳过

  // 读取应用名
  let appName = dirName;
  try {
    const plan = JSON.parse(fs.readFileSync(planPath, 'utf-8'));
    if (plan.appName) appName = plan.appName;
  } catch (_) { /* 解析失败用目录名 */ }

  // 读取搭建进度
  const ctxPath = path.join(appsDir, dirName, 'hap-context.json');
  let progress = null;
  let status = 'planned'; // 默认：仅有方案

  if (fs.existsSync(ctxPath)) {
    try {
      const ctx = JSON.parse(fs.readFileSync(ctxPath, 'utf-8'));
      progress = ctx.progress || null;
      status = progress === 'completed' ? 'completed' : 'in_progress';
    } catch (_) { /* 解析失败视为 planned */ }
  }

  results.push({ dir: dirName, appName, progress, status });
}

console.log(JSON.stringify(results, null, 2));
