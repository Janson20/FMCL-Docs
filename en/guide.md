---
title: Guide
outline: deep
---

# Guide

This page describes FMCL's interface and usage following the actual workflow. For the feature list and edge cases, see [Features](/en/features);
for what configuration options mean, see [Configuration](/en/config).

## First Launch

1. FMCL shows a splash screen at startup, then checks the runtime environment (data directory, Java, graphics backend).
2. On the first run it asks for a language, then for the terms of use and the announcement; after you agree, the main window opens.
3. The left side of the main window is the top-level navigation, grouped as "Game / Resources and Multiplayer / Tools and Extensions"; domains unavailable on the current platform (such as installed Bedrock Edition on non-Windows) do not appear.
4. The right side of the top bar holds search, announcements, update checks and Settings; the bottom status bar shows task progress and operation results.

## Installing a Game Version

1. Open "Installed versions" in the left navigation and click "Install new version".
2. Enter a version ID (such as `1.20.4`), or switch to the "Release / Snapshot" tabs and click an entry to fill it in (20 per page).
3. Choose a mod loader: none, Forge, Fabric, NeoForge, Quilt, LiteLoader, LegacyFabric, Cleanroom or OptiFine.
   When a loader is selected, vanilla Minecraft installs in parallel and the compatibility of that loader with the game version is checked automatically.
4. Click "Install version"; the progress card shows overall progress, the current file, download speed and remaining items, and can be cancelled at any time.
5. When installation finishes, return to the version list and refresh to see the new instance.

> Once the loader is installed, version isolation is enabled for that instance, creating separate `mods/`, `config/`, `saves/` and similar directories.
> On networks in China it is recommended to keep the China mirror enabled in Settings; the mirror covers version manifests, game assets, libraries and loader installers.

## Launching the Game

1. Open "Game" in the left navigation and click "Launch game" on the "Recently used version" card, or select an instance under "Installed versions" and launch it.
2. Java is checked before launch: system Java is scanned and version-matched automatically by default; it can also be specified in Settings → Java.
3. While the game runs, the button becomes "Force quit game", which ends that process.
4. Once the game window appears, the launcher minimizes or not according to Settings, and closes the stdout pipe so the final loading stage is not slowed down.

A non-zero exit code, or a crash report / `hs_err` file written after this launch, opens the crash diagnostics window: view the exit code, the crash report, the game log and the
JVM crash log, export a diagnostics ZIP, upload the log to LogShare.CN, or sign in to a Jingdu account for AI analysis.

## Managing Installed Versions

- Version rows offer details, mods, resources, rename, delete and open directory.
- Renaming updates the folder name, the version JSON file name and the internal `id` together; existing resources are not lost.
- Deletion asks for confirmation first and clears the "recently used version" record.
- Verification checks instance file integrity with concurrent hashing and writes the result back to the page.

## Resource Management

After selecting an instance, open "Mods" or "Resource management" to manage four resource types:

| Type | Extensions | Install directory |
|------|------------|-------------------|
| Mods | `.jar` `.zip`, `.jar.disabled` when disabled | `mods/` |
| Resource packs | `.zip` | `resourcepacks/` |
| Worlds | `.zip` extracted automatically, or a folder | `saves/` |
| Shader packs | `.zip` | `shaderpacks/` |

- Installation: drag files onto the window, or click "Install from file".
- Mod cards read metadata from the jar (icon, name, author, modid, version); resource packs and shader packs extract preview images from the zip.
- Typed search, pagination, enable and disable, delete, open directory, and copying the mod list to the clipboard.
- "Check for updates" queries Modrinth and CurseForge at the same time, allows a batch update after selection, and keeps finished files for failed items.

> Vanilla instances show only resource packs and worlds; mods and shader packs appear once a mod loader is installed, consistent with the version isolation rules.

## Browsing Online Resources

Open "Browse resources" in the left navigation:

1. Popular content loads on entry; the type can be switched between mods, resource packs and shader packs.
2. Filter by keyword, game version and mod loader; the game version and loader are prefilled from the current instance.
3. Cards show name, author, download count and description; open the details to choose a specific version, preview dependencies and install into a chosen instance.
4. Installation resolves `required` dependencies recursively; a missing compatible version is skipped with a notice.
5. Without `CURSEFORGE_API_KEY` only Modrinth is queried; after signing in to a Jingdu account, AI search can expand the keywords.

## Installing a Modpack

Under "Installed versions" → "Install new version" → "Install modpack":

1. Choose a source: a local `.mrpack` / MultiMC / CurseForge / HMCL / MCBBS / generic archive, or click "Download from online browse".
2. The program parses metadata, optional components and the component list; optional files in `.mrpack` can be selected.
3. A custom instance name can be set (the modpack name by default; conflicting or invalid names disable the start button).
4. Click "Start installation" and wait for the parallel phase and the loader installation to finish.
5. The version list refreshes automatically when installation finishes; launch directly or open resource management.

> A custom instance name generates that instance's own version JSON, and the version list, launch and resource management all identify the instance by it;
> this is also why modpack instances with custom names are recognized correctly.

## Servers

### Installation and Launch

1. Open "Servers" in the left navigation and click "Install server".
2. Enter a version ID, or pick one from the release list (10 per page).
3. When installation finishes, click start in the server list; several servers can run at once.
4. The first start generates a basic `server.properties` and accepts the EULA; offline mode is used by default.
5. Each server can set its own maximum memory (1G to 16G), stored in `.fmcl_server.json` in that server's directory.

When a port is taken, the launcher moves on to a free port, writes it back to the configuration and reports the actual port in the list and on the detail page.

### Console

The console on the server detail page shows running state, online players and a memory sample every 2 seconds; logs scroll to the bottom automatically and keep at most 5000 lines.
The command box at the bottom sends on Enter or with the button, and can also clear the screen and export logs.

### Configuration Editor

Click a server row or the configuration button on the detail page to edit `server.properties` in 7 categories:

- Search by name, key (such as `motd`) or description; each entry shows its name, raw key and a one-line description.
- Numeric entries show their valid range and are highlighted in red with a dialog when out of range.
- Saving only updates the keys that changed and keeps comments and unknown keys; entries or whole categories can be restored to defaults.
- The "Raw file" category edits the text directly; the page guards against leaving with unsaved changes.

### Hosting from a Modpack

Next to "Install server" under "Servers" you can host a server from a modpack, which accepts `.mrpack` only. Installation detects the Forge / Fabric /
NeoForge / Quilt server loader automatically, installs Fabric API automatically when a Fabric server lacks it, and lists mods of unknown purpose after installation so each can be disabled.

## Terracotta Multiplayer

Windows only. On first entry it detects EasyTier and guides you through installing it (several mirrors are speed-tested, with automatic fallback).

Creating a lobby:

1. Enter the local Minecraft port (25565 by default) and a display name.
2. Click "Create lobby"; it is ready in about 5 seconds.
3. Send the generated Terracotta code (`U/` prefix, 21 characters) to your friends.

Joining a lobby:

1. Enter the code and a display name, then click "Join lobby".
2. Once connected, connect to `localhost` in Minecraft multiplayer.
3. The member list shows the host first, and the latency to the host is shown at the bottom in real time.

The "Scan" button discovers shared worlds on the same LAN; it only lists results and never joins automatically.

## World Save Backups

Open "Saves" in the left navigation:

1. The page scans the global `saves/` directory and each isolated instance directory automatically and rescans on refresh.
2. Select a save and click "Back up"; a note can be added and the compression progress is real.
3. The backup list shows time, size, game version and note, and supports restore, verify, export ZIP and delete.
4. ZIP integrity is verified before a restore; by default the current save is renamed to `_bak_<timestamp>` and kept.
5. The bottom of the page has toggles for "Back up before the game starts" and "Back up after the game exits"; toggles are written to the configuration immediately.

Settings can change the backup path, compression level (1 / 3 / 6 / 9), retention per save (5 / 10 / 20 / 30 / 50 / unlimited) and how the old save is handled on restore.

## Music

Open "Music" in the left navigation; the "Discover" home page shows daily recommendations, recommended playlists, charts and new music.

- **Local music**: choose a folder to recursively scan MP3 / FLAC / OGG / WAV / M4A / AAC, read tags and embedded cover art, and "play all".
- **Online search**: queries NetEase Cloud Music, QQ Music, Kuwo, Kugou and Migu at once, with Bilibili as a cross-source fallback; the highest available quality is chosen automatically.
- **Playlists**: all songs, liked music, recently played, user playlists and NetEase Cloud playlists; sorting and "play all" are supported.
- **Lyrics**: LRC, translations and romanization; desktop lyrics scroll in three lines and support locking, unlocked dragging and opacity adjustment.
- **Hotkeys**: `Ctrl+Shift+Space` play and pause, `Ctrl+Shift+Left/Right` previous and next, `Ctrl+Shift+Down` stop,
  `Ctrl+Shift+Up/PageDown` volume, `Ctrl+Shift+Alt+M` mute.

When playback fails it searches the same track across sources automatically and uses a duration check to filter out covers and instrumentals; on Windows system media control (SMTC) is also supported.

## Toolbox

Open "Tools" in the left navigation. Nine small tools: game junk cleanup, port check, hash calculation, coordinate conversion, today's luck, fun facts,
knowledge quiz, multithreaded download and related sites.

Performance monitor: press `Ctrl+Shift+M` or click the monitor button in the top bar to open the floating window, which shows CPU, memory and GPU data, can be dragged and remembers its position.

## Achievements and Daily Check-in

Open "Achievement overview" in the left navigation to see the overall progress of 47 achievements across 9 categories, with progress and stage on each card.
Unlocks show a notification in the bottom-right corner; the home page shows the consecutive daily check-in streak. After signing in to a Jingdu account, the "Cloud" category can sync saves.

## AGENT and Voice

Open "AGENT" in the left navigation:

1. The session list on the left can create, switch, rename and delete sessions; history is saved automatically.
2. Describe what you need in the input box, for example "install the Fabric version of 1.20.4 for me".
3. Tool calls show their arguments and results; high-risk commands, file modifications and questions all require confirmation, and file writes, edits and deletes preview a diff first.
4. The provider and model can be chosen at the top right; Settings → AI configures the API key, endpoint, thinking intensity and tool permissions.

Pressing Enter in the top quick input jumps to AGENT and sends the message. The voice button next to the input uses the offline SenseVoice model for voice input,
and the model downloads automatically on first use.

The command line works as well:

```bash
uv run python main.py --agent "install the latest version for me"
uv run python main.py -A
```

## Bedrock Edition

Windows 10 19041 or later only. Open "Installed Bedrock" in the left navigation:

1. Search the version catalog or filter by UWP / GDK, 20 entries per page.
2. The first installation requires accepting the MCAPPX terms; GDK checks for the .NET 10 SDK and provides download guidance.
3. Installation uses real progress and resume, and the version can be launched directly afterwards.
4. Installed cards support launch, delete, details and opening the version directory.

## Settings and Accounts

### Settings Sections

Open "Settings" in the left navigation; 9 sections in total: launcher, Java, theme, music account, logs, about, accounts, AI and plugins.
Edits first go into a draft and can preview themes and languages, and are written only when you save; leaving with unsaved changes prompts.

### Accounts

- **Microsoft**: PKCE OAuth by default, with device code sign-in as an alternative.
- **Offline**: a UUID is generated locally, no network needed.
- **Yggdrasil**: `authlib-injector` is injected automatically when connecting to third-party authentication servers such as skin sites.

Accounts can be added, deleted, switched and set as current, and encrypted `.fmcl_accounts` files can be imported and exported. The player name comes from the current account.

### Themes and Languages

The theme section offers 5 presets, importing a `.json` theme, a custom `#RRGGBB` accent color and a version-based dynamic theme.
Languages are Simplified Chinese, English, Traditional Chinese and Japanese, switched immediately.

## Plugins

Open the plugin manager from "Settings" → "Plugins":

1. "Install from file" selects a `.fmpl` plugin package, or browse the plugin marketplace and install with one click.
2. The list shows name, version, author and state, and plugins can be enabled, disabled, uninstalled and inspected for permissions.
3. Enabling and disabling both hot-reload without a restart; high-risk permissions prompt on every use.
4. Plugins that provide QML pages appear in the "Plugins" group at the bottom of the sidebar.

See the [plugin development guide](/en/plugin) for details.

## Updates

On Windows the launcher checks for updates at startup (this can be disabled in Settings). A new version shows its version number and changelog,
and Settings → About can check manually, download and launch the installer.

Linux and macOS have no automatic installation: on Linux use the one-click setup script or download the tarball again; on macOS update from source.
