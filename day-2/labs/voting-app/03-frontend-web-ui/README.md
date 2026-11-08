# Voting App: Web UI (Deployment + Service + Route)

The Web UI is a plain HTML page served by **nginx**. It shows a form with the voter name and the list of candidates, and it shows the results. It is the only part of the voting app that is exposed outside the cluster, through a **Route**.

In this part you build the image **inside the cluster** (same as the API), push it to the internal registry, and deploy it.

```
Browser --HTTPS--> Route --> Service voting-web-ui --> nginx pods
                                                          | /api/*
                                                          v
                                          Service voting-api --> API pods --> voting-db
```

The browser only talks to nginx. nginx forwards every `/api/` request to the `voting-api` Service, so the API and the database never need a public address.

---

## Lab Flows

1. Build the image from the `Dockerfile` with a binary **BuildConfig**; the result goes to the internal registry as an **ImageStream**.
2. Deploy the Web UI as a **Deployment** with 2 replicas.
3. Create a **Service** (`voting-web-ui`) and a **Route** that exposes it with HTTPS.
4. Open the Route in the browser and vote.

---

## Files

| File | Description |
|---|---|
| `index.html` | The page: voting form, candidate list and results |
| `app.js` | Loads the candidates and results and sends the vote to `/api/vote` |
| `style.css` | Styles (light blue banner, IBM blue buttons, Red Hat red accent) |
| `images/` | Red Hat and IBM logos shown in the page footer (`IBM-logo.jpg` is the original, `ibm-logo-cropped.png` is the trimmed version used by the page) |
| `api-proxy.conf` | nginx rule that forwards `/api/` to the `voting-api` Service |
| `Dockerfile` | Image definition (Red Hat UBI 9 nginx, non-root user, port 8080) |
| `deployment.yaml` | Deployment with 2 replicas and health probes |
| `service-route.yaml` | Service on port 8080 and a Route with edge TLS |

---

## Lab steps

### 0. Use the voting-app project

```bash
export NAMESPACE=$(oc whoami)-voting-app

# Make sure you are at the right directory
cd day-2/labs/voting-app/03-frontend-web-ui
```

The Web UI calls the API by its Service name, so it must run in the **same project** as the database and the API (the project created in the database lab). Deploy the [database](../01-database/README.md) and the [backend REST API](../02-backend-rest-api/README.md) first, then come back here.

```bash
# Verify the API is ready before continuing:
oc get deployment/voting-api service/voting-api -n $NAMESPACE
```

> **Expected output:** both resources show as `Ready`. If you see `Error from server (NotFound)` it means the backend API has not been deployed yet — go to [02-backend-rest-api/README.md](../02-backend-rest-api/README.md) first and come back here once that step is done.

---

### 1. Inspect the Dockerfile and the proxy rule

Open [`Dockerfile`](Dockerfile):

```dockerfile
FROM registry.access.redhat.com/ubi9/nginx-124:latest
COPY index.html app.js style.css /opt/app-root/src/
COPY images/redhat-logo.png images/ibm-logo-cropped.png /opt/app-root/src/images/
COPY api-proxy.conf /opt/app-root/etc/nginx.default.d/api-proxy.conf
EXPOSE 8080
USER 1001
CMD ["nginx", "-g", "daemon off;"]
```

Open [`api-proxy.conf`](api-proxy.conf):

```nginx
location /api/ {
    proxy_pass http://voting-api:8080;
    ...
}
```

> `voting-api` is the name of the API Service. Inside the project, the cluster DNS resolves it to the API pods.

---

### 2. Build the image in the cluster

```bash

# Create a BuildConfig and an ImageStream (once)
oc new-build --name voting-web-ui --binary --strategy docker -n $NAMESPACE

# Upload this folder and build (the build log is streamed)
oc start-build voting-web-ui --from-dir=. --follow -n $NAMESPACE
```

The log ends with `Push successful`. Check the image and let the Deployment refer to it by its short name:

```bash
oc get imagestream/voting-web-ui -n $NAMESPACE
oc set image-lookup voting-web-ui -n $NAMESPACE
```

---

### 3. Apply the resources

```bash
oc apply -f deployment.yaml    -n $NAMESPACE
oc apply -f service-route.yaml -n $NAMESPACE
```

---

### 4. Verify

```bash
oc rollout status deployment/voting-web-ui -n $NAMESPACE
oc get deploy,pod,svc,route -l app=voting-web-ui -n $NAMESPACE
```

You should see 2 pods `1/1 Running` and a Route with an HTTPS host name.

---

### 5. Open the app and vote

Get the URL:

```bash
echo "https://$(oc get route voting-web-ui -n $NAMESPACE -o jsonpath='{.spec.host}')"
```

Open it in your browser:

1. Type your name and choose a candidate.
2. Click **Vote**. You see a confirmation and the results are updated.
3. Vote again with the same name. The page shows `this voter has already voted`: the database rejected the duplicate.

---

### 6. Scale each layer on its own

The three layers are independent:

```bash
oc scale deployment/voting-web-ui --replicas=3 -n $NAMESPACE
oc scale deployment/voting-api    --replicas=4 -n $NAMESPACE
oc get pods -n $NAMESPACE
```

The Route spreads the traffic across the Web UI pods, and each Web UI pod spreads it across the API pods.

---

### 7. Change the page and redeploy (optional)

Edit any file in this folder (for example the title in `index.html`), then rebuild the image and point the Deployment to the new build:

```bash
# 1. Build again (uploads the folder with your changes)
oc start-build voting-web-ui --from-dir=. --follow -n $NAMESPACE

# 2. Make the Deployment use the new image (this starts a rolling update)
oc set image deployment/voting-web-ui web=voting-web-ui:latest -n $NAMESPACE

# 3. Wait for the new pods
oc rollout status deployment/voting-web-ui -n $NAMESPACE
```

Reload the page in your browser (`Ctrl+Shift+R` to skip the browser cache) to see your changes.
