# Pre-Setup Guide: Installing Docker

This guide covers the installation of Docker on **Windows**, **macOS**, and **Fedora Linux** before the workshop begins.

---

## Table of Contents

- [System Requirements](#system-requirements)
  - [Windows](#windows-requirements)
  - [macOS](#macos-requirements)
  - [Fedora](#fedora-requirements)
- [Installing Docker Desktop on Windows](#installing-docker-desktop-on-windows)
- [Installing Docker Desktop on macOS](#installing-docker-desktop-on-macos)
- [Installing Docker Engine on Fedora](#installing-docker-engine-on-fedora)
- [Post-Installation: Verify the Installation](#post-installation-verify-the-installation)
- [Troubleshooting](#troubleshooting)

---

## System Requirements

### Windows Requirements

| Component | Minimum Requirement |
|-----------|---------------------|
| OS | Windows 10 64-bit (Home, Pro, Enterprise, Education) — Build 19044 or later |
| OS | Windows 11 64-bit (Home, Pro, Enterprise, Education) |
| RAM | 4 GB minimum |
| CPU | 64-bit processor with Second Level Address Translation (SLAT) |
| BIOS | Hardware virtualization must be enabled in BIOS/UEFI |
| WSL 2 | Windows Subsystem for Linux 2 (recommended backend) |

> **Note:** Docker Desktop supports WSL 2 and Hyper-V backends on Windows. WSL 2 is the recommended option for better performance.

### macOS Requirements

| Component | Minimum Requirement |
|-----------|---------------------|
| OS | macOS 13 (Ventura) or later |
| RAM | 4 GB minimum |
| Chip | Apple silicon (M1/M2/M3/M4) **or** Intel chip |
| Disk Space | 2.5 GB for Docker Desktop installation |

> **Note:** Docker Desktop provides separate installers for **Apple silicon** and **Intel** chips. Make sure to download the correct one for your Mac.

### Fedora Requirements

| Component | Minimum Requirement |
|-----------|---------------------|
| OS | Fedora 43 or later (64-bit) |
| RAM | 2 GB minimum |
| CPU | 64-bit processor |
| Kernel | 3.10 or later (`uname -r` to check) |

---

## Installing Docker Desktop on Windows

### Step 1 — Enable WSL 2

Before installing Docker Desktop, ensure WSL 2 is installed and enabled.

1. Open **PowerShell** as Administrator and run:

```powershell
wsl --install
```

2. Restart your computer when prompted.

3. Verify WSL 2 is the default version:

```powershell
wsl --set-default-version 2
```

### Step 2 — Download Docker Desktop

1. Go to the official Docker Desktop download page:
   **https://docs.docker.com/desktop/setup/install/windows-install/**

2. Click **Download Docker Desktop for Windows**.

### Step 3 — Run the Installer

1. Double-click the downloaded `Docker Desktop Installer.exe`.
2. When prompted, ensure **Use WSL 2 instead of Hyper-V** is selected (recommended).
3. Follow the on-screen instructions and click **OK** to accept the default settings.
4. Click **Close** when the installation is complete.

### Step 4 — Start Docker Desktop

1. Search for **Docker Desktop** in the Windows Start menu and launch it.
2. Accept the Docker Subscription Service Agreement when prompted.
3. Docker Desktop will start and the Docker icon will appear in the system tray.

### Step 5 — (Optional) Add Your User to the `docker-users` Group

If you installed Docker Desktop as an administrator for other users, ensure those users are added to the `docker-users` group:

1. Open **Computer Management** → **Local Users and Groups** → **Groups**.
2. Find **docker-users**, right-click, and select **Add to Group**.
3. Add the desired user account and click **OK**.
4. Log out and back in for changes to take effect.

---

## Installing Docker Desktop on macOS

### Step 1 — Identify Your Mac Chip

1. Click the **Apple menu ()** in the top-left corner.
2. Select **About This Mac**.
3. Look at the **Chip** or **Processor** field:
   - If it says **Apple M1 / M2 / M3 / M4** → download the **Apple silicon** version.
   - If it says **Intel** → download the **Intel chip** version.

### Step 2 — Download Docker Desktop

1. Go to the official Docker Desktop download page:
   **https://docs.docker.com/desktop/setup/install/mac-install/**

2. Download the correct installer for your chip:
   - **Docker Desktop for Mac with Apple silicon**
   - **Docker Desktop for Mac with Intel chip**

### Step 3 — Install Docker Desktop

1. Open the downloaded `.dmg` file.
2. Drag the **Docker** icon into the **Applications** folder.

   ```
   [ Docker ]  →  [ Applications ]
   ```

3. Open **Finder** → **Applications** and double-click **Docker**.
4. macOS will ask for confirmation to open the application — click **Open**.

### Step 4 — Complete the Setup

1. Accept the Docker Subscription Service Agreement.
2. Choose your preferred configuration when prompted (recommended: **Use recommended settings**).
3. Docker Desktop will start and the Docker whale icon 🐳 will appear in the menu bar.

### Step 5 — (Optional) Allow Docker in Privacy & Security

If macOS blocks Docker Desktop from opening:

1. Go to **System Settings** → **Privacy & Security**.
2. Scroll down to the Security section.
3. Click **Open Anyway** next to the Docker Desktop message.

---

## Installing Docker Engine on Fedora

On Fedora, Docker runs as a system service (Docker Engine) rather than a desktop application.

### Step 1 — Remove Conflicting Packages

Remove any older or conflicting Docker-related packages that may be pre-installed:

```bash
sudo dnf remove -y docker \
  docker-client \
  docker-client-latest \
  docker-common \
  docker-latest \
  docker-latest-logrotate \
  docker-logrotate \
  docker-selinux \
  docker-engine-selinux \
  docker-engine
```

### Step 2 — Set Up the Docker Repository

Install the `dnf-plugins-core` package and add the official Docker repository:

```bash
sudo dnf install -y dnf-plugins-core

sudo dnf config-manager --add-repo \
  https://download.docker.com/linux/fedora/docker-ce.repo
```

### Step 3 — Install Docker Engine

```bash
sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### Step 4 — Start and Enable the Docker Service

```bash
sudo systemctl start docker
sudo systemctl enable docker
```

Verify the service is running:

```bash
sudo systemctl status docker
```

### Step 5 — Add Your User to the `docker` Group

This allows you to run Docker commands without `sudo`:

```bash
sudo usermod -aG docker $USER
```

> **Important:** Log out and log back in (or run `newgrp docker`) for the group change to take effect.

### Step 6 — Verify the Installation

```bash
docker --version
docker run hello-world
```

---

## Post-Installation: Verify the Installation

Once Docker is running, open a terminal and run the following commands to confirm Docker is correctly installed.

**Check Docker version:**

```bash
docker --version
```

Expected output (version may differ):

```
Docker version 27.x.x, build xxxxxxx
```

**Run a test container:**

```bash
docker run hello-world
```

Expected output (abbreviated):

```
Hello from Docker!
This message shows that your installation appears to be working correctly.
```

**Check Docker Compose version:**

```bash
docker compose version
```

Expected output:

```
Docker Compose version v2.x.x
```

If all three commands succeed, Docker is correctly installed and ready to use.

---

## Troubleshooting

### Fedora — Permission denied when running `docker`

**Symptom:** `permission denied while trying to connect to the Docker daemon socket`

**Fix:** Add your user to the `docker` group and re-login:

```bash
sudo usermod -aG docker $USER
newgrp docker
```
If the problem persists you may have to add your user to docker jenkins and change the permissions on the file:
```
usermod -aG docker jenkins
usermod -aG root jenkins
chmod 664 /var/run/docker.sock
```

### Fedora — `docker.service` fails to start

**Symptom:** `systemctl status docker` shows a failed state.

**Fix:** Check for conflicts with `podman` or `cri-o`:

```bash
sudo dnf remove -y podman-docker
sudo systemctl daemon-reload
sudo systemctl start docker
```

### Windows — Virtualization not enabled

**Symptom:** Docker Desktop fails to start with a message about hardware virtualization.

**Fix:** Enable virtualization in BIOS/UEFI:
1. Restart your computer and enter BIOS/UEFI (usually by pressing `F2`, `DEL`, or `F10` during boot).
2. Find the **Virtualization Technology** or **Intel VT-x / AMD-V** option.
3. Set it to **Enabled** and save changes.

### Windows — WSL 2 kernel update required

**Symptom:** Error message asking for a WSL 2 Linux kernel update.

**Fix:** Download and install the WSL 2 kernel update from:
https://aka.ms/wsl2kernel

### macOS — Docker Desktop not starting after update

**Symptom:** Docker Desktop crashes or fails to start after an OS or app update.

**Fix:**
1. Quit Docker Desktop completely.
2. Open **Finder** → **Applications** → **Utilities** → **Terminal** and run:

```bash
/Applications/Docker.app/Contents/MacOS/uninstall
```

3. Re-download and reinstall Docker Desktop from the official page.

### General — `docker: command not found`

**Symptom:** The `docker` command is not recognized in the terminal.

**Fix:** Ensure Docker Desktop is **running** (the whale icon should be visible in the taskbar/menu bar). Docker CLI commands only work when Docker Desktop is active.

---

## Useful Links

- [Docker Desktop for Windows — Official Docs](https://docs.docker.com/desktop/setup/install/windows-install/)
- [Docker Desktop for macOS — Official Docs](https://docs.docker.com/desktop/setup/install/mac-install/)
- [Docker Engine on Fedora — Official Docs](https://docs.docker.com/engine/install/fedora/)
- [WSL 2 Installation Guide (Microsoft)](https://learn.microsoft.com/en-us/windows/wsl/install)
- [Docker Hub](https://hub.docker.com/)
