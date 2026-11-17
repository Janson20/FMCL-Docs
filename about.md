---
title: 关于
---

# 关于 FMCL

FMCL（Fusion Minecraft Launcher）是一个用 Python 与 Qt Quick 编写的 Minecraft 启动器，覆盖版本管理、模组生态、
开服、联机、备份、音乐、成就、AI 助手与插件扩展。界面由 QML 自绘，业务逻辑集中在服务层，命令行模式保留在 `main.py`。

## 项目信息

| 项目 | 信息 |
|------|------|
| 开发语言 | Python 3.10–3.11 |
| 界面 | Qt Quick（QML）+ PySide6 6.7.3 + FluentUI |
| 许可证 | GPL-3.0（v2.8.4 及以前为 MIT） |
| 支持平台 | Windows x64 / Linux x86_64；macOS 仅源码运行 |
| 当前版本 | 3.0.0（2026-11-15） |

## 架构一览

```
qml/            QML 界面：壳层、页面、组件、浮层
app/bridges/    QML 适配层：属性、信号、命令入口
app/            AppContext、TaskRunner、EventBus、启动控制器
services/       业务服务（零界面依赖，由静态检查固化）
launcher/ · fusion_music/ · plugin_manager/ · 根级核心模块
```

- QML 不直接做业务判断，也不直接读写 `config.json`、`.minecraft` 或网络。
- `services/` 不导入 Qt 与界面模块，业务逻辑与界面解耦。
- 长任务走 `TaskRunner`，结果通过主线程调度器回到 QML。

## 3.0.0 里程碑

- 界面完整迁移到 Qt Quick / QML：新窗口、导航、页面栈、面包屑与 `fmcl://` 深链。
- 12 个功能域统一页面骨架与三种状态（ready / loading / empty / error）。
- 新增插件管理器、插件市场与 QML 页面扩展协议 `ui_api: 2`。
- Windows 提供 x64 NSIS 安装包，Linux 提供 x86_64 目录产物 tarball。
- CustomTkinter 界面与 `ui_backend` 开关移除，只保留 QML 界面。

完整记录见[更新日志](/changelog)。

## 链接

<div class="about-links">
  <a class="about-link-card" href="https://github.com/Janson20/FMCL" target="_blank">
    <span class="link-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/></svg></span>
    <span class="link-text">GitHub 仓库</span>
  </a>

  <a class="about-link-card" href="https://github.com/Janson20/FMCL/releases" target="_blank">
    <span class="link-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg></span>
    <span class="link-text">Release 下载</span>
  </a>

  <a class="about-link-card" href="https://github.com/Janson20/FMCL/issues" target="_blank">
    <span class="link-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></svg></span>
    <span class="link-text">问题反馈</span>
  </a>

  <a class="about-link-card" href="https://github.com/Janson20/FMCL/discussions" target="_blank">
    <span class="link-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.9 9.9 0 0 1-3.8-.7L3 21l1.8-5.1A8.3 8.3 0 0 1 4 11.5 8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5z"/></svg></span>
    <span class="link-text">社区讨论</span>
  </a>
</div>

## 贡献

1. **提交 Issue**：报告 Bug 或提出新功能建议。
2. **Pull Request**：Fork 仓库并提交代码改进。
3. **社区讨论**：在 Discussions 中分享想法与使用经验。
4. **文档与翻译**：帮助改进文档和四语言文案。

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Janson20/FMCL&type=Date)](https://star-history.com/#Janson20/FMCL&Date)

## 许可证

FMCL 自 v2.8.4 之后使用 GNU General Public License v3.0 发布；v2.8.4 及以前版本为 MIT License。

```
GNU GENERAL PUBLIC LICENSE
Version 3, 29 June 2007

Copyright (C) 2007 Free Software Foundation, Inc.
Everyone is permitted to copy and distribute verbatim copies
of this license document, but changing it is not allowed.
```
