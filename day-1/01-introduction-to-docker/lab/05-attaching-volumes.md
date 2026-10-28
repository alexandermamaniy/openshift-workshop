# Attaching Volumes & Persistence 💾

In the previous section, you saw that containers are isolated and immutable. By default, any files created or modified inside a container live only in its writable container layer. When you delete the container with `docker rm`, those changes are gone forever.

To persist data beyond a container's lifecycle or share files between your host machine and a container, Docker provides two primary storage mechanisms:

1. **Bind Mounts**: Mount a specific file or directory from your host machine into the container. Excellent for live code reloading during development.
2. **Named Volumes**: Docker-managed storage areas stored in Docker's internal host storage directory. Best for persisting database data, configuration state, or sharing data across multiple containers.

---

## 1. Live Development with Bind Mounts

In [Module 04](./04-running-your-app.md), changing `app.js` on your computer didn't update the running container because the image contained a snapshot of the code taken at build time.

With a **bind mount**, you can mount your local working directory into `/app` inside the container.

Run the container with:

```bash
docker run -d -p 3000:3000 -v "$(pwd):/app" -v /app/node_modules --name dev-app getting-started
```

Breaking down the flags:

| Flag | Purpose |
|---|---|
| `-v "$(pwd):/app"` | Mounts your local host directory into `/app` inside the container |
| `-v /app/node_modules` | **Anonymous volume**: Prevents the host folder from hiding/overwriting `/app/node_modules` built inside the container image |

> **Important Concept: Why `-v /app/node_modules` is needed**
> During `docker build`, dependencies were installed inside `/app/node_modules` in the image. Since your local host directory does not contain `node_modules`, mounting `-v "$(pwd):/app"` alone would hide `/app/node_modules` and crash the app (`Cannot find module 'express'`). Adding `-v /app/node_modules` preserves the container's installed packages.

Open http://localhost:3000 in your browser to verify the app is running.

### Test Live Editing

Now open [app.js](app.js) in your editor and modify the heading text:

```javascript
<h1>🐳 Hello from Docker with Bind Mounts!</h1>
```

Save the file.

> **Note: Reloading the application process**
> Because Node.js loads the JavaScript file into memory when the process starts, the running process needs to be restarted to pick up code changes. Notice that you do **not** need to rebuild the image (`docker build`)! Simply restart the container:

```bash
docker restart dev-app
```

Now refresh your browser at http://localhost:3000. You will see the updated title immediately!

> **Bonus Tip: Automatic Reloading with `--watch`**
> In modern Node.js versions, you can pass `--watch` to auto-restart on changes without manual container restarts:
> ```bash
> docker run -d -p 3000:3000 -v "$(pwd):/app" -v /app/node_modules --name dev-app getting-started node --watch app.js
> ```

Stop and remove the development container before continuing:

```bash
docker rm -f dev-app
```

---

## 2. Data Persistence with Named Volumes

While bind mounts rely on specific host file paths, **Named Volumes** are fully managed by Docker and isolated from the host file structure.

Let's create and inspect a volume:

```bash
docker volume create my-data
```

List all available volumes on your system:

```bash
docker volume ls
```

Inspect the metadata and host mountpoint of the volume:

```bash
docker volume inspect my-data
```

---

## 3. Testing Persistence Across Containers

Let's write data to the volume from one container, destroy that container, and read the data back from a completely new container.

### Step 1: Write data to the volume

Launch a temporary container, mount `my-data` to `/data`, and write a timestamped message:

```bash
docker run -d --name writer -v my-data:/data alpine sh -c "echo 'Hello from Container 1 at $(date)' > /data/message.txt && sleep 300"
```

Verify that the file was created inside `/data`:

```bash
docker exec writer cat /data/message.txt
```

> **Tip: Interactive shell access**
> If you want to connect into the container's interactive shell to inspect or edit files yourself:
> ```bash
> docker exec -it writer sh
> ```
> Inside the shell, you can append your own text or create files:
> ```sh
> echo "Custom note added manually" >> /data/message.txt
> cat /data/message.txt
> exit
> ```

### Step 2: Destroy the container

Remove the writer container completely:

```bash
docker rm -f writer
```

Verify the container is gone:

```bash
docker ps -a
```

### Step 3: Read data from a new container

Start a brand new container mounting the same `my-data` volume to `/data`:

```bash
docker run --rm -v my-data:/data alpine cat /data/message.txt
```

Notice that the message written by the first container is still there! Even though the original container was deleted, the data persisted safely inside the Docker volume.

---

## 4. Bind Mounts vs Volumes Summary

| Feature | Bind Mounts (`-v /host/path:/container/path`) | Named Volumes (`-v volume-name:/container/path`) |
|---|---|---|
| **Host location** | User-specified path anywhere on host | Managed by Docker (`/var/lib/docker/volumes/...`) |
| **Portability** | Lower (depends on host filesystem structure) | High (managed consistently across OS/environments) |
| **Typical Use Case** | Source code editing during local development | Database storage, logs, long-term state persistence |
| **Lifecycle** | Remains in host filesystem | Persists until explicitly removed with `docker volume rm` |

---

## 5. Cleanup

Remove the volume created during this exercise:

```bash
docker volume rm my-data
```

> **Note**
> You cannot remove a volume if it is currently attached to a running or stopped container. Make sure all containers using the volume are removed first.

In the next and final module, we'll review everything you have learned throughout this lab!
