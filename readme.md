# 🚀 FastAPI + MySQL (Docker) — Quick Setup Notes

## 🧱 Project Setup Flow

### 1. Start containers

```bash
docker compose up --build
```

---

### 2. Run DB migrations

```bash
docker compose exec api alembic upgrade head
```

---

### 3. Create admin user

#### 📄 File: `app/db/init_admin.py`



#### 📄 File: `create_admin.py`



### ▶ Run admin creation

```bash
docker compose exec api python create_admin.py
```

---

## 🗄️ Access MySQL

```bash
docker compose exec db mysql -u root -p
```

```sql
USE ehcidb;
SELECT * FROM users;
```

---

## 💻 Frontend

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## 🔄 Reset everything (if issues)

```bash
docker compose down -v
docker compose up --build
```

---

## ⚙️ Windows (optional fix)

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## 🎯 Correct Order (Final)

1. `docker compose up --build`
2. `alembic upgrade head`
3. `create_admin.py`
4. Check DB (`SELECT * FROM users;`)
5. Run frontend (`npm run dev`)

---

## 🧠 Key Notes

* Always run scripts **inside Docker**
* Tables ≠ Data (must insert manually)
* If DB empty → admin script not run
* If error → reset with `down -v`

---

✅ Backend working
✅ Database working
✅ Admin login ready
