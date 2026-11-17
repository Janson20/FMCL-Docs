---
title: Plugin Development
outline: deep
---

# Plugin Development

FMCL plugins are distributed as `.fmpl` archives that contain a `plugin.json` manifest and Python modules. A plugin
can register hooks, export APIs, provide its own configuration and data directories, and ship QML pages that are
registered in the primary navigation.

## Quick start

### 1. Create a plugin project

```
my-plugin/
├── plugin.json         # plugin manifest (required)
├── __init__.py         # entry module (required, must export a PluginBase subclass)
├── icon.png            # plugin icon (optional, 128x128 PNG recommended)
├── ui/                 # QML pages (optional, ui_api: 2)
└── ...                 # other module files
```

### 2. Write plugin.json

```json
{
  "id": "com.example.my-plugin",
  "name": "My Plugin",
  "version": "1.0.0",
  "author": "Your Name",
  "min_fmcl_version": "3.0.0",
  "description": {
    "zh_CN": "这是一个示例插件",
    "en_US": "An example plugin"
  },
  "permissions": ["ui.notification", "data.store"],
  "dependencies": {},
  "tags": ["utility"],
  "entry": "__init__"
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | Globally unique identifier in reverse-domain format |
| `name` | Yes | Display name, up to 64 characters |
| `version` | Yes | SemVer version, such as `1.0.0` |
| `author` | Yes | Author name |
| `min_fmcl_version` | Yes | Minimum compatible FMCL version |
| `max_fmcl_version` | No | Maximum compatible FMCL version; omit it for no upper bound |
| `description` | No | Localized description dictionary |
| `permissions` | No | List of requested permissions |
| `dependencies` | No | Dependent plugins and their version constraints |
| `conflicts` | No | Conflicting plugins and their version constraints |
| `tags` | No | List of tags |
| `entry` | No | Entry module name, `__init__` by default |
| `ui_api` | No | UI extension protocol version: `1` (legacy UI protocol, non-UI hooks only) or `2` (QML pages) |

### 3. Write the plugin class

```python
# __init__.py
from plugin_manager.base import PluginBase, HookPoint


class MyPlugin(PluginBase):

    def get_default_config(self) -> dict:
        return {"enabled_feature": True}

    def on_load(self) -> None:
        """Called after the module has been loaded"""
        self.log("Plugin module loaded")

    def on_enable(self) -> None:
        """Called when the plugin is enabled; register hooks and create UI here"""
        self.log("Plugin enabled")

        self._manager.register_hook(
            self.manifest.id,
            HookPoint.GAME_POST_LAUNCH,
            self._on_game_launched,
            priority=100,
        )

        self.notify("Plugin ready", "My plugin has started", "info")

    def on_disable(self) -> None:
        """Called when the plugin is disabled; release resources here"""
        self.log("Plugin disabled")

    def _on_game_launched(self, **kwargs):
        version_id = kwargs.get("version_id", "unknown")
        pid = kwargs.get("pid", 0)
        self.log(f"Game launched: {version_id} (PID: {pid})")
        self.notify("Game launched", f"Version: {version_id}", "info")
```

### 4. Package as .fmpl

Compress the project directory into a `.zip`, then rename it to `.fmpl`:

```bash
# Windows PowerShell
Compress-Archive -Path my-plugin/* -DestinationPath my-plugin.fmpl

# Linux / macOS
cd my-plugin && zip -r ../my-plugin.fmpl .
```

### 5. Install and test

1. Open Settings → Plugins → Plugin manager.
2. Click "Install from file" and select the `.fmpl` file.
3. Grant the permissions in the confirmation dialog; the plugin is enabled automatically.

## Plugin lifecycle

```
SCANNED → LOADING → LOADED → ENABLED → (DISABLED | ERROR)
```

| Stage | Description |
|-------|-------------|
| SCANNED | The plugin directory has been discovered and `plugin.json` has been read |
| LOADING | The Python module is being loaded through importlib |
| LOADED | The module has been imported, the instance created, and `on_load()` called |
| ENABLED | `on_enable()` has run successfully; the plugin is running normally |
| DISABLED | Disabled by the user; `on_disable()` has been called |
| ERROR | An error occurred at runtime; other plugins and the launcher are unaffected |

## UI extensions (UI API v2)

FMCL currently provides a QML interface only. For a plugin to appear in navigation, it must provide a QML component
and use `ui_api: 2`. Plugins that declare the legacy `ui_api: 1` protocol can still be installed and enabled, but
their UI part is not loaded and the manager marks them as "UI not supported"; non-UI hooks (game launch, downloads,
notifications and so on) are unaffected.

### 1. Declare ui_api

```json
{
  "id": "com.example.my-plugin",
  "name": "My Plugin",
  "version": "2.0.0",
  "author": "Your Name",
  "min_fmcl_version": "3.0.0",
  "ui_api": 2,
  "permissions": ["ui.extend", "data.store"]
}
```

`ui_api` defaults to `1`; only plugins with `ui_api >= 2` have their pages collected by the QML interface.

### 2. Register pages

Register the `UI_PAGE_REGISTER` hook in `on_enable()` and return a page dictionary or a list of them:

```python
from plugin_manager.base import HookPoint, PluginBase


class MyPlugin(PluginBase):

    def on_enable(self) -> None:
        self._manager.register_hook(
            self.manifest.id,
            HookPoint.UI_PAGE_REGISTER,
            self._register_pages,
        )
        self._manager.export_api(self.manifest.id, "get_stats", self._get_stats)

    def on_disable(self) -> None:
        pass

    def _register_pages(self, **kwargs):
        return [
            {
                "id": "main",                      # the route id becomes plugin/<plugin id>/main
                "title": "My Plugin",                # name shown as-is
                "icon": "plugin",                   # optional, must be an icon name the launcher already has
                "order": 100,                       # optional, ordering between plugin pages
                "qml_url": "ui/Main.qml",           # relative to the plugin directory, or an absolute path
            }
        ]

    def _get_stats(self, **kwargs):
        return {"count": 42}
```

| Field | Description |
|-------|-------------|
| `id` | Required, `[A-Za-z0-9_.-]`, up to 64 characters; the route is `plugin/<plugin id>/<id>` |
| `title` | Required (falls back to the plugin name when empty); shown as-is, without going through language files |
| `qml_url` | Required, must end with `.qml`, and must resolve inside the plugin installation directory |
| `icon` | Optional; only accepts icon names that already exist in `qml/assets/icons` |
| `order` | Optional integer; that part of the plugin pages is stably sorted by it |

Pages appear as top-level navigation entries in the "Plugins" group at the bottom of the sidebar; disabling or
uninstalling a plugin removes its routes as well.

### 3. Fetching data from a page

Plugin pages are ordinary QML components and share the same context properties as the built-in pages: `Theme`,
`Tr`, `Nav`, `Shell`, `Dialogs`, `Plugins`. Data from the Python side goes through an exported API:

```qml
import QtQuick
import QtQuick.Layouts

Item {
    Column {
        Text { id: label; text: "..." }

        Component.onCompleted: {
            var data = Plugins.call("com.example.my-plugin", "get_stats", {})
            label.text = "count = " + (data ? data.count : "?")
        }
    }
}
```

- `Plugins.call(owner, api, args)`: `args` is a dict (keyword arguments) or a list (positional arguments), and can be
  omitted when there are none.
- Calls run on the **main thread**, so plugin APIs must not do long-running work (move downloads and compression to
  your own thread).
- Exceptions become a status bar error and return `null`.

### 4. Pushing from the plugin to a page

When a page needs to refresh because background data changed, the plugin calls `emit_ui_event`:

```python
self.emit_ui_event("stats_changed", {"count": 43})
```

On the QML side, listen for it:

```qml
Connections {
    target: Plugins
    function onPageEvent(owner, name, payload) {
        if (owner === "com.example.my-plugin" && name === "stats_changed")
            refresh()
    }
}
```

> Security boundary: QML pages are trusted as much as the plugin's Python code (both can execute arbitrary code);
> the launcher does not sandbox anything.
> Permission dialogs govern the APIs the launcher provides, not Python isolation itself, so only install plugins from
> sources you trust.

## Permissions

| Permission | Risk | Description |
|------------|------|-------------|
| `filesystem.read` | Low | Read files (excluding the launcher's core directories) |
| `filesystem.write` | Medium | Write files (only `.minecraft` and the plugin data directory) |
| `network.http` | Low | HTTP(S) requests (through the launcher UA proxy) |
| `network.socket` | High | Raw socket connections |
| `ui.extend` | Low | Register tabs, sidebars and settings panels |
| `ui.notification` | Low | Dialogs and notifications |
| `core.download` | Medium | Register custom download sources |
| `core.version` | Medium | Register custom version sources |
| `core.launch_hook` | High | Hooks before and after the game starts |
| `core.process` | High | Execute external processes |
| `data.store` | Low | Persistent storage (plugin data directory) |
| `data.settings` | Medium | Read and modify launcher settings |

## Hook points

| Hook | Strategy | Arguments | Description |
|------|----------|-----------|-------------|
| `app.startup` | ALL | — | Launcher initialization is complete |
| `app.shutdown` | ALL | — | Before the launcher closes |
| `game.pre_launch` | COLLECT | version_id, command | Before the game starts (the launch command can be modified) |
| `game.post_launch` | ALL | version_id, pid | After the game starts |
| `game.stopped` | ALL | exit_code | The game process has stopped |
| `game.crashed` | COLLECT | crash_report | After the game crashes |
| `version.pre_install` | FIRST | version_id, mod_loader | Before a game version is installed |
| `version.post_install` | ALL | version_id, success | After a game version is installed |
| `version.pre_remove` | FIRST | version_id | Before a game version is removed |
| `server.pre_start` | FIRST | server_name | Before a server starts |
| `server.post_start` | ALL | server_name, process | After a server starts |
| `server.stopped` | ALL | server_name, exit_code | The server has stopped |
| `ui.tab.register` | COLLECT | — | Register main window tabs (legacy UI protocol) |
| `ui.sidebar.register` | COLLECT | — | Register sidebar entries (legacy UI protocol) |
| `ui.settings.register` | COLLECT | — | Register settings entries |
| `ui.page.register` | COLLECT | — | Register QML pages (`ui_api: 2`) |
| `download.pre_download` | COLLECT | — | Before a file download (the URL can be modified) |
| `download.post_download` | ALL | — | After a file download completes |

| Strategy | Meaning |
|----------|---------|
| ALL | Call every handler in priority order and ignore return values |
| COLLECT | Call each in order and collect all return values into a list |
| FIRST | Call each in order and return the first non-None value (can be used to block an operation) |
| SHORT_CIRCUIT | Call each in order and stop when one returns True |

## Plugin configuration

Every plugin has its own configuration space, persisted automatically to `plugins/configs/{plugin_id}.json`:

```python
class MyPlugin(PluginBase):

    def get_default_config(self) -> dict:
        return {"api_key": "", "interval": 60}

    def on_enable(self) -> None:
        api_key = self.config.get("api_key", "")
        self.log(f"API Key: {api_key[:4]}...")

        self.config["interval"] = 120
        self._manager.save_plugin_config(self.manifest.id)
```

## Plugin data directory

Every plugin has its own persistent data directory, `plugins/data/{plugin_id}/`:

```python
class MyPlugin(PluginBase):

    def on_enable(self) -> None:
        # self.data_dir automatically points to plugins/data/{plugin_id}/
        db_path = self.data_dir / "cache.db"
        self.log(f"Data directory: {self.data_dir}")
```

## Inter-plugin communication

Plugins can export APIs for other plugins to use and declare `exports` in `plugin.json`:

```json
{
  "id": "com.example.plugin-a",
  "exports": ["get_version"]
}
```

```python
class PluginA(PluginBase):
    def on_enable(self) -> None:
        self._manager.export_api(self.manifest.id, "get_version", self._get_version)

    def _get_version(self):
        return "1.0.0"


class PluginB(PluginBase):
    def on_enable(self) -> None:
        get_version = self._manager.get_plugin_api("com.example.plugin-a", "get_version")
        if get_version:
            self.log(f"Plugin A version: {get_version()}")
```

Version constraints, circular dependency detection and topological sorting are applied between plugins; a failed
update rolls back to the previous version automatically.

## Best practices

1. **Least privilege**: request only the permissions the plugin actually needs.
2. **Exception handling**: an exception in `on_enable()` moves the plugin into the ERROR state, so handle errors
   thoroughly.
3. **Resource cleanup**: release every resource (threads, file handles, network connections) in `on_disable()`.
4. **Logging**: use `self.log()` instead of `print()` so troubleshooting stays consistent.
5. **Version constraints**: use SemVer and write ranges such as `>=1.0,<2.0` in dependencies.
6. **UI thread safety**: interface operations all happen on the main thread; run long-running work on the plugin's
   own thread and call `emit_ui_event` when it finishes so the page refreshes.
