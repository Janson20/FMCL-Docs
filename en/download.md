---
title: Download
---

# Download FMCL

<DownloadSection lang="en" />

## Installation

### Windows x64

Double-click the `.exe` installer and follow the wizard. The installer bundles 7-Zip, so unpacking and installing
work without an internet connection. The full build also bundles the .NET 10 SDK; the lite build is smaller and
prompts you to install the SDK the first time you use GDK Bedrock Edition.

- Installs to `%LOCALAPPDATA%\Programs\FMCL` and **never requires administrator rights**.
- The product is a directory (`FMCL.exe` plus `_internal/`). Uninstalling only removes program files and keeps
  `config.json`, `.minecraft`, accounts, playlists and achievements.
- The installer is not code signed, so SmartScreen may warn you. Click **More info** then **Run anyway**, and make
  sure the file came from this repository's Releases page.

### Linux x86_64

Option 1: download the directory tarball and run it.

```bash
tar -xzf FMCL-3.0.0-linux-x86_64.tar.gz
cd FMCL && ./FMCL
```

Option 2: use the install script to build from source or install a tarball, which also registers the `fmcl` command.

```bash
curl -fsSL https://raw.githubusercontent.com/Janson20/FMCL/main/scripts/install.sh | bash

# or use an already downloaded tarball
bash scripts/install.sh /opt/fmcl --tarball ./FMCL-3.0.0-linux-x86_64.tar.gz
```

The script supports Debian / Ubuntu / Fedora / RHEL / CentOS / Arch / openSUSE. Running it requires the Qt 6 runtime
and XCB packages (Debian/Ubuntu: `sudo apt install libegl1 libgl1 libxkbcommon-x11-0 libxcb-cursor0`).
Configuration lives in `~/.config/fmcl/config.json` and logs in `~/.local/share/fmcl/fmcl.log`.

Option 3: AppImage and DEB packages are not published for 3.0.0. Use the tarball or the install script instead.

### macOS

No `.dmg` or binary build is available yet; run FMCL from source, as described below. You will need Qt 6.7.3 and
the build dependencies prepared yourself.

### Run from source

Dependencies are managed with [uv](https://docs.astral.sh/uv/) (`pyproject.toml` plus `uv.lock`). Do not run
`pip install` inside `.venv`, otherwise the lock file and the actual environment will drift apart.

```bash
git clone https://github.com/Janson20/FMCL.git
cd FMCL

# create .venv and install every pinned dependency (including Qt)
uv sync

# start the launcher
uv run python main.py
```

Python must be 3.10 or 3.11. On Windows you can also run the interpreter from the virtual environment directly:
`.\venv\Scripts\python.exe main.py`.

## Verifying downloads

Linux attachments ship with a `SHA256SUMS` file:

```bash
sha256sum -c SHA256SUMS
```

On Windows use PowerShell:

```powershell
Get-FileHash .\FMCL-Setup-3.0.0.exe -Algorithm SHA256
```

## Older releases and 32-bit systems

Starting with 3.0.0 only 64-bit Windows builds are published (PySide6 6.7.3 has no win32 wheels). On 32-bit systems
keep using **2.12.6**; both versions share the same data directory, so your configuration and worlds carry over.

To roll back, uninstall 3.0.0 and install 2.12.6. The install location is identical and uninstalling never deletes
user data.

Older releases are listed on [GitHub Releases](https://github.com/Janson20/FMCL/releases).
