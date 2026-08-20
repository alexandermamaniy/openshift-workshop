# Persistent Storage in OpenShift


By default, any data written inside a container is **ephemeral**, it is lost as soon as the pod is deleted or restarted. Persistent storage solves this by attaching an external volume to the pod that survives restarts, rescheduling, and scaling events.

---


## Files

| File | Description |
|---|---|
| `pvc-demo/simple-pvc.yaml` | PVC requesting `1Gi` of `gp3-csi` storage |
| `pvc-demo/deployment-with-pvc.yaml` | Deployment that mounts the PVC at `/data` |

---

## Lab steps

### 0. Set your namespace variable

```bash
export NAMESPACE=$(oc whoami)-storage
```

### 1. Create the project and resources

```bash
oc new-project $NAMESPACE

cd pvc-demo/

oc create -f simple-pvc.yaml
oc create -f deployment-with-pvc.yaml

# Verify the PVC is Bound and the pod is Running
oc get pvc,deployment,pod -n $NAMESPACE
```

> The PVC status should show `Bound`,  meaning OpenShift automatically provisioned and attached a PersistentVolume to it.

---

### 2. Write data into the persistent volume

Open a remote shell inside the running pod:

```bash
oc rsh <pvc-app-pod-name>
```

Once inside the container, write a file to the mounted volume at `/data`:

```bash
sh-5.1$ echo "Important data!" > /data/persistent_data.txt
sh-5.1$ cat /data/persistent_data.txt
```

Type `exit` to leave the shell.

---

### 3. Delete the pod by scaling down to 0

Scale the Deployment to 0 replicas, this terminates and removes the running pod:

```bash
oc scale deployment/pvc-app --replicas=0 -n $NAMESPACE
```

Scale back up to 1 — OpenShift creates a brand new pod and re-attaches the same PVC:

```bash
oc scale deployment/pvc-app --replicas=1 -n $NAMESPACE
```

---

### 4. Verify that the data survived

Wait for the new pod to reach `Running` state, then open a shell again:

```bash
oc get pod -n $NAMESPACE -w

oc rsh <pvc-app-pod-name>
```

Check that the file is still there:

```bash
sh-5.1$ cat /data/persistent_data.txt
# Important data!
```

> The data survived the pod restart because it was stored on the **PersistentVolume**, not inside the container's ephemeral filesystem.

