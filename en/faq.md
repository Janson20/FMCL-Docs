---
title: FAQ
outline: deep
---

# FAQ

Common problems and how to handle them, grouped by topic. Before filing an issue, check `latest.log` and the
[guide](/en/guide); if that still does not solve it, report it on
[GitHub Issues](https://github.com/Janson20/FMCL/issues).

## Installation and startup

### The launcher does not open or shows no window

1. First check the end of `latest.log` for QML loading errors or Qt platform plugin errors.
2. On Windows, check whether antivirus software quarantined `FMCL.exe` or DLLs under `_internal/`.
3. On Linux, confirm that the XCB / OpenGL runtime libraries and a graphical session are available; for a Wayland session, try `QT_QPA_PLATFORM=xcb` temporarily to rule out platform plugin problems.
4. On a display-less environment, use `QT_QPA_PLATFORM=offscreen` for a startup check, though no window will appear.
5. If it still will not start, run it with `QT_DEBUG_PLUGINS=1` to see which Qt plugins are missing.

### Windows says "Windows protected your PC"

The 3.0.0 installer is not code-signed, so SmartScreen shows a warning. Click "More info" → "Run anyway", and
confirm that the installer came from the Releases page of this repository.

### Linux reports insufficient permissions

```bash
# Directory build: make the entry file executable
chmod +x FMCL/FMCL

# If the install directory is not writable, install to your user directory instead
bash scripts/install.sh ~/.local/share/fmcl
```

Do not start a graphical interface with `sudo`: configuration, logs and game data end up in root-owned directories,
and your normal user cannot read or write them afterwards.

### macOS says the developer cannot be verified

```bash
xattr -cr /Applications/FMCL.app
```

Alternatively, click "Open Anyway" under System Settings → Privacy & Security. macOS currently supports running from
source only.

## Game and versions

### The game fails to start or crashes right after launch

1. Check the Java version: `java -version`. Minecraft 1.17 and later requires Java 17+.
2. Confirm that the `.minecraft` directory is writable and that there is enough disk space.
3. Check `latest.log` and the crash diagnostics the launcher shows; export the diagnostics ZIP if necessary.
4. If you see a missing main class error such as `@C:\...`, Java 8 does not support argument files; the launcher falls back automatically. If it still fails, upgrade Java.

### Downloads are slow

1. In Settings, confirm that the China mirror is enabled, and raise the download thread count if appropriate.
2. Retry after switching networks or proxies; some resource sites are not sped up by the mirror.
3. Find the exact failing URL in the log to rule out DNS or certificate problems.

### Mods do not take effect

- Confirm that the instance has a mod loader: a vanilla instance shows no mod or shader pack entries and does not load `mods/`.
- Confirm that the mod matches the game version and mod loader type; when installing from the resource browser, the filters are prefilled from the instance.
- Check whether the mod is disabled (file names ending in `.disabled`).

### The server port is not 25565

When the port is already in use, the launcher automatically moves on to a free port and writes it back to
`server.properties`; the list and the details page show the actual port. If a client needs to connect, use the port
from the prompt rather than the default 25565.

## Terracotta multiplayer

### EasyTier will not start

1. Confirm that the STUN / TURN servers are reachable; EasyTier needs them to complete hole punching.
2. Check that the system firewall is not blocking the EasyTier process.
3. Turn off VPN or proxy software, which can interfere with P2P connections.
4. Check the log panel on the multiplayer page for the specific error.

### Cannot join a friend's lobby

1. Double-check the Terracotta ID (mind the `U/` prefix and letter case).
2. Confirm that your friend's lobby is still running: the lobby is destroyed when the host goes offline.
3. Symmetric NAT may not allow a direct connection; EasyTier automatically tries a relay, and latency rises noticeably.
4. Try disabling the firewall or adding an exception rule.

### Multiplayer latency is high

EasyTier enables `--latency-first` by default and picks a better path automatically. Check the latency reading at the
bottom of the member list and the host's network quality, and avoid playing over unstable networks such as a mobile
hotspot.

## Music

### Online search returns no results

1. Try another source (each platform's API may change at any time).
2. Try different keywords, or a shorter song title.
3. When a platform API is misbehaving, results may come from some sources only.

### Nothing plays after pressing play

1. A failed playback automatically retries across sources; if it still fails, first check whether the network can reach the corresponding CDN.
2. Check the hint in the bottom status bar to see whether it is a copyright reason or a dead link.
3. When the Bilibili source triggers risk control, a verification window appears; follow the prompt and complete the slider.

### Desktop lyrics do not appear

1. Confirm that the current track has lyrics metadata.
2. Check whether the lyrics window was dragged off screen, or whether its opacity is set too low.
3. Toggle "Desktop lyrics" again on the music page.

## AGENT and voice

### Cannot connect to the AI service

1. Confirm that a provider and API key are configured in Settings → AI, or sign in with a Jingdu account.
2. When using a custom endpoint, check that the endpoint URL and key are correct.
3. Check the API call error details in `latest.log`.

### Tool execution fails

1. Confirm that the permissions the tool needs have been granted (a dialog appears on first use).
2. File writes, edits and deletions require you to review the diff in the confirmation dialog and then confirm.
3. Check the status hints in the to-do panel to confirm that no prerequisite task failed.

### The model returns empty content

1. Switch to another model or provider and try again.
2. Check the account quota and balance.
3. For a Jingdu account, check the account status on the Jingdu platform.

### The voice button is unavailable

Voice input relies on the SenseVoice model, and the button stays unavailable until the model has finished downloading.
Check the download progress in Settings → AI, or import a local model ZIP.

## Plugins

### Plugin installation fails

1. Confirm that the file is a valid `.fmpl` (essentially a ZIP containing `plugin.json` and the entry module).
2. Check whether `min_fmcl_version` is compatible with the current version.
3. Confirm that no plugin with the same ID is already installed.
4. Check `latest.log` for the detailed error.

### A plugin reports errors after being enabled

1. Disable the plugin first in Settings → Plugins.
2. Check whether a plugin permission was denied (`core.process`, `network.socket` and other high-risk permissions).
3. Check the Python exception stack in the log and contact the plugin author.

### A plugin does not appear in navigation

Only plugins that declare `ui_api: 2` and provide QML pages can register in navigation. With the QML interface, the
UI part of plugins on the legacy `ui_api: 1` protocol is not loaded, but non-UI hooks keep working. See
[Plugin Development](/en/plugin#ui-extensions-ui-api-v2).

## Development and building

### Import errors / dependency conflicts

```bash
# Rebuild the virtual environment from the lock file
uv sync --reinstall

# Check that the lock file matches pyproject.toml
uv lock --check
```

Do not use `pip install` to modify the project virtual environment directly, or `uv.lock` will drift away from the
actual environment.

### The Linux build is missing dependencies

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

### A commit is rejected by commitlint

Use conventional commits:

```bash
git commit -m "feat: add a new feature"
git commit -m "fix: fix a bug"
git commit -m "docs: update documentation"
```

### Git hooks do not work

```bash
npm install
npm run prepare
```

## Getting help

If the problem is still unresolved, include the following in your issue:

- operating system and version, FMCL version
- reproduction steps
- `latest.log` and the relevant log excerpts
- the ZIP exported by crash diagnostics (if applicable)

You can also discuss it on [GitHub Discussions](https://github.com/Janson20/FMCL/discussions).
