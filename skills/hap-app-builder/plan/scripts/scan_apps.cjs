#!/usr/bin/env node
/**
 * scan_apps.cjs — 扫描 apps/ 目录，输出每个应用的名称和搭建状态。
 *                 同时异步检查 GitHub 远程版本是否有更新（2 秒超时，失败静默跳过）。
 *
 * 用法：node scan_apps.cjs <projectRoot>
 * 示例：node scan_apps.cjs /Users/user/应用搭建测试
 * 输出：JSON 对象 { apps: [...], update?: { available, local, remote } }
 *   - apps[].status: "completed" | "in_progress" | "planned"
 *   - update: 仅当检测到新版本时出现
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// 优先从命令行参数获取项目根目录，否则 fallback 到 __dirname 向上 4 级
const projectRoot = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.resolve(__dirname, '..', '..', '..', '..');
const appsDir = path.join(projectRoot, 'apps');
const pluginPath = path.resolve(__dirname, '..', '..', '..', '..', 'plugin.json');

// --- 扫描已有应用 ---
const results = [];

if (fs.existsSync(appsDir)) {
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
}

// --- 异步版本检查（2 秒超时，失败静默跳过） ---
function checkUpdate() {
  let localVersion, repoUrl;
  try {
    const pkg = JSON.parse(fs.readFileSync(pluginPath, 'utf-8'));
    localVersion = pkg.version;
    repoUrl = pkg.repository;
  } catch {
    return Promise.resolve(null);
  }

  if (!localVersion || !repoUrl) return Promise.resolve(null);

  const match = repoUrl.match(/github\.com\/([^/]+\/[^/]+)/);
  if (!match) return Promise.resolve(null);

  const rawUrl = `https://raw.githubusercontent.com/${match[1]}/main/plugin.json`;

  return new Promise(resolve => {
    const req = https.get(rawUrl, { timeout: 2000 }, res => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        try {
          const remote = JSON.parse(data);
          if (remote.version && remote.version !== localVersion) {
            resolve({
              available: true,
              local: localVersion,
              remote: remote.version,
              notes: remote.releaseNotes || null
            });
          } else {
            resolve(null);
          }
        } catch { resolve(null); }
      });
    });
    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
  });
}

// --- 输出结果 ---
checkUpdate().then(update => {
  const output = { apps: results };
  if (update) output.update = update;
  console.log(JSON.stringify(output, null, 2));
});
