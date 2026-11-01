# Voting App: Database (StatefulSet + PVC)

The voting app stores its data in a single PostgreSQL database. In this part you deploy only the database layer: credentials in a **Secret**, configuration in **ConfigMaps**, and a **StatefulSet** with a **PVC** so the votes survive pod restarts.

The database creates its own tables and loads the candidates the first time it starts, so the API does not need to do it.

---

## Lab Flows

1. Create a **Secret** (`voting-db-secret`) holding the database username and a generated password.
2. Create a **ConfigMap** (`voting-db-config`) holding the database name and data directory path.
3. Create a **ConfigMap** (`voting-db-init`) holding the SQL script that creates the tables and loads the candidates.
4. Create a headless **Service** (`voting-db`) that gives the pod a stable DNS name.
5. Deploy the **PostgreSQL StatefulSet**, which reads the variables from the Secret and ConfigMap and mounts the init script and a PVC.

---

## Files

| File | Description |
|---|---|
| `secret.yaml` | Secret with `POSTGRES_USER` and `POSTGRES_PASSWORD` (the password is filled in when you apply it) |
| `configmap.yaml` | ConfigMap with `POSTGRES_DB` and `PGDATA` |
| `init-configmap.yaml` | ConfigMap with the SQL that creates `candidate` and `vote` and inserts the candidates |
| `service.yaml` | Headless Service for the StatefulSet |
| `statefulset.yaml` | StatefulSet that reads env vars from the Secret and ConfigMap and mounts the init script and the PVC |

---

## Data model

| Table | Columns | Rules enforced by the database |
|---|---|---|
| `candidate` | `id`, `name`, `active`, `created_at` | `name` is unique |
| `vote` | `id`, `voter`, `candidate_id`, `created_at` | `voter` is unique (one vote per name), `candidate_id` must exist, `voter` must be lowercase and trimmed |

---

## Lab steps

### 0. Set your namespace variable

```bash
export NAMESPACE=$(oc whoami)-voting-app
```

---

### 1. Create the project

```bash
oc new-project $NAMESPACE
```

---

### 2. Inspect the Secret

Open [`secret.yaml`](secret.yaml) and review its content:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: voting-db-secret
  labels:
    app: voting-db
type: Opaque
stringData:
  POSTGRES_USER: voting
  POSTGRES_PASSWORD: "${POSTGRES_PASSWORD}"
```

> The password is **not** stored in the file. `${POSTGRES_PASSWORD}` is a placeholder that `envsubst` replaces with a random value when you apply it.
>
> Do not run `oc apply -f secret.yaml` directly: it would store the literal text `${POSTGRES_PASSWORD}` as the password.

---

### 3. Inspect the ConfigMaps

Open [`configmap.yaml`](configmap.yaml) and review its content:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: voting-db-config
  labels:
    app: voting-db
data:
  POSTGRES_DB: voting
  PGDATA: /var/lib/postgresql/data/pgdata
```

Open [`init-configmap.yaml`](init-configmap.yaml). The `01-init.sql` key holds the script that creates the tables and loads three candidates. The PostgreSQL image runs every script in `/docker-entrypoint-initdb.d` **only the first time the data volume is empty**.

---

### 4. Apply all resources

Always create the Secret and ConfigMaps **before** the StatefulSet, the pod will fail to start if the referenced resources do not exist.

```bash
POSTGRES_PASSWORD="$(openssl rand -base64 18)" envsubst < secret.yaml | oc apply -n $NAMESPACE -f -

oc apply -f configmap.yaml      -n $NAMESPACE
oc apply -f secret.yaml      -n $NAMESPACE
oc apply -f init-configmap.yaml -n $NAMESPACE
oc apply -f service.yaml        -n $NAMESPACE
oc apply -f statefulset.yaml    -n $NAMESPACE
```

> No `envsubst` on your machine? Create the Secret with this command instead, and skip the first line above:
>
> ```bash
> oc create secret generic voting-db-secret -n $NAMESPACE \
>   --from-literal=POSTGRES_USER=voting \
>   --from-literal=POSTGRES_PASSWORD="$(openssl rand -base64 18)"
> ```

---

### 5. Verify the resources were created

```bash
oc get secret/voting-db-secret -n $NAMESPACE
oc get configmap/voting-db-config configmap/voting-db-init -n $NAMESPACE

oc get sts,pod,pvc,svc -n $NAMESPACE
```

Notice the PVC `data-voting-db-0`: the StatefulSet created it from `volumeClaimTemplates`, one per pod.

Inspect the Secret, notice the values are base64-encoded:

```bash
oc get secret voting-db-secret -n $NAMESPACE -o yaml
```

---

### 6. Verify the env vars are injected into the pod

```bash
# Wait for the pod to be Running and Ready
oc get pods -n $NAMESPACE -w

# Print the environment variables inside the container
oc exec voting-db-0 -n $NAMESPACE -- env | grep POSTGRES
```

Expected output (the password is the random one you generated):
```
POSTGRES_USER=voting
POSTGRES_PASSWORD=<your generated password>
POSTGRES_DB=voting
```

---

### 7. Connect to the database

```bash
oc -n $NAMESPACE rsh voting-db-0
```

```bash
psql -U $POSTGRES_USER -d $POSTGRES_DB
```

Check the tables and the candidates created by the init script:

```sql
\dt
SELECT id, name, active FROM candidate ORDER BY id;
```

Expected output:
```
 id |     name     | active
----+--------------+--------
  1 | Candidate A  | t
  2 | Candidate B  | t
  3 | Blank vote   | t
```

---

### 8. Check the rules the database enforces

Still inside `psql`, cast a vote and then try to vote again with the same name:

```sql
INSERT INTO vote (voter, candidate_id) VALUES ('ana', 1);
INSERT INTO vote (voter, candidate_id) VALUES ('ana', 2);
```

The second insert fails, the database rejects the duplicated voter:
```
ERROR:  duplicate key value violates unique constraint "vote_voter_key"
```

Try a candidate that does not exist, and a name that is not normalized:

```sql
INSERT INTO vote (voter, candidate_id) VALUES ('luis', 99);
INSERT INTO vote (voter, candidate_id) VALUES ('Luis ', 1);
```

Both fail (foreign key and check constraint). Then exit:

```sql
\q
```

```bash
exit
```

> This is why the API does not need to check for duplicates by itself: with several API replicas, the database is the only place that can decide safely.

---

### 9. Check that the data survives a pod restart

```bash
oc delete pod voting-db-0 -n $NAMESPACE
oc get pods -n $NAMESPACE -w
```

The StatefulSet recreates the pod with the **same name** and mounts the **same PVC**. Check that the vote is still there:

```bash
oc exec voting-db-0 -n $NAMESPACE -- psql -U voting -d voting -c "SELECT voter, candidate_id FROM vote;"
```

Expected output:
```
 voter | candidate_id
-------+--------------
 ana   |            1
```

---

### 10. Clean up

```bash
oc delete project $NAMESPACE
```
