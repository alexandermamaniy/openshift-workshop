# HPA Stress Test

Builds a stress-test image inside the cluster and runs it as an ephemeral pod to trigger the HPA.

```
pod/seed-votes (ephemeral)
    └─ Python ThreadPoolExecutor
           └─ POST http://voting-api:8080/api/vote  (50 threads × 20 000 votes)
```

---

## Files

| File | Description |
|---|---|
| `Dockerfile` | Image definition (UBI9 Python 3.11 + stress.py) |
| `stress.py` | Multi-threaded load generator |
| `hpa-api.yaml` | HPA for the `voting-api` Deployment |
| `hpa-web-ui.yaml` | HPA for the `voting-web-ui` Deployment |

---

## Lab steps

### 1. Set the namespace variable

```bash
export NAMESPACE=$(oc whoami)-voting-app
```

---

### 2. Apply the HPAs

```bash
oc apply -f hpa-api.yaml    -n $NAMESPACE
oc apply -f hpa-web-ui.yaml -n $NAMESPACE

oc get hpa -n $NAMESPACE -w
```

Expected output — both HPAs show `MINPODS` and `MAXPODS`:

```
NAME               REFERENCE                    TARGETS         MINPODS   MAXPODS
voting-api-hpa     Deployment/voting-api        2%/60%          2         8
voting-web-ui-hpa  Deployment/voting-web-ui     1%/50%          2         6
```

---

### 3. Build the stress image in the cluster

```bash
cd day-2/labs/voting-app/04-horizontal-pod-autoscaling

# Create the BuildConfig and ImageStream (once)
oc new-build --name voting-stress --binary --strategy docker -n $NAMESPACE

# Upload this folder and build
oc start-build voting-stress --from-dir=. --follow -n $NAMESPACE

# Enable local ImageStream resolution
oc set image-lookup voting-stress -n $NAMESPACE
```

---

### 4. Run the stress test

In one terminal, start the load:

```bash
oc run seed-votes \
  --image=voting-stress:latest \
  --restart=Never --rm -it \
  -n $NAMESPACE \
  --env="NUM_VOTES=20000" \
  --env="NUM_THREADS=50"
```

In a second terminal, watch the HPA scale up:

```bash
watch -n 3 oc get hpa voting-api-hpa -n $NAMESPACE
```

You should see `REPLICAS` increase from 2 toward 8 as CPU crosses the 60% threshold.

---

### 5. Custom parameters

| Variable | Default | Description |
|---|---|---|
| `NUM_VOTES` | 20000 | Total votes to cast |
| `NUM_THREADS` | 50 | Concurrent threads |
| `API_URL` | `http://voting-api:8080` | API base URL |

```bash
oc run seed-votes \
  --image=voting-stress:latest \
  --restart=Never --rm -it \
  -n $NAMESPACE \
  --env="NUM_VOTES=5000" \
  --env="NUM_THREADS=100"
```

---

### 6. Watch the scale-down

After the pod finishes, the HPA waits 60 seconds (`stabilizationWindowSeconds`) before scaling down, removing one replica every 30 seconds.

```bash
watch -n 5 oc get pods -n $NAMESPACE
```

---

## Why stress the API and not the frontend?

The frontend is nginx serving static files — its CPU stays near zero regardless of traffic. The API does real work on every request: a database query or an `INSERT` into PostgreSQL. That CPU pressure is what triggers the HPA.
