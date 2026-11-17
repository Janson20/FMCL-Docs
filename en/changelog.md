---
title: Changelog
---

# Changelog

<ReleaseHistory lang="en" />

## 3.0.0 (2026-11-15)

3.0.0 is a major release for both the interface and the packaging pipeline. The launcher is now fully implemented on
Qt Quick / QML, and the existing version management, resources and modpacks, servers, multiplayer, backups, music,
AGENT, voice, achievements, plugins and Bedrock Edition features were carried over into the new interface structure.

### A brand-new Qt Quick interface

- Windows, navigation, pages, dialogs and overlays were rebuilt with QML and FluentUI.
- Primary navigation is grouped into Game / Resources & Multiplayer / Tools & Extensions, with breadcrumbs, a page
  stack and `fmcl://` deep links.
- All 12 feature domains share one page skeleton with `ready / loading / empty / error` states; switching pages,
  themes or languages no longer rebuilds the whole window.
- The five themes, custom accent colour, version-driven theme and runtime language switching all remain available.
- The splash screen, terms and announcement flow and the main window fallback are managed by the startup controller.

### Versions, resources and servers

- Vanilla plus eight mod loaders, with detection for nine loaders, renaming, verification and deletion.
- Modrinth and CurseForge browsing, dependency installation, detail pages and batch updates.
- Six client modpack sources, plus `.mrpack` server hosting.
- Server installation, startup, console, per-server memory, automatic port conflict handling, a visual
  `server.properties` editor and server-side mod and resource pack management.
- EasyTier Terracotta multiplayer, plus manual and automatic world backups with verification, restore and export.
- Bedrock Edition UWP / GDK download, install and launch, Windows 10 19041 or later only.

### Music, AGENT and plugins

- The music page was rebuilt: discovery home, five online sources with Bilibili fallback, playlists, lyrics,
  desktop lyrics, play queue and global hotkeys.
- Windows SMTC media control, media keys and progress sync.
- AGENT supports multiple providers, 33 tools, three permission levels, Skills, streaming output and tool confirmation.
- SenseVoice offline voice input, with model download and local ZIP import.
- New plugin manager, plugin marketplace and the QML page extension protocol `ui_api: 2`.
- Plugin pages can register into primary navigation, fetch data with `Plugins.call` and push refreshes with
  `emit_ui_event`.

### Packaging and installation

- Windows ships an x64 NSIS installer that installs per user and needs no administrator rights.
- Linux ships an x86_64 directory tarball, installable from source or tarball via `scripts/install.sh`.
- The installer now includes the FluentUI QML plugin DLL, fixing the "QML root object could not be created" error
  after installation.
- Windows build log encoding, Linux Qt plugin lookup, artifact manifests and CUPS dependencies were fixed.

### Upgrade notes

- You can install 3.0.0 directly; the install directory and user data paths are unchanged, and uninstalling never
  deletes user data recursively.
- Back up `config.json`, `accounts.json`, `.minecraft` and the music data directory before upgrading.
- To roll back, uninstall 3.0.0 and install 2.12.6.
- 32-bit Windows is no longer published for 3.0.0; keep using 2.12.6 there.
- The CustomTkinter interface and the `ui_backend` switch were removed. Only the QML interface remains; the command
  line mode is still available in `main.py`.
- Plugins declaring `ui_api: 1` no longer load their UI pages, while non-UI hooks keep working. QML pages must use
  `ui_api: 2` and `ui.page.register`.
- The standalone `FMCL-Agent.exe` is no longer bundled; use `python main.py -A` or
  `python main.py --agent "instruction"` instead.

### Known limitations

- No `.dmg` or binary build for macOS yet; running from source is supported.
- Linux builds are x86_64 only; there is no ARM64 binary yet.
- Global hotkeys may not work for non-root Linux users; other features are unaffected.
- Online music and resource search depend on third-party APIs, so a source may be temporarily unavailable.
- GDK Bedrock Edition may require the .NET 10 SDK on first use; the lite installer does not bundle it.
