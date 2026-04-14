````markdown
# 🚀 FastAPI + MySQL (Docker) — Super Simple Setup Guide

This guide will help you run the project from scratch step-by-step.

---

# 📦 1. Start Everything (Docker)

Open a terminal in the project folder and run:

```bash
docker compose down
docker compose up --build
````

👉 Wait until you see something like:

```
Uvicorn running on http://0.0.0.0:8000
```

---

# 💻 2. Start Frontend

Open a **NEW terminal**:

```bash
cd frontend
npm install
npm run dev
```

👉 Open in browser:

```
http://localhost:3000
```

---

# 🗄️ 3. Run Database Migrations

After backend is fully running, open another terminal:

```bash
docker compose exec api alembic upgrade head
```

👉 This creates all database tables

---

# 👤 4. Create Admin User

```bash
docker compose exec api python create_admin.py
```

👉 Now you can login using:

```
Email: admin@example.com
Password: admin123
```

👉 Login here:

```
http://localhost:3000/login
```

---

# 🔍 5. Check Database (Optional but Recommended)

Open a new terminal:

```bash
docker compose exec db mysql -u ehci -p
```

👉 Enter password:

```
root
```

Then run:

```sql
show databases;
use ehcidb;
show tables;
select * from users;
```

👉 You should see the admin user

---

# 🎲 6. Add Fake Data (Seeder)

Open a new terminal:

```bash
docker exec -it adbmsbackend-api-1 bash
```

Then:

```bash
cd /code/adbmsbackend
ls
```

👉 You will see a `scripts` folder

Now run:

```bash
python scripts/seed_faker.py
```

👉 🎉 Fake data added to database!

---

# 🔄 7. Reset Everything (If Something Breaks)

If things stop working, run:

```bash
docker compose down -v
docker compose up --build
```

Then repeat:

1. Migrations
2. Create admin
3. Run frontend

---

# 🧠 Important Tips

* Always run backend commands using:

  ```bash
  docker compose exec api ...
  ```

* If login doesn’t work:
  👉 Run `create_admin.py` again

* If database is empty:
  👉 You forgot to run migrations or admin script

* If frontend doesn’t open:
  👉 Make sure `npm run dev` is running

---

# ✅ That’s It!

If you followed all steps:

✔ Backend running
✔ Database connected
✔ Admin user created
✔ Frontend working
✔ Fake data loaded

---

You’re ready to go 🚀

```
```



### Future Work::

---

# ⚠️ Known Issues & Fix Tomorrow

Here are some small issues found during setup that should be fixed:

### 1. 👤 Login sometimes fails
- Users may not be able to log in even with correct credentials
- Possible causes:
  - Password hashing mismatch
  - Admin/user not properly created in DB
- Fix:
  - Verify password hashing logic
  - Ensure user exists in database before login

---

### 2. 🗄️ Data not found errors
- App tries to fetch data but returns empty / “not found”
- Possible causes:
  - Tables exist but no data inside
  - Seeder not run
- Fix:
  - Ensure seed script runs correctly
  - Add fallback handling for empty data

---

### 3. 🔄 Data inconsistency after reset
- After `docker compose down -v`, all data is lost
- This breaks login and existing users
- Fix:
  - Automatically create admin on startup OR
  - Always re-run `create_admin.py` after reset

---

### 4. 📜 Logs not showing
- Activity logs may return empty even after actions
- Possible causes:
  - Logging logic not implemented properly
  - Logs not being saved to DB
- Fix:
  - Verify backend logging logic
  - Ensure logs table is being written to

---

### 5. 🔌 Backend-Frontend sync issues
- Frontend may fail to fetch correct data
- Possible causes:
  - API endpoints mismatch
  - Incorrect request/response format
- Fix:
  - Check API routes
  - Validate responses in browser network tab

---

### 6. ⚙️ Hardcoded credentials / configs
- Some values like DB password or admin login are fixed
- This can break in different environments
- Fix:
  - Move configs to `.env` file
  - Use environment variables properly

---

### 7. 🐳 Manual steps required
- Some steps (migrations, admin creation) are manual
- Easy to forget → causes errors
- Fix:
  - Automate with entrypoint script or startup script

---

# 🧠 Reminder

Most issues are not code bugs, but:
- Missing data
- Wrong order of steps
- Environment reset

Fixing these will make the system stable ✅

