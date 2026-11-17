---
title: 常见问题
outline: deep
---

# 常见问题

按问题类型整理常见故障与处理方式。提交 Issue 前请先查看 `latest.log` 与[使用指南](/guide)，
仍未解决可在 [GitHub Issues](https://github.com/Janson20/FMCL/issues) 反馈。

## 安装与启动

### 启动器打不开或没有界面

1. 先看 `latest.log` 末尾是否有 QML 加载错误或 Qt 平台插件错误。
2. Windows 检查杀毒软件是否隔离了 `FMCL.exe` 或 `_internal/` 下的 DLL。
3. Linux 确认已安装 XCB / OpenGL 运行库与图形会话；Wayland 会话可临时用 `QT_QPA_PLATFORM=xcb` 排除平台插件问题。
4. 无显示环境可用 `QT_QPA_PLATFORM=offscreen` 做启动检查，但这不会显示窗口。
5. 仍无法启动时用 `QT_DEBUG_PLUGINS=1` 运行，查看缺失的 Qt 插件。

### Windows 提示「Windows 已保护你的电脑」

3.0.0 的安装包未做代码签名，SmartScreen 会给出提示。点「更多信息」→「仍要运行」即可，
并请确认安装包来自本仓库的 Release 页面。

### Linux 提示权限不足

```bash
# 目录产物：给入口文件执行权限
chmod +x FMCL/FMCL

# 安装目录无写权限时，改装到用户目录
bash scripts/install.sh ~/.local/share/fmcl
```

不要用 `sudo` 启动图形界面：配置、日志与游戏数据会写入 root 所有的目录，之后普通用户无法读写。

### macOS 提示无法验证开发者

```bash
xattr -cr /Applications/FMCL.app
```

或在「系统设置 → 隐私与安全性」中点「仍要打开」。macOS 目前只支持从源码运行。

## 游戏与版本

### 游戏启动失败或闪退

1. 检查 Java 版本：`java -version`，Minecraft 1.17 及以上需要 Java 17+。
2. 确认 `.minecraft` 目录可写、磁盘空间充足。
3. 查看 `latest.log` 与启动器弹出的崩溃诊断，必要时导出诊断 ZIP。
4. 提示找不到主类 `@C:\...` 时是 Java 8 不支持参数文件，启动器会自动回退；仍失败请升级 Java 版本。

### 下载速度慢

1. 在「设置」中确认已启用国内镜像，并适当调大下载线程数。
2. 切换网络或代理后重试；部分资源站点的速度不受镜像影响。
3. 在日志中确认具体失败的 URL，排除 DNS 或证书问题。

### 模组没有生效

- 确认实例已安装加载器：原版实例不显示模组与光影入口，也不会加载 `mods/`。
- 确认模组与游戏版本、加载器类型匹配；从「资源浏览」安装时筛选条件会按实例自动填好。
- 检查模组是否被禁用（文件名以 `.disabled` 结尾）。

### 服务器端口不是 25565

端口被占用时启动器会自动顺延到空闲端口并回写 `server.properties`，列表与详情页会标明实际端口。
如果客户端需要连接，请使用提示中的端口，而不是默认的 25565。

## 陶瓦联机

### EasyTier 无法启动

1. 确认可以访问 STUN / TURN 服务器，EasyTier 需要它们完成打洞。
2. 检查系统防火墙没有阻止 EasyTier 进程。
3. 关闭 VPN 或代理软件，它们可能干扰 P2P 连接。
4. 在联机页的日志面板查看具体错误。

### 无法加入好友大厅

1. 核对陶瓦编号（注意 `U/` 前缀与大小写）。
2. 确认好友的大厅仍在运行：主机离线时大厅会销毁。
3. 对称 NAT 环境可能无法直连，EasyTier 会自动尝试中继，延迟会明显升高。
4. 尝试关闭防火墙或添加例外规则。

### 联机延迟高

EasyTier 默认启用 `--latency-first`，会自动选择较优路径。可查看成员列表底部的延迟判断与主机的网络质量，
尽量避免在移动热点等不稳定网络下联机。

## 音乐

### 在线搜索没有结果

1. 换个音源再试（各平台接口可能临时调整）。
2. 换关键词，或使用更短的歌名。
3. 平台接口异常时，结果可能只来自部分音源。

### 点了播放没声音

1. 播放失败会自动跨源重试；仍然失败时先检查网络能否访问对应 CDN。
2. 查看底部状态栏的提示，确认是版权原因还是链接失效。
3. B 站音源触发风控时会弹出验证窗口，按提示完成滑块即可。

### 桌面歌词不显示

1. 确认当前曲目带有歌词元数据。
2. 检查桌面的歌词窗口是否被拖到屏幕外，或透明度调得过低。
3. 在音乐页重新点击「桌面歌词」开关。

## AGENT 与语音

### 无法连接 AI 服务

1. 确认已在「设置 → AI」中配置提供商与 API Key，或登录净读账号。
2. 使用自定义端点时检查端点地址与 Key 是否正确。
3. 查看 `latest.log` 中的 API 调用错误详情。

### 工具执行失败

1. 确认该工具所需的权限已授予（首次使用会弹窗确认）。
2. 文件写、改、删需要在确认弹窗中查看 diff 后点确认。
3. 查看待办面板中的状态提示，确认没有前置任务失败。

### 模型返回空内容

1. 切换其他模型或提供商再试。
2. 检查账号额度与余额。
3. 净读账号请在净读平台确认账号状态。

### 语音按钮不可用

语音输入依赖 SenseVoice 模型，模型未下载完成前按钮不可用。可在「设置 → AI」中查看下载进度，
或导入本地模型 ZIP。

## 插件

### 插件安装失败

1. 确认文件是有效的 `.fmpl`（本质是 ZIP，含 `plugin.json` 与入口模块）。
2. 检查 `min_fmcl_version` 是否与当前版本兼容。
3. 确认没有同 ID 的插件已安装。
4. 查看 `latest.log` 中的详细错误。

### 插件启用后报错

1. 在「设置 → 插件」中先禁用该插件。
2. 检查插件权限是否被拒绝（`core.process`、`network.socket` 等高风险权限）。
3. 查看日志中的 Python 异常堆栈，并联系插件作者。

### 插件没有出现在导航里

只有声明 `ui_api: 2` 并提供 QML 页面的插件才能登记到导航。`ui_api: 1` 的旧界面协议在 QML 界面下
界面部分不会加载，但非 UI 钩子照常工作。详见[插件开发](/plugin#界面扩展-ui-api-v2)。

## 开发与构建

### 导入错误 / 依赖冲突

```bash
# 以锁文件为准重建虚拟环境
uv sync --reinstall

# 检查锁文件与 pyproject.toml 是否一致
uv lock --check
```

不要用 `pip install` 直接改写项目虚拟环境，否则 `uv.lock` 与实际环境会漂移。

### Linux 构建缺少依赖

```bash
# Debian / Ubuntu
sudo apt-get install -y git curl python3 python3-venv build-essential cmake ninja-build \
    pkg-config libgl1-mesa-dev libegl1 libxkbcommon-dev libxkbcommon-x11-0 \
    libxcb-cursor0 libxcb-xinerama0 libxcb-icccm4 libxcb-image0 libxcb-keysyms1 \
    libxcb-randr0 libxcb-render-util0 libxcb-shape0 libxcb-xfixes0 \
    libfontconfig1 libdbus-1-3 libportaudio2 libcups2-dev

# Fedora / RHEL
sudo dnf install -y git curl python3 python3-devel gcc-c++ cmake ninja-build pkgconf \
    mesa-libGL-devel libxkbcommon-devel xcb-util-cursor xcb-util-wm xcb-util-image \
    xcb-util-keysyms xcb-util-renderutil fontconfig dbus-libs portaudio cups-devel
```

### 提交被 commitlint 拒绝

使用约定式提交：

```bash
git commit -m "feat: 添加新功能"
git commit -m "fix: 修复错误"
git commit -m "docs: 更新文档"
```

### Git hooks 不生效

```bash
npm install
npm run prepare
```

## 获取帮助

仍未解决时，提交 Issue 请附上：

- 操作系统与版本、FMCL 版本
- 复现步骤
- `latest.log` 与相关日志片段
- 崩溃诊断导出的 ZIP（如果适用）

也可以在 [GitHub Discussions](https://github.com/Janson20/FMCL/discussions) 讨论。
