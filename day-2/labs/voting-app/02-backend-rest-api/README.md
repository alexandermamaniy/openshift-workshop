# Voting App: Backend REST API (Deployment + Service)

The API is a small Python HTTP server (no web framework) that stores the votes in the database. It is stateless, so you can run as many replicas as you want: the database decides whether a vote is valid.

In this part you build the container image **inside the cluster**, push it to the internal registry, and deploy it with a **Deployment** and a **Service**. It only needs the Secret and ConfigMap created by the database lab.

---

## Lab Flows

1. Build the image from the `Dockerfile` with a binary **BuildConfig**; the result goes to the internal registry as an **ImageStream**.
2. Deploy the API as a **Deployment** with 2 replicas that reads the database credentials from the existing Secret and ConfigMap.
3. Create a **Service** (`voting-api`) so other pods can reach the API by name.
4. Test the endpoints from inside the cluster.

---

## Files

| File | Description |
|---|---|
| `server.py` | The HTTP server (Python standard library + `psycopg`), GET only |
| `requirements.txt` | Pinned Python dependency |
| `Dockerfile` | Image definition (Red Hat UBI 9 Python, non-root user) |
| `deployment.yaml` | Deployment with 2 replicas, env vars from the Secret and ConfigMap, health probes |
| `service.yaml` | Internal Service on port 8080 |

---

## Endpoints

| Endpoint | Description | Responses |
|---|---|---|
| `/health` | The process is alive (liveness probe) | 200 |
| `/ready` | The database is reachable (readiness probe) | 200, 503 |
| `/api/candidates` | List of active candidates | 200 |
| `/api/vote?voter=NAME&candidate_id=N` | Cast a vote | 201, 400 invalid input, 404 unknown candidate, 409 already voted |
| `/api/results` | Votes per candidate | 200 |

Any other HTTP method returns 405. Every response carries an `X-Pod-Name` header, so you can see which replica answered.

---

## Lab steps

### 0. Use the database project

The API reads the Secret and ConfigMap of the database lab, so it must run in the **same project**. If you cleaned it up, repeat the database lab first.

**Linux / macOS:**

```bash
export NAMESPACE=$(oc whoami)-voting-app
oc project $NAMESPACE

# Make sure you are at this directory
cd day-2/labs/voting-app/02-backend-rest-api
```

**Windows (PowerShell):**

```powershell
# Replace <username> with your username (e.g. developer)
$env:NAMESPACE = "<username>-voting-app"
oc project $env:NAMESPACE

# Make sure you are at this directory
cd day-2\labs\voting-app\02-backend-rest-api
```

Confirm that the database is up:

```bash
oc get statefulset/voting-db secret/voting-db-secret configmap/voting-db-config
```

---

### 1. Inspect the Dockerfile

Open [`Dockerfile`](Dockerfile):

```dockerfile
FROM registry.access.redhat.com/ubi9/python-312-minimal:latest
WORKDIR /opt/app-root/src
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY server.py .
ENV BIND_ADDRESS=0.0.0.0 \
    PORT=8080
EXPOSE 8080
USER 1001
CMD ["python", "server.py"]
```

> `server.py` listens on `127.0.0.1` by default. Inside a container it must listen on all interfaces so the Service can reach it, hence `BIND_ADDRESS=0.0.0.0`.

---

### 2. Build the image in the cluster

The internal registry address (`image-registry.openshift-image-registry.svc:5000`) only works **inside** the cluster, so you cannot push from your laptop. Let OpenShift build it:

```bash
# Create a BuildConfig and an ImageStream (once)
oc new-build --name voting-api --binary --strategy docker

# Upload this folder and build (the build log is streamed)
oc start-build voting-api --from-dir=. --follow
```

The log ends with `Push successful`. Check the image:

```bash
oc get imagestream/voting-api
```

Let the Deployment refer to the image by its short name (`voting-api:latest`):

```bash
oc set image-lookup voting-api
```

---

### 3. Inspect the Deployment

Open [`deployment.yaml`](deployment.yaml). Notice:

- `POSTGRES_USER` and `POSTGRES_PASSWORD` come from `voting-db-secret` (`secretKeyRef`).
- `POSTGRES_DB` comes from `voting-db-config` (`configMapKeyRef`).
- `DB_HOST: voting-db` is the name of the database Service.
- `livenessProbe` calls `/health`, `readinessProbe` calls `/ready`. A pod that cannot reach the database is removed from the Service until it can.

---

### 4. Apply the resources

```bash
oc apply -f deployment.yaml
oc apply -f service.yaml
```

---

### 5. Verify

```bash
oc rollout status deployment/voting-api
oc get deploy,pod,svc,endpoints -l app=voting-api
```

You should see 2 pods `1/1 Running` and two addresses in the Service endpoints.

---

### 6. Test the API

The Service has no Route, so call it from a pod inside the project:

```bash
oc exec deployment/voting-api -- python -c "import urllib.request; print(urllib.request.urlopen('http://voting-api:8080/api/candidates').read().decode())"
```

Expected output:
```
{"candidates": [{"id": 1, "name": "Candidate A"}, {"id": 2, "name": "Candidate B"}, {"id": 3, "name": "Blank vote"}]}
```
---

### 7. Read the logs

The server writes one JSON line per request. Voter names are never logged.

```bash
oc logs -l app=voting-api --prefix --tail=5
```

---

### 8. Scale the API

The API holds no state, so scaling it is safe:

```bash
oc scale deployment/voting-api --replicas=4
oc get pods -l app=voting-api
```
