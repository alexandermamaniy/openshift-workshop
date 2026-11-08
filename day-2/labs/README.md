# Day 2 Labs

Hands-on labs to build, deploy, scale and update applications on OpenShift.

| # | Lab | Type | Main topics |
|---|---|---|---|
| 1 | [Coffee Shop Website](coffee-shop-website/README.md) | Required | Binary build, Deployment, Service, Route, rolling update, rollback |
| 2 | [Voting App](voting-app/USE-CASE.md) | Required (4 parts) | Secret, ConfigMap, StatefulSet, PVC, Deployment, Route, HPA |
| 3 | [Dare to Try](dare-to-try/README.md) | Optional | CI/CD with OpenShift Pipelines |

---

## 1. Coffee Shop Website

[`coffee-shop-website`](coffee-shop-website/README.md)

A landing page for a specialty coffee shop, served with Node.js + Express in a container. You build the image inside the cluster with a binary **BuildConfig**, deploy it with a **Deployment** (2 replicas), and expose it with a **Service** and an HTTPS **Route**. You also practice the update cycle: rebuild after a code change, perform a **rolling update**, and **roll back** to a previous revision.

## 2. Voting App

[`voting-app`](voting-app/USE-CASE.md)

A multi-tier online voting system for an election with thousands of voters. Read the business requirements first in [`USE-CASE.md`](voting-app/README.md), then complete the four parts in order:

| Part | Lab | Description |
|---|---|---|
| 2.1 | [Database](voting-app/01-database/README.md) | PostgreSQL deployed with a **StatefulSet** and a **PVC** so votes survive restarts. Credentials in a **Secret**, configuration and the init SQL script in **ConfigMaps**, and a headless **Service**. |
| 2.2 | [Backend REST API](voting-app/02-backend-rest-api/README.md) | Stateless Python HTTP API (`/api/candidates`, `/api/vote`, `/api/results`, health probes). Image built in the cluster, deployed with a **Deployment** (2 replicas) and an internal **Service**. |
| 2.3 | [Frontend Web UI](voting-app/03-frontend-web-ui/README.md) | HTML page served by **nginx** that proxies `/api/` to the API. The only component exposed outside the cluster, through an HTTPS **Route**. |
| 2.4 | [Horizontal Pod Autoscaling](voting-app/04-horizontal-pod-autoscaling/README.md) | **HPAs** for the API and the Web UI, plus a multi-threaded stress-test pod that generates load so you can watch the replicas scale up. |

```
Browser --HTTPS--> Route --> voting-web-ui (nginx) --> voting-api --> voting-db (PostgreSQL + PVC)
```

## 3. Dare to Try (Optional)

[`dare-to-try`](dare-to-try/README.md)

An optional challenge: set up a **CI/CD pipeline with OpenShift Pipelines**. You fork a demo repository on GitLab, clone your fork, and follow the steps in its README. Requires a GitLab account, Docker, a running CRC (OpenShift Local) cluster and the `oc` CLI.
