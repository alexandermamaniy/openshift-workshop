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

Complete these steps **before the workshop begins**. You will need Docker, Docker Compose, oc and crc installed on your machine.

| Guide | Operating System |
|-------|:------:|
| [Docker Installation](./pre-setup/docker-installation.md) | Windows,  macOS,  Fedora |
| [Docker Compose Installation](./pre-setup/docker-compose-installation.md) | Windows, macOS, Fedora |
| [oc and crc Installation](./pre-setup/oc-crc--installation.md) | Windows, macOS, Fedora |
---

You must also have a [GitHub](https://github.com/signup) and [GitLab](https://gitlab.com/-/trial_registrations/new) account

## Day 1 - Containerization and Orchestration 

An introduction to containerization concepts, modern application architecture, hands-on Docker practice, and kubernetes.

### Topics

| # | Topic | Slides | Lab |
|---|-------|--------|-----|
| 01 | Introduction to Containerization | [slide.pdf](./day-1/01-intro-to-containerization/Virtualization-vs-containers-workshop.pdf) | - |
| 02 | Introduction to Docker | [slide.pdf](./day-1/01-intro-to-containerization/Virtualization-vs-containers-workshop.pdf) | [Lab →](./day-1/02-introduction-to-docker/lab/README.md) |
| 03 | Introduction to kubernetes | [slide.pdf](./day-1/introduction-to-kubernetes.pdf) | - |

### Session Summaries

**01 - Introduction to Containerization**
Understand the fundamental differences between virtual machines and containers, and when to use each.

- What is virtualization? Hypervisors, VMs, and their use cases
- What is a container? Namespaces, cgroups, and the Linux kernel
- Use cases for VMs vs containers

---

**02 - Introduction to Docker**
Build and run a containerized web application using Docker.

- What is a Container Image - anatomy of a `Dockerfile`, layers, and build cache
- What is a Container - runtime lifecycle from `created` → `running` → `stopped` → `removed`
- Container Registries - pull and push images; Docker Hub, Quay (Red Hat), OpenShift internal registry
- Docker container lifecycle management - `run`, `stop`, `start`, `rm`, `logs`, `exec`, `inspect`
- Docker Compose - defining and running multi-container applications with a `docker-compose.yml`


**03 - Introduction to kubernetes**

Explore the core and architecture of kubernetes.

- Architecture Overview - Control Plane and Compute Nodes
- Networking 
- Core Objects and API - Namespaces, Pods, Labels, Selectors, Services
- Core workload - ReplicaSet, Deployment, DaemonSet, StatefulSet, Job, CronJob
- Storage - Volumes, PersistenVolumes, PersistenVolumeClaims, StorageClass
- Configurations - ConfigMaps, Secrets


---

## Day 2 - OpenShift Fundamentals

Covers core OpenShift concepts through a series of progressive hands-on labs.

### Topics

| # | Topic | Slides | Lab |
|---|-------|--------|-----|
| 01 | Introduction to OpenShift | [slide.pdf](./day-2/introduction-to-openshift.pdf) | - |
| 02 | Image Streams | - | [Lab →](./day-2/01-image-streams/labs/image-streams/) |
| 03 | OpenShift Deployments | - | [Lab →](./day-2/02-openshift-deployments/labs/basic-deployment/README.md) |
| 04 | OpenShift Storage | - | [Lab →](./day-2/03-openshift-storage/labs/storage/README.md) |
| 05 | Horizontal Pod Autoscaler | - | [Lab →](./day-2/04-horizontal-pod-autoscaler/labs/README.md) |
| 06 | CI/CD with OpenShift Pipelines | - | [Lab →](https://gitlab.com/alexandermamaniy/openshift-demo) |

### Lab Summaries

**01 - Introduction to OpenShift & Image Streams**
Build container images locally, push them to the OpenShift internal registry via Image Streams, and deploy them as running applications on the cluster.

- Build and tag Docker images for three sample web apps (coffee shop, rent-a-car, veterinary clinic)
- Log in to the OpenShift internal registry
- Create an `ImageStream` and push the image
- Deploy from the internal registry using `oc new-app`
- Expose the application with an HTTPS Route

---

**02 - OpenShift Deployments**
Deploy a containerized application to OpenShift using three different approaches, then manage configuration and stateful workloads.

- **Basic Deployment** - deploy `hello-openshift` imperatively (CLI), declaratively (YAML), and via the Web Console; expose with HTTPS Route
- **ConfigMaps & Secrets** - store database credentials in a `Secret` and non-sensitive config in a `ConfigMap`; inject them as environment variables into a PostgreSQL StatefulSet
- **StatefulSets** - observe stable pod names, ordered startup, and per-pod PVCs that survive pod deletion

---

**03 - OpenShift Storage**
Understand the difference between ephemeral and persistent storage and prove that data survives pod restarts.

- Create a `PersistentVolumeClaim` (PVC) backed by `gp3-csi` storage
- Mount the PVC into a running pod at `/data`
- Write a file to the volume, delete the pod, and verify the file survives on the new pod

---

**04 - Horizontal Pod Autoscaler**
Configure automatic scaling based on CPU utilization and observe the HPA react in real time.

- Deploy the `hpa-demo` application with CPU/memory resource requests and limits
- Create an HPA targeting 50% average CPU, min 2 / max 6 replicas
- Generate artificial load using a load generator pod
- Watch the HPA scale out as CPU rises above 50%, then scale back in after the cooldown

---

**05 - CI/CD with OpenShift Pipelines**
Introduction to building automated CI/CD pipelines natively in OpenShift using Tekton.

- Explore the demo application and pipeline configuration
- Review Tekton `Pipeline`, `Task`, and `PipelineRun` resources
- Trigger and monitor a CI/CD pipeline run on OpenShift

---

## Day 3 - IBM and OpenShift AI

An introduction to IBM products on OpenShift and AI/ML capabilities available on the OpenShift platform. From using the GenAI playground UI to building a full end-to-end voice-enabled customer support assistant.

### Topics

| # | Topic | Slides | Lab |
|---|-------|--------|-----|
| 01 | IBM Products on OpenShift | [slide.pdf](./day-3/Introduction%20to%20OpenShift%20AI.pdf) | - |
| 02 | Container Options in IBM | [slide.pdf](./day-3/AI-Containers-IBM.pdf) | - |
| 03 | Introduction to OpenShift AI | [slide.pdf](./day-3/Introduction%20to%20OpenShift%20AI.pdf) | - |
| 04 | RAG with OGX (Open GenAI Stack) | [slide.pdf](./day-3/Introduction%20to%20OpenShift%20AI.pdf) | - |

### Labs

Complete **Lab 00** first to set up your environment. Then follow the labs sequentially.

| Lab | Title | Description |
|-----|-------|-------------|
| 00 | [OpenShift AI Setup](./day-3/00-openshift-ai-setup/lab/) | Environment setup, workbench creation, and feature flags |
| 01 | [GenAI Playground & RAG](./day-3/01-genai-playground-rag/lab/) | Connect a remote model and use RAG through the UI |
| 02 | [PDF Ingestion RAG](./day-3/02-pdf-ingestion-rag/lab/) | Build a programmatic RAG pipeline in a Jupyter notebook |
| 03 | [Red Bank Financial RAG](./day-3/03-redbank-financial-rag/lab/) | End-to-end voice assistant with STT, RAG, and TTS |

### Session Summaries

**01 - IBM Products on OpenShift**
Explore the IBM product portfolio running natively on OpenShift.

- OpenShift Virtualization on IBM Z
- Confidential Containers & Secure Execution
- IBM Fusion Data Foundation & IBM Storage Scale

---

**02 - Container Options in IBM**
Overview of container deployment options available within the IBM ecosystem.

- zCX (Docker and OpenShift)
- Torch Spyre Development
- Example of AI running on a Container Demo

---

**03 - Introduction to OpenShift AI**
Understand the AI/ML platform built into OpenShift and the concepts that power it.

- What is **RAG** (Retrieval-Augmented Generation) and how it works
- Introduction to **OGX** (Open GenAI Stack)
- Connecting to **MaaS** (Model as a Service) LLM endpoints

---

**04 - RAG with OGX (Open GenAI Stack)**
Hands-on walkthrough building an end-to-end RAG pipeline using OGX.

- Setting up the OpenShift AI environment, workbenches, and feature flags
- Using the GenAI Playground UI to connect remote models and experiment with RAG
- Building a programmatic PDF ingestion RAG pipeline in Jupyter notebooks
- Creating a full voice-enabled customer support assistant with Speech-to-Text, RAG, and Text-to-Speech
