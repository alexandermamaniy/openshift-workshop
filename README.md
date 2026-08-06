# OpenShift Workshop

Welcome to the OpenShift Workshop! This repository contains all slides, labs, and setup guides organized by day.

---

## Table of Contents

- [Day 0: Pre-Setup](#pre-setup)
- [Day 1: Introduction to Docker](#day-1--introduction-to-docker)
- [Day 2: OpenShift Fundamentals](#day-2--openshift-fundamentals)
- [Day 3: OpenShift AI](#day-3--openshift-ai)
- [Repository Structure](#repository-structure)

---

## Pre-Setup

Complete these steps **before the workshop begins**. You will need Docker and Docker Compose installed on your machine.

| Guide | Operating System |
|-------|:------:|
| [Docker Installation](./pre-setup/docker-installation.md) | Windows,  macOS,  Fedora |
| [Docker Compose Installation](./pre-setup/docker-compose-installation.md) | Windows, macOS, Fedora |

---

## Day 1 — Introduction to Docker

An introduction to containerization concepts and hands-on Docker practice.

### Topics

| Topic | Slides | Lab |
|-------|--------|-----|
| Introduction to Docker | [slide.pdf](./day-1/introduction-to-docker/slide.pdf) | [Lab →](./day-1/introduction-to-docker/lab/README.md) |

### Lab Summary

**Introduction to Docker**
Build and run a containerized web application (IBMeetingU) using Docker.

- Build a Docker image from a `Dockerfile`
- Run the container locally on port `8080`
- Practice essential Docker commands: `logs`, `stop`, `rm`, `rmi`

---

## Day 2 — OpenShift Fundamentals

Covers core OpenShift concepts through a series of progressive hands-on labs.

### Topics

| # | Topic | Slides | Lab |
|---|-------|--------|-----|
| 01 | Introduction to OpenShift & Image Streams | [slide.pdf](./day-2/01-introduction-to-openshift/slide.pdf) | [Lab →](./day-2/01-introduction-to-openshift/labs/image-streams/) |
| 02 | OpenShift Deployments | [slide.pdf](./day-2/02-openshift-deployments/slide.pdf) | [Lab →](./day-2/02-openshift-deployments/labs/) |
| 03 | OpenShift Storage | [slide.pdf](./day-2/03-openshift-storage/slide.pdf) | [Lab →](./day-2/03-openshift-storage/labs/storage/README.md) |
| 04 | Horizontal Pod Autoscaler | [slide.pdf](./day-2/04-horizontal-pod-autoscaler/slide.pdf) | [Lab →](./day-2/04-horizontal-pod-autoscaler/labs/README.md) |
| 05 | CI/CD with OpenShift Pipelines | [slide.pdf](./day-2/05-CI-CD-with-openshift-pipelines/slide.pdf) | [Lab →](https://gitlab.com/alexandermamaniy/openshift-demo) |

### Lab Summaries

**01 — Introduction to OpenShift & Image Streams**
Build container images locally, push them to the OpenShift internal registry via Image Streams, and deploy them as running applications on the cluster.

- Build and tag Docker images for three sample web apps (coffee shop, rent-a-car, veterinary clinic)
- Log in to the OpenShift internal registry
- Create an `ImageStream` and push the image
- Deploy from the internal registry using `oc new-app`
- Expose the application with an HTTPS Route

---

**02 — OpenShift Deployments**
Deploy a containerized application to OpenShift using three different approaches, then manage configuration and stateful workloads.

- **Basic Deployment** — deploy `hello-openshift` imperatively (CLI), declaratively (YAML), and via the Web Console; expose with HTTPS Route
- **ConfigMaps & Secrets** — store database credentials in a `Secret` and non-sensitive config in a `ConfigMap`; inject them as environment variables into a PostgreSQL StatefulSet
- **StatefulSets** — observe stable pod names, ordered startup, and per-pod PVCs that survive pod deletion

---

**03 — OpenShift Storage**
Understand the difference between ephemeral and persistent storage and prove that data survives pod restarts.

- Create a `PersistentVolumeClaim` (PVC) backed by `gp3-csi` storage
- Mount the PVC into a running pod at `/data`
- Write a file to the volume, delete the pod, and verify the file survives on the new pod

---

**04 — Horizontal Pod Autoscaler**
Configure automatic scaling based on CPU utilization and observe the HPA react in real time.

- Deploy the `hpa-demo` application with CPU/memory resource requests and limits
- Create an HPA targeting 50% average CPU, min 2 / max 6 replicas
- Generate artificial load using a load generator pod
- Watch the HPA scale out as CPU rises above 50%, then scale back in after the cooldown

---

**05 — CI/CD with OpenShift Pipelines**
Introduction to building automated CI/CD pipelines natively in OpenShift using Tekton.

- Explore the demo application and pipeline configuration
- Review Tekton `Pipeline`, `Task`, and `PipelineRun` resources
- Trigger and monitor a CI/CD pipeline run on OpenShift


---

## Day 3 — OpenShift AI

An introduction to AI/ML capabilities available on the OpenShift platform.

| Topic | Slides |
|-------|--------|
| Introduction to OpenShift AI | [slide.pdf](./day-3/Introduction%20to%20OpenShift%20AI.pdf) |

---

## Repository Structure

```
.
├── pre-setup/
│   ├── docker-installation.md          # Docker install guide (Windows, macOS & Fedora)
│   └── docker-compose-installation.md  # Docker Compose install guide (Windows, macOS & Fedora)
│
├── day-1/
│   └── introduction-to-docker/
│       ├── slide.pdf
│       └── lab/
│           ├── Dockerfile
│           └── README.md
│
├── day-2/
│   ├── 01-introduction-to-openshift/
│   │   ├── slide.pdf
│   │   └── labs/image-streams/         # coffee-shop, rent-car, veterinary apps
│   ├── 02-openshift-deployments/
│   │   ├── slide.pdf
│   │   └── labs/
│   │       ├── basic-deployment/       # Imperative, declarative, web console
│   │       ├── configmap-and-secrets/  # Secret + ConfigMap + StatefulSet
│   │       └── statefulset/            # StatefulSet scaling & PVC persistence
│   ├── 03-openshift-storage/
│   │   ├── slide.pdf
│   │   └── labs/storage/               # PVC creation and data persistence
│   ├── 04-horizontal-pod-autoscaler/
│   │   ├── slide.pdf
│   │   └── labs/                       # HPA with load generation
│   └── 05-CI-CD-with-openshift-pipelines/
│       └── slide.pdf
│
└── day-3/
    └── Introduction to OpenShift AI.pdf
```
