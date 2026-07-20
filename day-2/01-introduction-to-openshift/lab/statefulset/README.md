# StatefulSets in OpenShift

Unlike Deployments, a StatefulSet guarantees:
- **Stable, predictable pod names** — `demo-db-0`, `demo-db-1`, `demo-db-2`
- **Ordered startup and shutdown** — pods are created and terminated one at a time
- **A dedicated PersistentVolumeClaim per pod** — each replica gets its own volume that is never shared or reused by another pod

---

## Lab flow

1. Deploy a **PostgreSQL StatefulSet** (`demo-db`) with 1 replica. OpenShift automatically creates `data-demo-db-0` PVC.
2. **Scale up to 3 replicas**, two new pods and two new PVCs are created (`data-demo-db-1`, `data-demo-db-2`).
3. **Scale back down to 1 replica**, pods `demo-db-1` and `demo-db-2` are terminated.
4. Verify that **all 3 PVCs still existed**,  StatefulSets never delete PVCs automatically, preserving the data.

---


## Lab steps

### 0. Set your namespace variable

```bash
export NAMESPACE=<username>-statefulset
```

---

### 1. Create the project and deploy the StatefulSet

```bash
oc new-project $NAMESPACE

cd simple-statefulset/

oc create -f statefulset-demo.yaml -n $NAMESPACE
```

---

### 2. Verify the initial state

Wait for the pod to reach `Running` state:

```bash
oc get pods -w -n $NAMESPACE
```

Check that 1 pod and 1 PVC were created:

```bash
oc get pvc,sts -n $NAMESPACE
```

Expected output:
```
NAME                               STATUS   VOLUME   CAPACITY   ACCESS MODES   STORAGECLASS   AGE
persistentvolumeclaim/data-demo-db-0   Bound    ...      4Gi        RWO            gp3-csi        ...

NAME                        READY   AGE
statefulset.apps/demo-db    1/1     ...
```

> Notice the PVC name: `data-demo-db-0`,  it follows the pattern `<volumeClaimTemplate-name>-<pod-name>`.

---

### 3. Scale up to 3 replicas

```bash
oc scale statefulset demo-db --replicas=3 -n $NAMESPACE
```

Watch the pods come up **one at a time** in order:

```bash
oc get pods -w -n $NAMESPACE
```

Verify that **3 PVCs** were created — one per pod:

```bash
oc get pvc -n $NAMESPACE
```

Expected:
```
data-demo-db-0   Bound   ...
data-demo-db-1   Bound   ...
data-demo-db-2   Bound   ...
```

---

### 4. Scale back down to 1 replica

```bash
oc scale statefulset demo-db --replicas=1 -n $NAMESPACE
```

Verify the pods scaled down:

```bash
oc get pods -n $NAMESPACE
```

Now check the PVCs again:

```bash
oc get pvc -n $NAMESPACE
```

> All **3 PVCs still exist** even though only 1 pod is running. StatefulSets intentionally preserve PVCs to protect data. You must delete them manually if no longer needed.

---

### 5. Connect to the database and create a table with data

Open a shell inside the running pod:

```bash
oc -n $NAMESPACE rsh demo-db-0
```

Connect to PostgreSQL:

```bash
psql -U workshop -d workshopdb
```

Create a `person` table and insert a record:

```sql
-- Create the table
CREATE TABLE person (
  uid  SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  age  INT NOT NULL
);

-- Insert a record
INSERT INTO person (name, age) VALUES ('Alice', 30);

-- Verify the record is there
SELECT * FROM person;
```

Expected output:
```
 uid | name  | age
-----+-------+-----
   1 | Alice |  30
(1 row)
```

Exit the shell:

```bash
\q
exit
```

---

### 6. Scale down to 0 and back up to 1

Scale the StatefulSet to 0, the pod is deleted:

```bash
oc scale statefulset demo-db --replicas=0 -n $NAMESPACE

# Wait until no pods are running
oc get pods -n $NAMESPACE
```

Scale back up to 1, a new pod is created and the same PVC is re-attached:

```bash
oc scale statefulset demo-db --replicas=1 -n $NAMESPACE

# Wait until the pod is Running again
oc get pods -n $NAMESPACE -w
```

---

### 7. Verify the data survived

Open a shell into the new pod:

```bash
oc -n $NAMESPACE rsh demo-db-0 
```

Connect and query the table:

```bash
psql -U workshop -d workshopdb
```

```sql
SELECT * FROM person;
```

Expected output:
```
 uid | name  | age
-----+-------+-----
   1 | Alice |  30
(1 row)
```

```bash
\q
exit
```

> The record is still there! The data persisted because it was stored on the **PersistentVolume** attached to `demo-db-0`, not inside the container's ephemeral filesystem.

---

### 8. Clean up

```bash
oc delete project $NAMESPACE
```


