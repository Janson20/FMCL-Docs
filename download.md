---
title: 下载
layout: doc
---

# 📥 下载 FMCL

<DownloadSection lang="zh" />

## 安装说明

<h3><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:6px"><rect x="2" y="3" width="9" height="9"/><rect x="13" y="3" width="9" height="9"/><rect x="2" y="14" width="9" height="9"/><rect x="13" y="14" width="9" height="9"/></svg>Windows</h3>
双击 `.exe` 安装包，按向导完成安装。安装包已内置 7-Zip，无需联网即可自动安装。

<h3><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style="vertical-align:middle;margin-right:6px"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>macOS</h3>
双击 `.dmg` 文件，将 FMCL.app 拖入 Applications 文件夹。

首次打开若提示无法验证开发者，请在系统设置 > 安全性与隐私中点击"仍要打开"，或运行：

```bash
xattr -cr /Applications/FMCL.app
```

<h3><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style="vertical-align:middle;margin-right:6px"><ellipse cx="12" cy="9" rx="5" ry="6"/><circle cx="9.5" cy="8" r="1"/><circle cx="14.5" cy="8" r="1"/><ellipse cx="12" cy="11" rx="2" ry="1"/><path d="M8 16c0 3 2 5 4 5s4-2 4-5"/><path d="M8 16c-2 0-3 2-2 3"/><path d="M16 16c2 0 3 2 2 3"/></svg>Linux (DEB)</h3>

```bash
sudo dpkg -i FMCL-x.x.x-linux-amd64.deb
```

<h3><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style="vertical-align:middle;margin-right:6px"><ellipse cx="12" cy="9" rx="5" ry="6"/><circle cx="9.5" cy="8" r="1"/><circle cx="14.5" cy="8" r="1"/><ellipse cx="12" cy="11" rx="2" ry="1"/><path d="M8 16c0 3 2 5 4 5s4-2 4-5"/><path d="M8 16c-2 0-3 2-2 3"/><path d="M16 16c2 0 3 2 2 3"/></svg>Linux (AppImage)</h3>

```bash
chmod +x FMCL-x.x.x-x86_64.AppImage
./FMCL-x.x.x-x86_64.AppImage
```

<h3><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:6px"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>从源码运行</h3>

```bash
git clone https://github.com/Janson20/FMCL.git
cd FMCL
pip install -r requirements-windows.txt
python main.py
```
