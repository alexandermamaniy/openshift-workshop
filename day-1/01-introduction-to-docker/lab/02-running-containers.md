# Running Containers 🏃

`hello-world` does its job, but it exits immediately. Real applications stay running and serve traffic. In this section, you'll launch nginx — a popular web server — as a background container, inspect it, and clean up when you're done.

## Starting nginx

Run this command to start an nginx container in the background:

```bash
docker run -d -p 8080:80 --name my-nginx nginx
```

Breaking it down:

| Part | Meaning |
|------|---------|
| `-d` | **Detached** — run in the background, return the terminal to you |
| `-p 8080:80` | **Port mapping** — forward host port `8080` to container port `80` |
| `--name my-nginx` | Give the container a friendly name instead of a random one |
| `nginx` | The image to use (pulled from Docker Hub automatically) |

> **Tip**
> Port mapping follows the format `HOST:CONTAINER`. So `-p 8080:80` means: "traffic arriving on my port 8080 should be forwarded into the container's port 80."

Open nginx by going to http://localhost:8080 (you might need to refresh the page if you don't see anything)

You should see the **Welcome to nginx!** page — that page is being served from inside a container.

## Inspecting Running Containers

See all currently running containers:

```bash
docker ps
```

You'll see `my-nginx` listed with its image, status, the port mapping, and how long it's been running.

To see the container's log output:

```bash
docker logs my-nginx
```

Each time you loaded the nginx page in the browser, nginx logged the request. You can follow the logs in real time with:

```bash
docker logs -f my-nginx
```

Press `Ctrl+C` to stop following the logs.

## Inspecting the Container's Internals

You can run a command inside a running container with `docker exec`. There's no need to open an interactive shell — you can pass the command directly:

```bash
docker exec my-nginx ls /usr/share/nginx/html
```

This lists the files nginx is serving. The `index.html` you just saw in the browser is right there inside the container's filesystem.

```bash
docker exec my-nginx cat /etc/nginx/nginx.conf
```

This prints the nginx config file from inside the container. No SSH, no VM — just `docker exec`.

> **Note**
> `docker exec` runs a one-off command in a running container. For interactive debugging you can also do `docker exec -it my-nginx bash` to open a full shell session, but passing commands directly is often faster for quick inspections.

## Stopping and Removing Containers

When you're done with a container, stop it:

```bash
docker stop my-nginx
```

The container still exists after being stopped — it's just not running anymore. Check with:

```bash
docker ps -a
```

The `-a` flag shows **all** containers, including stopped ones. You'll see `my-nginx` with status `Exited`.

To remove the container entirely:

```bash
docker rm my-nginx
```

> **Tip**
> You can combine stop and remove in one step: `docker rm -f my-nginx`. The `-f` flag forces removal even if the container is still running.

## Images vs Containers

Before moving on, it's worth being clear on the distinction:

| | **Image** | **Container** |
|-|-----------|---------------|
| What it is | Immutable blueprint / template | A running (or stopped) instance of an image |
| Created by | `docker build` or `docker pull` | `docker run` |
| Listed by | `docker images` | `docker ps -a` |
| Removed by | `docker rmi` | `docker rm` |

Multiple containers can be created from the same image — each gets its own isolated writable layer on top of the shared read-only image layers.

See all images on your machine:

```bash
docker images
```

You now know how to run, inspect, and clean up containers. In the next section, you'll stop using other people's images and build one of your own.
