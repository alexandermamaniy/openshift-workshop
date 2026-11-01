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

```bash
export NAMESPACE=$(oc whoami)-voting-app
oc get statefulset/voting-db secret/voting-db-secret configmap/voting-db-config -n $NAMESPACE
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
cd backend-rest-api

# Create a BuildConfig and an ImageStream (once)
oc new-build --name voting-api --binary --strategy docker -n $NAMESPACE

# Upload this folder and build (the build log is streamed)
oc start-build voting-api --from-dir=. --follow -n $NAMESPACE
```

The log ends with `Push successful`. Check the image:

```bash
oc get imagestream/voting-api -n $NAMESPACE
```

Let the Deployment refer to the image by its short name (`voting-api:latest`):

```bash
oc set image-lookup voting-api -n $NAMESPACE
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
oc apply -f deployment.yaml -n $NAMESPACE
oc apply -f service.yaml    -n $NAMESPACE
```

---

### 5. Verify

```bash
oc rollout status deployment/voting-api -n $NAMESPACE
oc get deploy,pod,svc,endpoints -l app=voting-api -n $NAMESPACE
```

You should see 2 pods `1/1 Running` and two addresses in the Service endpoints.

---

### 6. Test the API

The Service has no Route, so call it from a pod inside the project:

```bash
POD=$(oc get pod -l app=voting-api -n $NAMESPACE -o name | head -1)

oc exec $POD -n $NAMESPACE -- python -c "
import urllib.request
print(urllib.request.urlopen('http://voting-api:8080/api/candidates').read().decode())"
```

Expected output:
```
{"candidates": [{"id": 1, "name": "Candidate A"}, {"id": 2, "name": "Candidate B"}, {"id": 3, "name": "Blank vote"}]}
```

Cast a vote for Candidate A (`candidate_id=1`) and read the results:

```bash
oc exec $POD -n $NAMESPACE -- python -c "
import urllib.request
print(urllib.request.urlopen('http://voting-api:8080/api/vote?voter=ana&candidate_id=1').read().decode())
print(urllib.request.urlopen('http://voting-api:8080/api/results').read().decode())"
```

Expected output:
```
{"status": "voted", "voter": "ana", "candidate_id": 1}
{"results": [{"candidate_id": 1, "name": "Candidate A", "votes": 1}, {"candidate_id": 3, "name": "Blank vote", "votes": 0}, {"candidate_id": 2, "name": "Candidate B", "votes": 0}], "total": 1}
```

Run the same command again: the voter `ana` already voted, so the API answers `409` and Python prints an `HTTP Error 409: Conflict` traceback. That is the database rejecting the duplicate, not a bug in the API.

Or from your machine, with a temporary port-forward (in a second terminal run `oc port-forward svc/voting-api 8080:8080 -n $NAMESPACE`):

```bash
curl -s localhost:8080/api/candidates
curl -s "localhost:8080/api/vote?voter=ana&candidate_id=1"   # 201
curl -s "localhost:8080/api/vote?voter=ana&candidate_id=2"   # 409, already voted
curl -s "localhost:8080/api/vote?voter=bob&candidate_id=99"  # 404, unknown candidate
curl -s "localhost:8080/api/vote?voter=&candidate_id=1"      # 400, invalid voter
curl -s localhost:8080/api/results
```

> `port-forward` talks to **one** pod. To see the load balancing, repeat the `oc exec` call above a few times and compare the logs of each replica (step 7).

---

### 7. Read the logs

The server writes one JSON line per request. Voter names are never logged.

```bash
oc logs -l app=voting-api --prefix --tail=5 -n $NAMESPACE
```

---

### 8. Scale the API

The API holds no state, so scaling it is safe:

```bash
oc scale deployment/voting-api --replicas=4 -n $NAMESPACE
oc get pods -l app=voting-api -n $NAMESPACE
```

Repeat the duplicate vote from step 6: it is still rejected with 409, no matter which replica answers, because the unique constraint lives in the database.

---

### 9. Change the code and redeploy (optional)

Edit `server.py` (for example add a field to a response), then rebuild the image and point the Deployment to the new build:

```bash
# 1. Build again, from the backend-rest-api folder (uploads your changes)
oc start-build voting-api --from-dir=. --follow -n $NAMESPACE

# 2. Make the Deployment use the new image (this starts a rolling update)
oc set image deployment/voting-api api=voting-api:latest -n $NAMESPACE

# 3. Wait for the new pods
oc rollout status deployment/voting-api -n $NAMESPACE
```

Call the API again (step 6) to see your change. During the update the Service only sends traffic to pods that are Ready, so the API keeps answering.

> **Why not just `oc rollout restart`?** `oc set image-lookup` turns `voting-api:latest` into the exact image digest (`...@sha256:...`) when the Deployment is created or changed. A new build moves the `latest` tag, but the Deployment keeps the old digest, so a restart creates new pods with the **same old image**. Running `oc set image ... :latest` resolves the tag again and rolls out the new build.
>
> To check which image the pods run: `oc get pods -l app=voting-api -n $NAMESPACE -o jsonpath='{.items[*].status.containerStatuses[0].imageID}'`

---

### 10. Clean up

Delete only the API and keep the database:

```bash
oc delete -f deployment.yaml -f service.yaml -n $NAMESPACE
oc delete bc/voting-api is/voting-api -n $NAMESPACE
```

Or delete everything, including the database:

```bash
oc delete project $NAMESPACE
```
