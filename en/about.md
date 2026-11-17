---
title: About
---

# About FMCL

FMCL (Fusion Minecraft Launcher) is a Minecraft launcher written in Python with a Qt Quick interface. It covers
version management, the mod ecosystem, server hosting, multiplayer, backups, music, achievements, an AI assistant and
a plugin system. The UI is drawn in QML, business logic lives in the service layer, and a command-line mode remains
in `main.py`.

## Project info

| Item | Detail |
|------|--------|
| Language | Python 3.10–3.11 |
| UI | Qt Quick (QML) + PySide6 6.7.3 + FluentUI |
| License | GPL-3.0 (MIT for v2.8.4 and earlier) |
| Platforms | Windows x64 / Linux x86_64; macOS from source only |
| Current version | 3.0.0 (2026-11-15) |

## Architecture at a glance

```
qml/            QML UI: shell, pages, components, overlays
app/bridges/    QML adapter layer: properties, signals, command entry points
app/            AppContext, TaskRunner, EventBus, startup controller
services/       Business services (no UI dependencies, enforced by static checks)
launcher/ · fusion_music/ · plugin_manager/ · top-level core modules
```

- QML never makes business decisions and never touches `config.json`, `.minecraft` or the network directly.
- `services/` does not import Qt or UI modules, keeping business logic independent from the interface.
- Long-running work runs on `TaskRunner` and returns to QML through the main-thread scheduler.

## 3.0.0 milestones

- The interface moved fully to Qt Quick / QML: new window, navigation, page stack, breadcrumbs and `fmcl://` deep links.
- All 12 feature domains share one page skeleton with ready / loading / empty / error states.
- New plugin manager, plugin marketplace and the QML page extension protocol `ui_api: 2`.
- Windows ships an x64 NSIS installer; Linux ships an x86_64 directory tarball.
- The CustomTkinter interface and the `ui_backend` switch were removed; only the QML interface remains.

See the [changelog](/en/changelog) for the full notes.

## Links

<div class="about-links">
  <a class="about-link-card" href="https://github.com/Janson20/FMCL" target="_blank">
    <span class="link-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/></svg></span>
    <span class="link-text">GitHub Repository</span>
  </a>

  <a class="about-link-card" href="https://github.com/Janson20/FMCL/releases" target="_blank">
    <span class="link-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg></span>
    <span class="link-text">Releases</span>
  </a>

  <a class="about-link-card" href="https://github.com/Janson20/FMCL/issues" target="_blank">
    <span class="link-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></svg></span>
    <span class="link-text">Issue Tracker</span>
  </a>

  <a class="about-link-card" href="https://github.com/Janson20/FMCL/discussions" target="_blank">
    <span class="link-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.9 9.9 0 0 1-3.8-.7L3 21l1.8-5.1A8.3 8.3 0 0 1 4 11.5 8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5z"/></svg></span>
    <span class="link-text">Discussions</span>
  </a>
</div>

## Contributing

1. **File an issue**: report bugs or suggest features.
2. **Open a pull request**: fork the repository and send improvements.
3. **Join the discussion**: share ideas and experience in Discussions.
4. **Docs and translations**: help improve the documentation and the four UI languages.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Janson20/FMCL&type=Date)](https://star-history.com/#Janson20/FMCL&Date)

## License

FMCL uses GNU General Public License v3.0 since after v2.8.4; versions up to v2.8.4 were MIT licensed.

```
GNU GENERAL PUBLIC LICENSE
Version 3, 29 June 2007

Copyright (C) 2007 Free Software Foundation, Inc.
Everyone is permitted to copy and distribute verbatim copies
of this license document, but changing it is not allowed.
```
