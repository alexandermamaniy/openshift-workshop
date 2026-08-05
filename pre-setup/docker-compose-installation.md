# Docker Compose Installation Guide

This guide covers how to install **Docker Compose V2** as a standalone CLI plugin on **Windows** and **macOS**.

> **Prerequisites:** Docker must already be installed on your machine. If you haven't installed Docker yet, follow the [Docker installation guide](./docker-installation.md) first.

---

## Table of Contents

- [What is Docker Compose?](#what-is-docker-compose)
- [Installing on Windows](#installing-on-windows)
- [Installing on macOS](#installing-on-macos)
- [Verify the Installation](#verify-the-installation)
- [Quick Usage Example](#quick-usage-example)
- [Troubleshooting](#troubleshooting)
- [Useful Links](#useful-links)

---

## What is Docker Compose?

Docker Compose is a tool for defining and running multi-container Docker applications using a single `docker-compose.yml` file. It lets you configure services, networks, and volumes and manage them all with one command:


---

## Installing on Windows

Docker Compose V2 is installed as a **CLI plugin** located at `%USERPROFILE%\.docker\cli-plugins\`.

### Step 1: Create the CLI Plugins Directory

Open **PowerShell** and run:

```powershell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.docker\cli-plugins"
```

### Step 2: Download the Docker Compose Binary

Download the latest release directly from the official GitHub releases page:

```powershell
Invoke-WebRequest `
  -Uri "https://github.com/docker/compose/releases/latest/download/docker-compose-windows-x86_64.exe" `
  -OutFile "$env:USERPROFILE\.docker\cli-plugins\docker-compose.exe"
```

> **Note:** If you are on an ARM64 machine (e.g., Windows on ARM), replace `x86_64` with `aarch64` in the URL above.

### Step 3: Verify the Binary is in Place

```powershell
Get-Item "$env:USERPROFILE\.docker\cli-plugins\docker-compose.exe"
```

You should see the file listed with its size and last modified date.

---

## Installing on macOS

Docker Compose V2 is installed as a **CLI plugin** located at `~/.docker/cli-plugins/`.

### Option A: Install via Homebrew (Recommended)

If you have [Homebrew](https://brew.sh) installed, this is the simplest method:

```bash
brew install docker-compose
```

Then register it as a Docker CLI plugin:

```bash
mkdir -p ~/.docker/cli-plugins
ln -sfn $(brew --prefix)/opt/docker-compose/bin/docker-compose ~/.docker/cli-plugins/docker-compose
```

### Option B: Install Manually

#### Step 1: Create the CLI Plugins Directory

```bash
mkdir -p ~/.docker/cli-plugins
```

#### Step 2: Download the Docker Compose Binary

**For Apple silicon (M1/M2/M3/M4):**

```bash
curl -SL "https://github.com/docker/compose/releases/latest/download/docker-compose-darwin-aarch64" \
  -o ~/.docker/cli-plugins/docker-compose
```

**For Intel chip:**

```bash
curl -SL "https://github.com/docker/compose/releases/latest/download/docker-compose-darwin-x86_64" \
  -o ~/.docker/cli-plugins/docker-compose
```

> **Tip:** Not sure which chip you have? Click **Apple menu ()** → **About This Mac** and check the **Chip** or **Processor** field.

#### Step 3: Make the Binary Executable

```bash
chmod +x ~/.docker/cli-plugins/docker-compose
```

---

## Verify the Installation

Run the following command in your terminal (PowerShell on Windows, Terminal on macOS):

```bash
docker compose version
```

Expected output (version number may differ):

```
Docker Compose version v2.x.x
```

**Quick smoke test** — create a `docker-compose.yml` file:

```yaml
services:
  hello:
    image: hello-world
```

Run it:

```bash
docker compose up
```

Expected output (abbreviated):

```
hello-1  | Hello from Docker!
hello-1  | This message shows that your installation appears to be working correctly.
```

Clean up:

```bash
docker compose down
```

If all steps succeed, Docker Compose is correctly installed and ready to use. ✅

---

## Quick Usage Example

A minimal `docker-compose.yml` for a web app with a database:

```yaml
services:
  web:
    image: nginx:latest
    ports:
      - "8080:80"
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: example
    volumes:
      - db_data:/var/lib/postgresql/data
volumes:
  db_data:
```

**Common commands:**

| Command | Description |
|---------|-------------|
| `docker compose up` | Start all services |
| `docker compose up -d` | Start in detached (background) mode |
| `docker compose down` | Stop and remove containers |

---

## Troubleshooting

### `docker compose version` returns `unknown command "compose"`

**Cause:** Docker does not detect the plugin binary.

**Fix:**
- Confirm the binary exists at the correct path:
  - **Windows:** `%USERPROFILE%\.docker\cli-plugins\docker-compose.exe`
  - **macOS:** `~/.docker/cli-plugins/docker-compose`
- On macOS, confirm the binary has execute permissions:

  ```bash
  chmod +x ~/.docker/cli-plugins/docker-compose
  ```

- Ensure your Docker Engine version is 20.10 or later (required for CLI plugins):

  ```bash
  docker --version
  ```

---

### `docker-compose: command not found` (legacy V1)

Docker Compose V1 is no longer supported. Use the V2 syntax:

```bash
# Old (V1 — deprecated):
docker-compose up

# New (V2 — use this):
docker compose up
```

---

### Download fails on Windows (SSL/TLS error)

**Fix:** Use the `-SkipCertificateCheck` flag if your corporate proxy intercepts TLS:

```powershell
Invoke-WebRequest `
  -Uri "https://github.com/docker/compose/releases/latest/download/docker-compose-windows-x86_64.exe" `
  -OutFile "$env:USERPROFILE\.docker\cli-plugins\docker-compose.exe" `
  -SkipCertificateCheck
```

---

### `docker compose` works in PowerShell but not in WSL 2

**Fix:**
1. Open **Docker Desktop** → **Settings** → **Resources** → **WSL Integration**.
2. Enable integration for your WSL 2 distribution.
3. Click **Apply & Restart**.

---

## Useful Links

- [Docker Compose Overview](https://docs.docker.com/compose/)
- [Docker Compose GitHub Releases](https://github.com/docker/compose/releases)
- [Compose File Reference](https://docs.docker.com/compose/compose-file/)
- [Docker Compose CLI Reference](https://docs.docker.com/compose/reference/)
