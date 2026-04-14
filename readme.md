
````md
# 🚀 Project Setup Guide

This project is containerized using Docker Compose. Follow the steps below to fully reset, build, and run the application.

---

## 🧹 Full Reset + Rebuild (Recommended)

If you want a completely fresh start (clean database + rebuilt containers), run:

```bash
docker compose down -v
docker compose up --build
````

---

## ⚡ One-Liner (Pro Mode)

You can also run everything in a single command:

```bash
docker compose down -v && docker compose up --build
```

---

## 🧠 What These Commands Do

### 🔻 Stop & Clean

```bash
docker compose down -v
```

* Stops all running containers
* Removes containers
* Deletes associated volumes (⚠️ resets database/data)

---

### 🔺 Build & Start

```bash
docker compose up --build
```

* Rebuilds all images from scratch
* Starts containers
* Applies latest code changes

---

## 🛠️ When to Use This

Use the full reset when:

* Database is corrupted or outdated
* Migrations are broken
* You changed Dockerfile or dependencies
* You want a completely fresh environment

---

## ⚠️ Warning

Using `-v` will **delete all stored data in volumes**, including database records.

---

## 🎯 Quick Summary

> Reset everything → Rebuild everything → Start clean

```bash
docker compose down -v && docker compose up --build
```

---
