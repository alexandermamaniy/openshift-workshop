# Lab: Getting Started with Docker

Start from zero and learn Docker's core building blocks. You'll run pre-built containers, write a `Dockerfile` to package a Node.js app, build your own image, mount volumes for data persistence and live reloading, and see container immutability and isolation in action.

## Prerequisites

- Docker or Podman installed and running on your system
- Terminal access

## What you'll learn

By completing these lab exercises, you will:

- Understand what containers are and how they differ from virtual machines
- Run containers in the background, inspect their logs and filesystem, and manage their lifecycle
- Write a `Dockerfile` to package an application, using layer caching for fast rebuilds
- Build a custom image with `docker build` and run it as a container
- Mount host directories with bind mounts for real-time development
- Create and attach named volumes for persistent storage
- Optionally publish your image to Docker Hub

## Lab Modules

Follow the lab modules in order:

| #   | Module                           | Guide                                                                | Description                                                                    |
| --- | -------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| 1   | Welcome to Docker                | [01-welcome-to-docker.md](./01-welcome-to-docker.md)                 | Introduction to containers and running your first `hello-world` container      |
| 2   | Running Containers               | [02-running-containers.md](./02-running-containers.md)               | Launch Nginx, inspect logs and internals, and manage the container lifecycle   |
| 3   | Building Your First Image        | [03-building-your-first-image.md](./03-building-your-first-image.md)| Write a `Dockerfile` and build a custom image from a Node.js app               |
| 4   | Running Your App                 | [04-running-your-app.md](./04-running-your-app.md)                   | Run your image, explore container isolation, and optionally push to Docker Hub |
| 5   | Attaching Volumes & Persistence  | [05-attaching-volumes.md](./05-attaching-volumes.md)                 | Work with bind mounts for live reloading and named volumes for persistent data |
| 6   | Recap & Next Steps               | [06-recap.md](./06-recap.md)                                         | Summary of key concepts, cleanup commands, and next steps                      |

## Additional Resources

- [Official Docker Documentation & Guides](https://docs.docker.com/guides/)
