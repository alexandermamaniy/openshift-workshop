# Running Your App 🚀

The image is built. Now run it!

## Launch your container

```bash
docker run -d -p 3000:3000 --name my-app getting-started
```

Once the container has started, view the site at http://localhost:3000.

You should see your containerized Node.js app in the browser. Notice the **Container Hostname** displayed on the page — that's the container's unique ID, assigned automatically by Docker.

> **Tip**
> The hostname inside a container defaults to a short hash of the container ID. You can override it with `--hostname` if you want something more readable.

## Containers are isolated

Because containers are isolated, you can run multiple instances of the same image side by side without conflict. Start a second container from the same image on a different host port:

```bash
docker run -d -p 3001:3000 --name my-app-2 getting-started
```

Both containers serve the same application but report different hostnames. They share the same image but have completely separate writable layers, processes, and network namespaces.

Confirm both are running:

```bash
docker ps
```

## Viewing logs

Check what your app has logged since it started:

```bash
docker logs my-app
```

Follow the logs in real time (press `Ctrl+C` to stop):

```bash
docker logs -f my-app
```

## Containers don't see your host files

Make a small change: open [app.js](app.js) and change the heading from `Hello from Docker!` to something else. Save the file, then refresh the browser tab.

Nothing changed in the browser — and that's correct. The running container was built from an image that captured your files at build time. Changing the source on the host does **not** affect the running container.

To get your changes into a container, you rebuild the image:

```bash
docker build -t getting-started:v2 .
```

Then run a new container from the updated image:

```bash
docker run -d -p 3002:3000 --name my-app-v2 getting-started:v2
```

> **Important**
> This is a fundamental property of containers: **images are immutable**. You always create a new image to update your app, then replace the container. This makes deployments predictable and rollbacks straightforward.

## Clean up

Stop and remove all the containers you created in this section:

```bash
docker stop my-app my-app-2 my-app-v2
```

```bash
docker rm my-app my-app-2 my-app-v2
```

## (Optional) Push to Docker Hub

If you have a Docker Hub account, you can publish your image so it's accessible from anywhere in the world.

Set your Docker Hub username and retag the image:

```bash
docker tag getting-started <your-dockerhub-username>/getting-started:latest
```

Log in and push:

```bash
docker login
docker push <your-dockerhub-username>/getting-started:latest
```

> **Warning**
> Replace `<your-dockerhub-username>` with your actual Docker Hub username before running these commands.
