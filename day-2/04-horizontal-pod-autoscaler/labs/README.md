# Horizontal Pod Autoscaler (HPA) in OpenShift

The **Horizontal Pod Autoscaler** automatically scales the number of pod replicas in a Deployment based on observed resource utilization (CPU, memory or custom metrics).

Instead of manually scaling your app, the HPA continuously monitors resource usage and adjusts the replica count to keep utilization at the configured target, scaling **out** when load increases and **in** when it drops.

---

## Lab flow

1. Deploy the `hpa-demo` application with CPU and memory resource requests and limits defined.
2. Create an **HPA** targeting 50% average CPU utilization, with a minimum of 2 and a maximum of 6 replicas.
3. Generate artificial load against the app using a load generator pod.
4. Watch the HPA automatically **scale out** the Deployment as CPU usage rises above 50%.
5. Stop the load and watch the HPA **scale back in** after the cooldown period.

---

## Files

| File | Description |
|---|---|
| `hpa/deployment.yaml` | Deployment + Service + Route for `hpa-demo` |
| `hpa/hpa.yaml` | HPA targeting 50% CPU, min 2 / max 6 replicas |

---

## Lab steps

### 0. Set your namespace variable

```bash
export NAMESPACE=$(oc whoami)-hpa
```

---

### 1. Create the project and deploy the application

```bash
oc new-project $NAMESPACE

cd hpa/

oc create -f deployment.yaml -n $NAMESPACE
```

---

### 2. Verify the deployment is running

```bash
oc get pods -n $NAMESPACE -w
```

Check the Service and Route were created:

```bash
oc get svc,route -n $NAMESPACE
```

---

### 3. Create the HPA

```bash
oc create -f hpa.yaml -n $NAMESPACE
```

Watch the HPA initializing — it may show `<unknown>` for a few seconds while it collects metrics:

```bash
oc get hpa -n $NAMESPACE -w
```

Expected output after a few seconds:
```
NAME       REFERENCE             TARGETS   MINPODS   MAXPODS   REPLICAS
hpa-demo   Deployment/hpa-demo   3%/50%    2         6         2
```

> Even with no traffic, the HPA immediately scales up to `minReplicas: 2`.

---

### 4. Get the Route URL

```bash
oc get route hpa-demo -n $NAMESPACE
```

Open the URL in your browser to confirm the app is accessible.

---

### 5. Generate load

Run a load generator pod that sends 100 concurrent requests for 5 minutes to the app:

```bash
oc run loadgen \
  --image=quay.io/ayucra/loadgen:latest \
  --restart=Never \
  --rm -it \
  -- -z 4m -c 100 \
  http://$(oc get route hpa-demo -n $NAMESPACE -o jsonpath='{.spec.host}')
```

---

### 6. Watch the HPA scale out

In a separate terminal, watch the HPA and pods react to the increased load:

```bash
# Watch the HPA metrics and replica count
oc get hpa -n $NAMESPACE -w
```

```bash
# Watch new pods being created
oc get pods -n $NAMESPACE -w
```

Expected output as load increases:
```
NAME       REFERENCE             TARGETS    MINPODS   MAXPODS   REPLICAS
hpa-demo   Deployment/hpa-demo   3%/50%     2         6         2
hpa-demo   Deployment/hpa-demo   85%/50%    2         6         2
hpa-demo   Deployment/hpa-demo   85%/50%    2         6         4
hpa-demo   Deployment/hpa-demo   62%/50%    2         6         5
hpa-demo   Deployment/hpa-demo   48%/50%    2         6         6
```

> The HPA scales out until CPU drops below 50% or until `maxReplicas: 6` is reached.

---

### 7. Watch the HPA scale back in

Once the load generator finishes (or you stop it with `Ctrl+C`), CPU usage drops and the HPA gradually scales back in after a cooldown period (~5 minutes):

```bash
oc get hpa -n $NAMESPACE -w
```

Expected output:
```
NAME       REFERENCE             TARGETS   MINPODS   MAXPODS   REPLICAS
hpa-demo   Deployment/hpa-demo   48%/50%   2         6         6
hpa-demo   Deployment/hpa-demo   12%/50%   2         6         6
hpa-demo   Deployment/hpa-demo   4%/50%    2         6         4
hpa-demo   Deployment/hpa-demo   2%/50%    2         6         2
```

> The HPA never scales below `minReplicas: 2` — even with zero traffic.

---

### 8. Clean up

```bash
oc delete project $NAMESPACE
```
