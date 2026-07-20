# ConfigMaps and Secrets in OpenShift

Instead of hardcoding values like database names, passwords or URLs directly in your YAML manifests, you store them in dedicated resources and inject them into your pods as environment variables.


---

## Lab Flows

1. Create a **Secret** (`demo-db-secret`) holding the database username and password.
2. Create a **ConfigMap** (`demo-db-config`) holding the database name and data directory path.
3. Update the **PostgreSQL StatefulSet** to read all environment variables from the Secret and ConfigMap instead of hardcoding them in the manifest.

---

## Files

| File | Description |
|---|---|
| `database/secret.yaml` | Secret with `POSTGRES_USER` and `POSTGRES_PASSWORD` |
| `database/configmap.yaml` | ConfigMap with `POSTGRES_DB` and `PGDATA` |
| `database/statefulset-demo.yaml` | StatefulSet that reads env vars from the Secret and ConfigMap |

---

## Lab steps

### 0. Set your namespace variable

```bash
export NAMESPACE=<username>-configmap-secrets
```

---

### 1. Create the project

```bash
oc new-project $NAMESPACE
```

---

### 2. Inspect the Secret

Open [`database/secret.yaml`](database/secret.yaml) and review its content:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: demo-db-secret
type: Opaque
stringData:
  POSTGRES_USER: workshop
  POSTGRES_PASSWORD: workshop123
```

> `stringData` lets you write plain text. OpenShift automatically base64-encodes it when storing it in etcd.

---

### 3. Inspect the ConfigMap

Open [`database/configmap.yaml`](database/configmap.yaml) and review its content:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: demo-db-config
data:
  POSTGRES_DB: workshopdb
  PGDATA: /var/lib/postgresql/data/pgdata
```

---

### 4. Apply all resources

Always create the Secret and ConfigMap **before** the StatefulSet, the pod will fail to start if the referenced resources do not exist.

```bash
cd database/

oc apply -f secret.yaml    -n $NAMESPACE
oc apply -f configmap.yaml -n $NAMESPACE
oc apply -f statefulset-demo.yaml -n $NAMESPACE
```

---

### 5. Verify the resources were created

```bash
oc get secret/demo-db-secret -n $NAMESPACE
oc get configmap/demo-db-config -n $NAMESPACE

oc get sts,pod,pvc -n $NAMESPACE

```

Inspect the Secret, notice the values are base64-encoded:

```bash
oc get secret demo-db-secret -n $NAMESPACE -o yaml
```

Decode a value to verify it:

```bash
oc get secret demo-db-secret -n $NAMESPACE  -o jsonpath='{.data.POSTGRES_PASSWORD}' | base64 -d

# workshop123
```

Inspect the ConfigMap:

```bash
oc get configmap demo-db-config -n $NAMESPACE -o yaml
```

---

### 6. Verify the env vars are injected into the pod

```bash
# Wait for the pod to be Running
oc get pods -n $NAMESPACE -w

# Print all environment variables inside the container
oc exec demo-db-0 -n $NAMESPACE -- env | grep POSTGRES
```

Expected output:
```
POSTGRES_USER=workshop
POSTGRES_PASSWORD=workshop123
POSTGRES_DB=workshopdb
```

---

### 7. Connect to the database

```bash
oc -n $NAMESPACE rsh demo-db-0
```

```bash
psql -U workshop -d workshopdb
```

```sql
SELECT current_user, current_database();
\q
```

Expected output:
```
 current_user | current_database
--------------+-----------------
 workshop         | workshopdb
```


---

### 8. Clean up

```bash
oc delete project $NAMESPACE
```