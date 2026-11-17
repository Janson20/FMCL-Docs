---
title: 下载
---

# 下载 FMCL

<DownloadSection lang="zh" />

## 安装说明

### Windows x64

双击 `.exe` 安装包，按向导完成安装。安装包已内置 7-Zip，无需联网即可完成解压与安装；
完整版还内置 .NET 10 SDK，精简版体积更小，首次使用 GDK 基岩版时会引导另行安装 SDK。

- 安装位置为 `%LOCALAPPDATA%\Programs\FMCL`，**全程无需管理员权限**。
- 产物是一个目录（`FMCL.exe` 与 `_internal/`），卸载只删除程序文件，保留 `config.json`、`.minecraft`、账号、歌单与成就等用户数据。
- 安装包未做代码签名，SmartScreen 可能提示「Windows 已保护你的电脑」，点「更多信息」→「仍要运行」即可。

### Linux x86_64

方式一：下载目录产物 tarball 并解压运行。

```bash
tar -xzf FMCL-3.0.0-linux-x86_64.tar.gz
cd FMCL && ./FMCL
```

方式二：一键安装脚本，从源码构建或直接安装指定 tarball，并注册 `fmcl` 命令。

```bash
curl -fsSL https://raw.githubusercontent.com/Janson20/FMCL/main/scripts/install.sh | bash

# 或使用已下载的 tarball
bash scripts/install.sh /opt/fmcl --tarball ./FMCL-3.0.0-linux-x86_64.tar.gz
```

脚本支持 Debian / Ubuntu / Fedora / RHEL / CentOS / Arch / openSUSE。运行时需要 Qt 6 运行库与
XCB 相关包（Debian/Ubuntu：`sudo apt install libegl1 libgl1 libxkbcommon-x11-0 libxcb-cursor0`）。
配置文件位于 `~/.config/fmcl/config.json`，日志位于 `~/.local/share/fmcl/fmcl.log`。

方式三：AppImage 与 DEB 暂不随 3.0.0 提供，需要时请使用上面的 tarball 或安装脚本。

### macOS

暂不提供 `.dmg` 或二进制包，请参考下方「从源码运行」。macOS 上需要自行准备 Qt 6.7.3 与构建依赖。

### 从源码运行

依赖统一由 [uv](https://docs.astral.sh/uv/) 管理（`pyproject.toml` + `uv.lock`），
不要用 `pip` 直接装进 `.venv`，否则锁文件与实际环境会漂移。

```bash
git clone https://github.com/Janson20/FMCL.git
cd FMCL

# 创建 .venv 并安装锁定版本的全部依赖（含 Qt 界面依赖）
uv sync

# 运行启动器
uv run python main.py
```

Python 版本范围为 3.10 至 3.11。Windows 上也可以直接用虚拟环境里的解释器：
`.\venv\Scripts\python.exe main.py`。

## 校验下载文件

Linux 附件同时提供 `SHA256SUMS`，下载后可校验：

```bash
sha256sum -c SHA256SUMS
```

Windows 可用 PowerShell：

```powershell
Get-FileHash .\FMCL-Setup-3.0.0.exe -Algorithm SHA256
```

## 旧版本与 32 位系统

3.0.0 起只提供 64 位 Windows 产物（PySide6 6.7.3 没有 win32 轮子）。32 位系统请继续使用
**2.12.6** 安装包，两者数据目录相同，可以直接沿用原有配置与存档。

如需回滚：卸载 3.0.0 后安装 2.12.6，安装目录一致，卸载不会删除用户数据。

历史版本可在 [GitHub Releases](https://github.com/Janson20/FMCL/releases) 中查看。
