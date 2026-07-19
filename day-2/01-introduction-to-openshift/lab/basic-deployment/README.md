# Introduction to OpenShift

In this lab you will deploy a containerized application on OpenShift using three approaches:
the **imperative** way (CLI commands), the **declarative** way (YAML manifests), and the **web console** (graphical interface).
You will also expose the app via a secure HTTPS Route.

---

## Prerequisites

Make sure you are in the lab directory before running any command:

```bash
cd day-2/01-introduction-to-openshift/lab/basic-deployment/deployment/
```

---

## 1. Log in to the cluster

Open the OpenShift Console in your browser:

```
https://<openshift-cluster-domain>
```

Retrieve your login token from the console:

<img src="images/image.png" alt="Get your login credentials" width="100%"/>

Then log in from the terminal using that token:

```bash
oc login --token=<your-api-token> --server=https://<server.cluster.domain>:443
```

---

## 2. Create your project

Each user gets their own isolated namespace. Replace `<username>` with your assigned username (e.g. `<username>`):

```bash
oc new-project <username>-demo-app
```

> 💡 All subsequent commands use `-n <username>-demo-app` to target your namespace.

---

## 3. Deploy the application

### Option A — Imperative (step by step)

Use this approach to understand what each resource does individually.

```bash
# 1. Create a Deployment and Service from the container image
oc new-app quay.io/openshift/origin-hello-openshift --name=hello-openshift -n <username>-demo-app

# 2. Wait for the pod to be Running
oc get pods -n <username>-demo-app

# 3. Expose the Service as an HTTP Route
oc expose service hello-openshift -n <username>-demo-app

# 4. Enable HTTPS and redirect HTTP → HTTPS
oc patch route hello-openshift -n <username>-demo-app \
  --type=merge \
  -p '{"spec":{"tls":{"termination":"edge","insecureEdgeTerminationPolicy":"Redirect"}}}'

# 5. Verify the Service and Route were created
oc get svc,route -n <username>-demo-app

# 6. (Optional) Inspect the Deployment details
oc describe deployment/hello-openshift -n <username>-demo-app
```

**Clean up** when you are done with this section:

```bash
oc delete route,service,deployment hello-openshift -n <username>-demo-app
```

---

### Option B — Declarative (recommended)

Use this approach in real projects. All resources are defined in YAML files and applied at once.

The following files are already provided in the `deployment/` directory:

| File | What it creates |
|---|---|
| `hello-openshift.yaml` | `Deployment` — runs 2 replicas of the app |
| `service-route.yaml` | `Service` + `Route` with HTTPS edge termination |

```bash
# Apply all manifests in the current directory
oc apply -f . -n <username>-demo-app

# Verify everything is running
oc get pods,svc,route -n <username>-demo-app
```

**Clean up** when you are done:

```bash
oc delete -f . -n <username>-demo-app
```

---



### Option C — Web Console

Use this approach to explore OpenShift visually without writing any commands.

---

**Step 1 — Create a project**

In the top navigation bar, click on the project dropdown and select **Create Project**.

<img src="images/image-0.png" alt="Create project button" width="100%"/>

Fill in the project name as `<username>-demo-app` and click **Create**.

<img src="images/image-1.png" alt="Create project form" width="40%"/>

---

**Step 2 — Create a Deployment**

Navigate to **Workloads → Deployments** and click **Create Deployment**.

<img src="images/image-2.png" alt="Create deployment menu" width="100%"/>

Fill in the form with the following values:
- **Name:** `hello-openshift`
- **Image:** `quay.io/openshift/origin-hello-openshift:latest`
- **Replicas:** `2`
- **Container port:** `8080`

<img src="images/image-3.png" alt="Create deployment form" width="70%"/>

---

**Step 3 — Verify the Deployment**

Once created, confirm that the pods reach the **Running** state before continuing.

<img src="images/image-4.png" alt="Deployment running" width="100%"/>

---

**Step 4 — Create a Service**

Navigate to **Networking → Services** and click **Create Service**.

<img src="images/image-5.png" alt="Create service menu" width="100%"/>

Fill in the form with the following values:
- **Name:** `hello-openshift`
- **Selector:** `app=hello-openshift`
- **Port:** `80`
- **Target port:** `8080`

<img src="images/image-6.png" alt="Create service form" width="50%"/>

---

**Step 5 — Create a Route**

Navigate to **Networking → Routes** and click **Create Route**.

<img src="images/image-7.png" alt="Create route menu" width="100%"/>

Fill in the form with the following values:
- **Name:** `hello-openshift`
- **Service:** `hello-openshift`
- **Target port:** `8080`
- **Security:** check **Secure route**
- **TLS termination:** `Edge`
- **Insecure traffic:** `Redirect`

<img src="images/image-8.png" alt="Create route form" width="50%"/>

---

**Step 6 — Access the application**

Once the Route is created, click the URL shown in the **Location** column to open the app in your browser.

<img src="images/image-9.png" alt="Route URL" width="100%"/>

> 🔒 HTTP requests are automatically redirected to HTTPS.

**Clean up** when you are done:

Navigate to **Home → Projects**, find `<username>-demo-app`, click the three-dot menu and select **Delete Project**.




## 4. Access the application

Get the Route URL and open it in your browser:

```bash
oc get route hello-openshift -n <username>-demo-app
```

The app will be available at:

```
https://hello-openshift-<username>-demo-app.apps.<cluster-domain>
```

> 🔒 HTTP requests are automatically redirected to HTTPS.

