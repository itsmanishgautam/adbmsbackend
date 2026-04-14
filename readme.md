
````md
# 🚀 Project Setup

## ⚠️ WARNING

```bash
docker compose down -v
````

❌ This will **DELETE ALL DATA** (databases, volumes, uploads).
Use only if you want a full reset.

---

## 🧹 Full Reset (Danger)

```bash
docker compose down -v
docker compose up --build
```

---

## ✔ Safe Restart (Recommended)

```bash
docker compose down
docker compose up --build
```


## To create a admin run

docker compose exec api python create_admin.py

---

## 🔥 Summary

* `down` → safe
* `down -v` → deletes everything (⚠️ dangerous)
* `up --build` → rebuild project

```
```
