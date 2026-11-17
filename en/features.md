---
title: Features
outline: deep
---

# Features

FMCL organizes its functionality into 12 top-level domains. This page lists what each domain actually provides, along with interaction details and limitations; the interface described here follows the current QML version.
For installation and building, see the [Download page](/en/download); for step-by-step instructions, see the [Guide](/en/guide).

## Versions and Launch

### Version detection and management

- The installed version list offers search, sorting (name / vanilla version / mod loader) and a total count.
- Each row has details, mods, resources, rename and delete; details show the instance path, required Java and mod count.
- Version metadata is read directly from `versions/<instance>/<instance>.json` rather than guessed from the folder name.
- The version number is extracted by a multi-level strategy: `clientVersion` → `patches` → `--fml.mcVersion` → `inheritsFrom` → download and library metadata, including HMCL `patches` merging and `inheritsFrom` inheritance chains.
- Mod loader detection covers 9 loaders: Forge, NeoForge, Fabric, Quilt, LegacyFabric, Cleanroom, OptiFine, LiteLoader and LabyMod.
- Renaming an instance updates the folder name, the JSON file name and the internal `id` together; deletion asks for confirmation first and clears the "recently used version" record.
- File verification hashes files concurrently, and the instance directory can be opened.

### Installation and mod loaders

- The installation wizard has its own page: enter a version ID manually, or pick one on the "Release / Snapshot" tabs to fill it in, 20 entries per page with pagination.
- One-click installation for 8 mod loaders: Forge, Fabric, NeoForge, Quilt, LiteLoader, LegacyFabric, Cleanroom and OptiFine; LabyMod is only detected and version-isolated, not installed.
- Vanilla Minecraft installs in parallel with the loader; progress, the current file count, cancellation and retry on failure all live in one progress card.
- Compatibility of the selected loader with the game version is checked before installation and reported directly when it is unsupported.
- China mirror: toggle BMCLAPI in Settings; it covers version manifests, game assets, libraries and loader installers.
- Supports NeoForge's `YY.D.H` version naming from 2026 onwards (such as `26.1`, `26.1.1`) while staying compatible with the older `1.X.Y`.
- Version isolation is enabled automatically once a loader is installed, creating `mods/`, `config/`, `saves/`, `resourcepacks/`, `shaderpacks/` and similar directories.
- The launch flow includes protocol agreement, announcement confirmation and a resource pre-download check; pre-download supports chunked multithreading, progress display and cancellation.

### Launch and runtime diagnostics

- Java runtimes are scanned and version-matched automatically; Settings can switch between automatic, scan results or a custom executable.
- Launch arguments inject G1GC and heap settings; on Java 8, which does not support argument files, it falls back to a plain command line.
- Once the game window is detected the stdout pipe is closed, so a full buffer cannot slow down the final loading stage; the launcher can optionally minimize after launch.
- Abnormal exit detection: a non-zero exit code, or exit code 0 with a crash report or `hs_err` file written after this launch, opens the crash diagnostics window; older reports are filtered by launch time.
- The diagnostics window shows the exit code and gives entry points to the crash report, game log and JVM crash log; export and analysis still work when a file is missing.
- Local diagnostics recognize 11 common problem classes by keyword (Mixin, missing dependencies, out of memory, mod conflicts and so on) and show at most 3 suggestions.
- ZIP export: crash report, game log, debug log, JVM crash log, launcher log and system information; the temporary file is fully written before it atomically replaces the target.
- Upload the game log to LogShare.CN and copy the share link automatically on success.
- Jingdu AI analysis runs asynchronously; results render as Markdown and can be saved as UTF-8 TXT without BOM.

## Resources and Modpacks

### My resources

- Four resource types are managed in one place: mods, resource packs, worlds and shader packs; the game version can be switched at the top.
- The version selection order is "route parameter → recently used → first installed", plus a "Global .minecraft" entry for the shared directory.
- Vanilla instances show only resource packs and worlds; mods and shader packs appear once a mod loader is installed, consistent with the version isolation rules.
- Mod cards read metadata from inside the jar: icon, name, author, modid, version and description.
- Resource packs and shader packs extract preview images such as `pack.png` from the zip; world zips are extracted to `saves/` automatically.
- Typed search, pagination, drag-and-drop installation, installation from the file picker, enable and disable (`.disabled`), delete and open directory.
- Mod update checks query both Modrinth and CurseForge, compare versions and let you select entries for a batch update; downloads run 8 in parallel with hash verification.
- When some updates fail, finished files are kept and the success and failure counts are reported, so nothing is dropped silently.

### Online resources

- "Browse resources" loads popular content on entry and supports mods, resource packs and shader packs, filtered by keyword, game version and mod loader.
- Dual-source search across Modrinth and CurseForge; without `CURSEFORGE_API_KEY` it falls back to Modrinth only.
- Filters are prefilled from the source version, and instances with custom names are recognized as well.
- The detail page lets you choose a specific version, preview dependencies and install into a chosen instance; installation resolves `required` dependencies recursively.
- AI search expands the keyword into several English terms, searches them in parallel, then merges, deduplicates and sorts by download count; it degrades to a normal search when no Jingdu account is signed in.
- Both local and server-side pagination are supported; search results are not cleared when the source is switched.

### Modpacks

- The client supports six sources: Modrinth `.mrpack`, MultiMC/Prism, CurseForge, HMCL, MCBBS and generic archives; the server side accepts `.mrpack` only.
- Install from a local file, or search and pick a version on the online browse page and download it; the online version list is grouped by Minecraft version and appends 50 entries at a time.
- Metadata, optional components and the component list are parsed; optional files in `.mrpack` can be selected, while other formats show a read-only list.
- A custom instance name generates that instance's own version JSON (`versions/<instance>/<instance>.json`), and the version list, launch flow and version isolation all recognize it.
- Client installation progress spends 90% on the parallel phase and 10% on the loader installation; files download over multiple threads and failures can be retried.
- The version list refreshes automatically when installation finishes; the server list refreshes in sync after a server installation.
- Hosting a server installs the matching vanilla server, accepts the EULA, generates a basic `server.properties` and detects Forge / Fabric / NeoForge / Quilt server loaders; Fabric API is installed automatically from Modrinth when a Fabric server lacks it.
- Mods whose purpose cannot be determined are collected in a dialog after installation, where each can be disabled or handled individually.

## Servers

### List and lifecycle

- The installed server list shows name, version, running state and count; each row can be started or stopped directly, and several servers can run at the same time.
- The detail page offers start, stop, join server, open directory and delete (with confirmation).
- Each server has its own maximum memory (1G to 16G), stored in `.fmcl_server.json` inside that server's directory and taking precedence over the global setting.
- On a port conflict it moves on to a free port and writes it back to `server.properties` instead of killing the process holding the port, and both the list and the detail page report it clearly.
- `nogui` is passed explicitly at startup; no server console window appears on Windows; quitting the launcher shuts down every server started by this process.
- The installation page accepts a manually entered version ID or a quick pick from release versions (10 entries per page, paginated, click to fill in).
- Installation progress is shown as "85% client + 15% server jar"; the EULA is accepted automatically, Java is managed and a default configuration is generated.

### Console

- Logs are isolated by server route in a reused read-only log view: auto-scroll to the bottom, no line wrapping, the last 5000 lines.
- Shows running state, online players (`joined` / `left`, up to 20) and a memory sample every 2 seconds.
- The command input sends on Enter or with the send button; clearing the screen and exporting logs are supported.
- When a server stops unexpectedly, a dialog on any page asks you to confirm the exit; choosing to analyze reuses the crash service for AI diagnostics.

### Configuration editor

- 49 `server.properties` entries are shown in 7 categories, plus memory, EULA and directory, for 52 items in total.
- Cross-category search (name, key, description), six control types (BOOL / INT / STR / ENUM / memory / read-only), badges for advanced entries and range hints.
- Entries or the current category can be restored to defaults; an out-of-range INT value opens a dialog and highlights the field in red.
- Raw text editing: line endings are normalized and written back after confirmation.
- Saving only updates the keys that changed and keeps comments and unknown keys; the page guards against leaving with unsaved changes.
- After saving, per-server memory and the detail page dropdown stay in sync; changes to a running server take effect after a restart.

### Server mods and resource packs

- Manages `mods/` and `resourcepacks/` in the server directory: search, pagination, drag-and-drop and file-picker installation, enable and disable, delete.
- The mod list can be exported, updates checked and applied in a batch, and client-only mods filtered out.
- Online browsing of server mods uses Modrinth only, with AI search, backend pagination and installation into the current server.

## Terracotta Multiplayer

- Windows only; built on EasyTier virtual networking, with P2P traversal across many NAT types.
- Environment detection and one-click EasyTier installation: several mirrors are speed-tested in parallel with automatic fallback.
- Terracotta codes use a `U/` prefixed 21-character Base34 encoding that includes a checksum, and remain compatible with legacy `XXXXX-XXXXX-XXXXX-XXXXX-XXXXX` codes.
- Create a lobby: enter the Minecraft port and a display name, a code is generated and EasyTier starts as the host; the host is ready in about 5 seconds.
- Join a lobby: enter the code to connect; guests connect in about 3 seconds and look for the host at most twice; the code can be copied.
- The member list puts the host first and shows online state and guest-to-host latency; members time out after 10 seconds, and a failed heartbeat marks the host offline automatically.
- TCP port forwarding (up to 10 concurrent) and LAN broadcast emulation; after joining, broadcast packets are sent to `127.0.0.1:4445`.
- LAN world scanning (3.5 seconds) only lists results and never joins automatically; it listens on both IPv4 and IPv6 multicast.
- The EasyTier log keeps up to 5000 lines and survives page switches; leaving a lobby and abnormal exits are both cleaned up.
- Like every domain unavailable on non-Windows systems, non-Windows shows an explicit unsupported notice.

## World Save Backups

- The global `saves/` directory and every isolated version directory are scanned automatically and rescanned on refresh.
- The backup table shows time (local time zone), size, game version and note; restore, verify, export ZIP and delete are supported, and restore and delete ask for confirmation.
- Manual backups take a note and show real compression progress; compression level 1 / 3 / 6 / 9.
- Automatic backups can be configured separately for "before the game starts" and "after the game exits"; toggles are written to the configuration immediately.
- Backup settings: storage path, keep 5 / 10 / 20 / 30 / 50 / unlimited per world save, and how to handle the old save on restore (rename / overwrite / recycle bin).
- ZIP integrity is verified before a restore; free disk space is checked before a backup; the oldest backups are deleted automatically once the retention count is exceeded.
- The index records metadata in `index.json` and stays compatible with older index versions.

## Music

### Playback and queue

- Playback uses `QMediaPlayer` streaming and never downloads a whole track first; progress, volume, mute, fade in and out and playback state restoration are supported.
- A single playback queue with four modes: sequential, list repeat, single repeat and shuffle.
- Queue entries can be jumped to, moved up, moved down and removed; every track list shares the same row component.
- Playback history is recorded automatically, a repeated track moves to the front, up to 200 entries.
- The main window has a music control bar at the bottom; on Windows it integrates SMTC (metadata, state, progress, media keys).
- Volume leveling is on by default: tracks are analyzed against a -14 LUFS target and normalized, so the volume does not jump between tracks; results are cached and the next track is prefetched.

### Discovery, local and online

- Discover home: daily recommendations, recommended playlists, charts and new music.
- Local music: a recursive scan of MP3 / FLAC / OGG / WAV / M4A / AAC, reading tags, embedded cover art and duration, with "play all".
- Online search covers five main sources - NetEase Cloud Music, QQ Music, Kuwo, Kugou and Migu - with Bilibili as a cross-source fallback.
- The highest available quality is chosen automatically; search terms come with suggestions, results return source by source, and pages are guarded by a request sequence number.
- When playback fails or a link is invalid, the same track is searched across sources, and a duration check of ±15 seconds filters out covers and instrumentals.
- When Bilibili returns a `v_voucher` risk check, a verification window opens the system browser; once the slider is solved the `grisk_id` is obtained automatically and the request is retried.
- Original-track detection clusters by normalized title and `originSongSimpleData`, combined with release date, a curated ID table, a same-title-different-song table and an encyclopedia fallback; tracks that cannot be decided are left unmarked.

### Playlists, lyrics and desktop lyrics

- The playlist sidebar contains all songs, liked music, recently played, user playlists and NetEase Cloud playlists.
- Playlists can be created, renamed and deleted; system playlists cannot be edited; sorting supports added time and title (Chinese sorted by pinyin initial).
- Playlists are written atomically to `data/music/` with a 30-second fallback; the old `data/music.json` is migrated read-only.
- NetEase Cloud accounts support QR sign-in and show the VIP tier and credential expiry; remote playlists sync read-only and refresh every 10 minutes.
- Lyrics support LRC, translations and romanization; the full-screen playback page has an event overlay.
- Desktop lyrics scroll in three lines with the current line highlighted; they can be turned on, locked, or unlocked and dragged, and opacity and position are persisted.
- Global hotkeys: `Ctrl+Shift+Space` play/pause, `Ctrl+Shift+Left/Right` previous/next, `Ctrl+Shift+Down` stop, `Ctrl+Shift+Up/PageDown` volume, `Ctrl+Shift+Alt+M` mute.
- Audio effects (EQ / reverb / pitch shift / speed) and a player mini mode are not provided.

## Toolbox

### Nine entries

| Tool | Description |
|------|-------------|
| Game junk cleanup | Grouped checkboxes by directory, scans `.log` / `.tmp`, adjustable scan depth, skips system directories, deletes after confirmation |
| Port check | TCP connectivity, latency and error details; built-in MC Java, Bedrock, HTTP and HTTPS presets plus Server List Ping (MOTD, version, player count, player sample, favicon) |
| Hash calculation | MD5 / SHA1 / SHA256 / SHA512, read in chunks in the background, result can be copied |
| Coordinate conversion | Overworld and Nether X/Z conversion, Y unchanged |
| Today's luck | A 0-100 score and grade generated from a date seed, with the last 60 days of history persisted |
| Fun facts | 40 built-in Minecraft facts, one per day, switchable at random |
| Knowledge quiz | AI-generated questions, the question bank is persisted and refilled automatically when fewer than 5 remain |
| Multithreaded download | Custom URL, User-Agent and save path, with pause, cleanup on cancel and cross-process resume |
| Related sites | 29 official, community, resource and tool sites, with names, descriptions and tags in four languages |

### Performance monitor

- Two entry points: the monitor button in the top bar and the global hotkey `Ctrl+Shift+M`.
- A borderless, always-on-top, semi-transparent floating window that can be dragged; top-right by default with a persisted position.
- Shows CPU usage and frequency, memory usage and swap, GPU name, utilization, video memory and temperature.
- GPU data is probed across NVIDIA / AMD vendors (pynvml, nvidia-smi, rocm-smi, amd-smi, gpu-detector); a placeholder is shown when no data is available.
- A 10-second hotkey hint appears when the window opens; values refresh every second and GPU data every 2 seconds.

## Achievements and Notifications

- 47 achievements in 9 categories: gamers, modders, server owners, backup habit, multiplayer, AGENT, personalization, power users and music life.
- Some achievements have I / II / III stages that upgrade automatically by count or progress; cards show current progress, stage and unlocked badge.
- Triggers cover launching the game, installing a version, backups, servers, music playback, mode switching and more, with a notification in the bottom-right corner on unlock.
- Data lives in `achievements.db` (SQLite WAL) and is protected from concurrent access by a reentrant lock.
- The daily check-in records consecutive days opened and counts towards the "check-in master" achievement.
- Cloud save sync: downloaded and merged entry by entry at startup (keeping the higher stage or progress) and pushed automatically after an unlock; manual sync, cloud reset and local reset are supported.
- Global notifications share one toast stack with four levels: info / success / warning / error.

## AGENT and Voice

### Conversations and tools

- Three-column layout: session list, message stream and todo panel; sessions can be created, switched, renamed and deleted, and history is saved automatically.
- Markdown renders headings, paragraphs, lists, tables and fenced code blocks without WebEngine; thinking blocks can be collapsed.
- Tool call cards show arguments and results and can be expanded and copied; output streams over SSE, with stop, regenerate and copy.
- High-risk commands, file modifications and `ask_user` all require confirmation; file writes, edits and deletes preview a diff first.
- 33 tools in total cover versions, mods, resource packs, shader packs, modpacks, servers, system commands, web search, web fetching, file read and write, search and listing, session tasks and user interaction; the tool loop is capped at 50 rounds.
- Web search prefers Bing and falls back to DuckDuckGo; web fetching can output Markdown, plain text or HTML.
- Four provider types are supported: Jingdu, OpenAI, Anthropic and custom OpenAI-compatible endpoints; the thinking toggle and its intensity are adjustable.
- All 33 tools have three permission levels - allow / ask / deny - and the rules are persisted.
- Skills can be listed, created, opened and edited, and their content is injected into the system context; the skill directory is `data/agent/skills/{name}/SKILL.md`.
- The quick input in the top bar sends on Enter and jumps to AGENT; closing the window while a request is processing requires confirmation.
- The CLI still works: `python main.py --agent "..."` or `python main.py -A`.

### Voice input

- Both the AGENT input and the top input of the main window can record with one click, and the recognized text is filled in automatically.
- Based on the offline SenseVoice-Small model with built-in punctuation and number conversion, adapting between DirectML and CPU.
- The model downloads automatically on first use; when GitHub is slow, a local model ZIP can be imported in Settings.
- The voice button stays disabled until the model is ready, so a click always gets feedback.

## Bedrock Edition

- Windows 10 19041 or later only; two builds, UWP (AppX registration) and GDK (raw launch after XVD extraction).
- Installed cards show name, version, UWP/GDK build and Release/Preview/Test channel, and support launch, delete, details and opening the version directory.
- The version catalog comes from McAppx with multi-source fallback; search, All/UWP/GDK filtering, 20 entries per page and pagination.
- The MCAPPX terms must be accepted before installation; GDK checks for the .NET 10 SDK and points to the official download, and authentication components are downloaded on demand after explicit consent.
- Microsoft device code sign-in: show the code, copy it, open the link and poll for the result.
- Installation uses real download progress, multithreaded resume and MD5 verification.
- GDK XVD extraction is delegated to a .NET helper (BedrockLauncher.Core) that prefers AES-NI and falls back to software decryption on older CPUs.
- Environment detection and repair: developer mode, Gaming Services, the VC++ runtime and GameInput; when Gaming Services is missing it is installed with winget before the download.
- Launch prefers the version selected by the user and falls back to the installed Xbox version on failure.

## Settings and Personalization

### Settings sections

- 9 sections: launcher, Java, theme, music account, logs, about, accounts, AI and plugins.
- Settings use a whole-domain draft: edits go only into the draft and can preview themes and languages; saving writes to disk, cancelling restores the previous values, and leaving with unsaved changes prompts.
- Launcher section: minimize after launch, China mirror toggle, download thread count (1-255), interface language.
- Java section: automatic / scan / custom modes, custom path browsing, applying a scan result by radio selection and refreshing.
- Theme section: 5 presets, importing a `.json` theme, a custom Hex accent color, random color and the version-based dynamic theme.
- Languages are Simplified Chinese, English, Traditional Chinese and Japanese, and switch immediately without a restart.

### Accounts and skins

- Microsoft sign-in: PKCE OAuth, with device code sign-in as a fallback.
- Offline sign-in: a UUID is generated locally, no network verification needed.
- Yggdrasil external sign-in: supports third-party authentication servers such as skin sites and injects `authlib-injector` automatically.
- Microsoft tokens are checked before launch and renewed with `refresh_token`; accounts are stored in `accounts.json` and tokens are encrypted.
- Accounts can be added, deleted, switched and set as current; encrypted `.fmcl_accounts` files can be imported and exported.
- Skins support 64x64 / 64x32 / 128x128 / 128x64 PNG and are copied to `.minecraft/skins/` automatically.

### Jingdu account

- Settings → Jingdu account: sign in with a username and password, and errors are classified as wrong credentials, HTTP, network or missing token.
- After signing in it shows the username, UUID, level, signature and AI credits, and can be refreshed or signed out.
- Both the token and the username are stored with Fernet encryption; user information is cached in memory only.
- An HTTP 401 reports an expired session and clears the local token.

### Themes and interface

- The default theme plus Ocean Blue, Forest Green, Lavender Purple and Sunset Orange presets, switchable in one click.
- A custom accent color supports `#RRGGBB` validation, clearing an empty value and random generation.
- The version-based dynamic theme adjusts the accent color to the current Minecraft version (versions such as 1.13 through 1.21 each have their own palette).
- The interface uses QML-drawn components and the FluentUI module; colors come only from theme variables, with a consistent icon set and 110 ms transitions. No gradients are used and no emoji appear in the interface.
- The 12 top-level domains are grouped as "Game / Resources and Multiplayer / Tools and Extensions"; domains unavailable on the current platform do not appear in the navigation.

## Plugins, Updates and System Integration

### Plugin system

- Plugins ship as `.fmpl` archives containing `plugin.json` and Python modules; local installation and an online marketplace are supported.
- The plugin manager can browse, enable, disable, uninstall and inspect permissions; enabling, disabling and installing hot-reload without a restart.
- Permissions have three levels, low, medium and high: low risk is confirmed once, medium risk can be revoked, high risk prompts every time.
- 20+ hook points cover the application, game, versions, servers, downloads and the UI lifecycle.
- An exception in one plugin is isolated and does not affect other plugins or the launcher; version constraints, circular dependency detection and topological sorting are applied across plugins.
- A failed update rolls back to the previous version automatically; each plugin has its own `data/` and `configs/` directories.
- UI API v2: plugins can provide pages in QML, fetch data through `Plugins.call` and register into the top-level navigation; pages of plugins that declare `ui_api: 1` are not loaded, while non-UI hooks are unaffected.
- See [Plugin development](/en/plugin) for details.

### Automatic updates

- Automatic updates are currently Windows only: a GitHub Release check runs at startup (it can be disabled), and a new version shows its version number and changelog.
- Settings → About can check manually, download and launch the NSIS installer; once the installer starts, the normal shutdown chain is used.
- Linux and macOS have no automatic installation; update through a tarball, a setup script or the source.

### Status and system integration

- The bottom status bar shows operation results; success, failure and warning states clear after 10 seconds, while loading states persist.
- The toast stack is for asynchronous results that do not belong in the status bar; the same event is queued only once to avoid duplicates.
- Windows supports SMTC and global hotkeys; on Linux, global hotkeys may be unavailable in non-root environments.

## Security and Data

### Security

- All HTTP requests verify SSL certificates by default.
- Tokens are stored with a random key file and Fernet symmetric encryption; `.fmcl_key` can be migrated together with `config.json`.
- User input passes whitelist and path validation to prevent command injection and path traversal.
- Mod downloads verify SHA1 / SHA512 and update packages verify SHA256; the downloader supports connection pooling, exponential backoff retries and Range resume.
- Configuration and backup indexes use atomic writes with a temporary file and a rename; a failed modpack installation cleans up partial files and directories.

### Performance

- JSON prefers orjson and falls back to the standard library when it is missing.
- File verification hashes concurrently on a thread pool, and downloads process batches concurrently with asyncio + aiohttp.
- JVM arguments inject G1GC and a fixed heap; the stdout pipe is closed once the game window appears.
- Modules outside the first screen are imported lazily; mirror URL conversions are cached; version lookup uses a set for O(1).

### Data and logs

- The data directory prefers the program directory (portable mode) and falls back to the user data directory when it is not writable.
- Configuration is saved as `config.json`, the launcher log is `latest.log`, and structured logs are appended to `latest_structured.log` as JSONL.
- Uninstalling removes only program files and shortcuts, keeping user data such as `config.json`, `.minecraft`, accounts, playlists and achievements.

## Platform Support and Limitations

- **Windows**: the QML build ships an x64 installer only (PySide6 6.7.3 has no win32 wheels). On 32-bit systems keep using the 2.12.6 installer; the data directory is the same as in the new version.
- **Linux**: source builds and a tarball for x86_64; the setup script registers the `fmcl` command. Global hotkeys may be unavailable in non-root environments.
- **macOS**: running from source only, no `.dmg` at the moment.
- Bedrock Edition and Terracotta multiplayer are Windows only; on non-Windows an explicit unsupported notice is shown instead of a blank page.
- Music does not provide audio effects or a mini mode.
- Only the QML interface is offered; plugin pages use the QML extension protocol and the command-line mode remains in `main.py`.
