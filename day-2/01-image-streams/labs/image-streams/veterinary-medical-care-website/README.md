# Petcare — Veterinary & Medical Care Website

A static landing page for a pet care clinic, served with **Node.js + Express** inside a Docker container.

---

## Project structure

```
.
├── Dockerfile       # Multi-stage build (builder + runtime)
├── app.js           # Express server — serves src/ as static files on port 8080
├── package.json     # Dependencies (express)
└── src/
    ├── index.html   # Main page
    ├── styles.css   # All styles
    └── main.js      # Client-side JS (nav toggle, play button)
```

---

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) — no Node.js required on the host
- [oc CLI](https://docs.openshift.com/container-platform/latest/cli_reference/openshift_cli/getting-started-cli.html) — for OpenShift deployment

---

## Run locally

```bash
# Build the image
docker build -t petcare-app:latest .

# Run the container
docker run -d -p 8080:8080 petcare-app:latest

# list container
docker ps

# stop container
docker stop <CONTAINER_ID>

# delete container
docker rm <CONTAINER_ID>
```

Open in your browser: [http://localhost:8080](http://localhost:8080)


---

## Deploy to OpenShift internal registry

Replace `<username>` with your assigned username.

```bash
export OC_USER=<username>
export REGISTRY=default-route-openshift-image-registry.apps.rosa.ibm-rh-workshop.bern.p3.openshiftapps.com
export NAMESPACE=$OC_USER-workshop
export IMAGE=petcare-app
```

### Step 1 — Log in to the cluster

```bash
oc login --token=<your-api-token> --server=https://<server.cluster.domain>:443
```

### Step 2 — Build the image

```bash
docker build -t ${IMAGE}:latest .
```

### Step 3 — Tag the image

> Format: `<registry>/<namespace>/<image-name>:<tag>` — namespace must match your OpenShift project.

```bash
docker tag ${IMAGE}:latest ${REGISTRY}/${NAMESPACE}/${IMAGE}:latest
```

### Step 4 — Log in to the OpenShift registry

> `oc whoami --show-token` retrieves your session token automatically.

```bash
docker login -u $(oc whoami) -p $(oc whoami --show-token) ${REGISTRY}
```

### Step 5 — Create the ImageStream

> It is equired before pushing — the push will fail with `500 Internal Server Error` without this.

```bash
oc create imagestream ${IMAGE} -n ${NAMESPACE}
oc new-project ${NAMESPACE}
```

### Step 6 — Push the image

```bash
docker push ${REGISTRY}/${NAMESPACE}/${IMAGE}:latest
```

### Step 7 — Verify the image exists

```bash
# List ImageStreams in your namespace
oc get imagestream -n ${NAMESPACE}

# Inspect tags and digest
oc describe imagestream ${IMAGE} -n ${NAMESPACE}
```

---

## Create app resources in OpenShift

```bash
# Create Deployment + Service from the internal registry image
oc new-app \
  --image=image-registry.openshift-image-registry.svc:5000/${NAMESPACE}/${IMAGE}:latest \
  --name=${IMAGE} \
  -n ${NAMESPACE}

# Expose with HTTPS Route (HTTP redirects to HTTPS automatically)
oc expose svc/${IMAGE} --port=8080 -n ${NAMESPACE}

oc patch route ${IMAGE} -n ${NAMESPACE} \
  --type=merge \
  -p '{"spec":{"tls":{"termination":"edge","insecureEdgeTerminationPolicy":"Redirect"}}}'

# Get the public URL
oc get route ${IMAGE} -n ${NAMESPACE}
```

---

## Update after code changes

```bash
# Rebuild and push
docker build -t ${IMAGE}:latest .
docker tag ${IMAGE}:latest ${REGISTRY}/${NAMESPACE}/${IMAGE}:latest
docker push ${REGISTRY}/${NAMESPACE}/${IMAGE}:latest

# Trigger a new rollout
oc rollout restart deployment/${IMAGE} -n ${NAMESPACE}
```
