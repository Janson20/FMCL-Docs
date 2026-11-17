---
title: Configuration
outline: deep
---

# Configuration

This page lists the configuration file locations, platform differences and every persisted setting. The launcher
reads and writes the configuration itself, so you rarely need to edit it by hand; quit the launcher first if you do.

## Configuration file locations

### Windows / macOS

The launcher prefers the directory where the program is installed (portable mode):

| Content | Path |
|---------|------|
| Configuration | `config.json` |
| Key | `.fmcl_key` |
| Log | `latest.log` |
| Structured log | `latest_structured.log` |
| Minecraft | `.minecraft/` |

When the program directory is not writable (for example, when installed under the system program directory), the
launcher falls back to the user data directory:

- Windows: `%LOCALAPPDATA%\FMCL`
- macOS: `~/Library/Application Support/FMCL`

On the first fallback, any configuration, accounts, world saves, playlists and other data already in the original
directory are copied to the new one; the original directory is kept.

### Linux

Follows the XDG Base Directory specification:

| Content | Path |
|---------|------|
| Configuration | `~/.config/fmcl/config.json` |
| Key | `~/.fmcl/.fmcl_key` |
| Log | `~/.local/share/fmcl/fmcl.log` |
| Runtime data | `~/.fmcl/` |
| Minecraft | `~/.minecraft/` |

Directories are created on the first run. Running from source requires Python 3.10–3.11 and the Qt 6 runtime
libraries.

## Configuration entries

`config.json` currently stores 32 entries. Writes go through a temporary file and an atomic replace, so an
interrupted write never leaves half a file behind.

```json
{
  "mirror_enabled": true,
  "download_threads": 4,
  "minimize_on_game_launch": false,
  "auto_check_update": true,
  "player_name": "Steve",
  "skin_path": null,
  "jdz_token": null,
  "jdz_username": null,
  "language": "zh_CN",
  "language_chosen": false,
  "theme_name": "default",
  "accent_color": null,
  "dynamic_version_theme": false,
  "ai_privacy_consent": false,
  "terms_consent": false,
  "bedrock_terms_accepted": false,
  "bedrock_components_consented": false,
  "backup_dir": null,
  "backup_compress_level": 6,
  "backup_max_per_world": 10,
  "backup_restore_mode": "rename",
  "backup_auto_launch": false,
  "backup_auto_exit": false,
  "java_mode": "auto",
  "java_custom_path": null,
  "accounts_file": null,
  "current_account_id": null,
  "account_migration_done": false,
  "music_state": {},
  "overlay_geometry": {},
  "music_baike_original_enabled": true,
  "wy_cookie": null
}
```

### Downloads and updates

| Entry | Type | Default | Description |
|-------|------|---------|-------------|
| `mirror_enabled` | bool | `true` | Use the BMCLAPI China mirror |
| `download_threads` | int | `4` | Number of threads used for multi-threaded downloads |
| `auto_check_update` | bool | `true` | Check for updates silently after startup |
| `minimize_on_game_launch` | bool | `false` | Minimize the launcher once the game has started |

### Accounts and player

| Entry | Type | Default | Description |
|-------|------|---------|-------------|
| `player_name` | string | `"Steve"` | Legacy player name, used only to migrate to an offline account on the first run |
| `skin_path` | string/null | `null` | Path to the current skin file |
| `accounts_file` | string/null | `null` | Account file path; `null` uses `accounts.json` in the data directory |
| `current_account_id` | string/null | `null` | ID of the current account |
| `account_migration_done` | bool | `false` | Whether the legacy player name has been migrated; internal flag |

### Interface and language

| Entry | Type | Default | Description |
|-------|------|---------|-------------|
| `language` | string | `"zh_CN"` | Interface language: `zh_CN` / `zh_TW` / `en_US` / `ja_JP` |
| `language_chosen` | bool | `false` | Whether the first-run language selection has been completed |
| `theme_name` | string | `"default"` | Theme name: `default` / `ocean` / `forest` / `lavender` / `sunset`, or an imported theme name |
| `accent_color` | string/null | `null` | Custom accent color as a hex value; `null` uses the theme default |
| `dynamic_version_theme` | bool | `false` | Adjust the accent color to the current Minecraft version |
| `overlay_geometry` | object | `{}` | Position, size and opacity of the desktop lyrics and performance overlay windows, keyed by window name |

### Terms and privacy

| Entry | Type | Default | Description |
|-------|------|---------|-------------|
| `terms_consent` | bool | `false` | Whether the terms of use and the Minecraft EULA have been accepted |
| `ai_privacy_consent` | bool | `false` | Whether the log upload notice for AI analysis has been accepted |
| `bedrock_terms_accepted` | bool | `false` | Whether the Bedrock Edition terms have been accepted |
| `bedrock_components_consented` | bool | `false` | Whether downloading GDK-certified components on demand has been approved |

### Java

| Entry | Type | Default | Description |
|-------|------|---------|-------------|
| `java_mode` | string | `"auto"` | `auto` scans automatically / `system` uses system Java / `custom` uses a custom path |
| `java_custom_path` | string/null | `null` | Path to a custom Java executable |

### Backups

| Entry | Type | Default | Description |
|-------|------|---------|-------------|
| `backup_dir` | string/null | `null` | Backup directory; `null` uses `backups/` in the data directory |
| `backup_compress_level` | int | `6` | ZIP compression level: 1 is fastest, 9 gives the smallest file |
| `backup_max_per_world` | int | `10` | Number of backups kept per world save; 0 means unlimited |
| `backup_restore_mode` | string | `"rename"` | What happens to the old world save on restore: `rename` / `overwrite` / `trash` |
| `backup_auto_launch` | bool | `false` | Back up automatically before the game starts |
| `backup_auto_exit` | bool | `false` | Back up automatically after the game exits |

### Music and credentials

| Entry | Type | Default | Description |
|-------|------|---------|-------------|
| `music_state` | object | `{}` | Playback state such as volume, play mode and last directory |
| `music_baike_original_enabled` | bool | `true` | Query Baike as a fallback when the original artist cannot be determined |
| `wy_cookie` | string/null | `null` | NetEase Cloud Music login cookie, stored after Fernet encryption |
| `jdz_token` | string/null | `null` | Jingdu AI token, stored after Fernet encryption |
| `jdz_username` | string/null | `null` | Jingdu AI username, stored after Fernet encryption |

`jdz_token`, `jdz_username` and `wy_cookie` are stored as ciphertext in the file and cannot be copied for direct
use. Editing them by hand makes decryption fail, and the launcher then treats you as signed out; sign in again
through the interface.

## Runtime directories

The following directories are not configured in `config.json`; they are derived from the data directory:

| Content | Location |
|---------|----------|
| Game versions | `.minecraft/versions/` |
| Mods and resources | `mods/`, `resourcepacks/`, `shaderpacks/` and `saves/` of the corresponding version |
| Accounts | `accounts.json` |
| Achievements | `achievements.db` |
| Plugins | `plugins/` (configuration and data are split into per-plugin directories by plugin ID) |
| Music | `data/music/` |
| Backups | `backups/` or `backup_dir` |
| Themes | `themes/` |
| Logs | `latest.log`, `latest_structured.log` |

## Restoring defaults

- A single setting: click "Restore defaults" in the corresponding section of Settings, or set the value back by hand.
- All settings: quit the launcher, back up `config.json` and delete it; the default configuration is generated again on the next start.
- Accounts, achievements, world saves and playlists are not stored in `config.json`, so deleting the configuration does not delete that data.
