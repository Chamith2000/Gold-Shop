# Gayan Gold House – Full Stack (Frontend + Spring Boot Backend)

This package contains **both** the React frontend and the Spring Boot backend, already configured to work together.

```
gayan-gold-full/
├── backend/          ← Spring Boot + MySQL (Java)
├── frontend/         ← React + Vite (original UI)
├── docker-compose.yml
└── README.md
```

## How they connect

- Frontend runs on **http://localhost:5173**
- Backend runs on **http://localhost:8080**
- All `/api/*` requests from the frontend are **proxied** to the Spring Boot server (see `frontend/vite.config.ts`)

No frontend API path changes are required.

---

## Prerequisites

- **JDK 17+**
- **Maven 3.9+**
- **Node.js 18+** (and npm)
- **Docker** & Docker Compose

---

## 1. Start MySQL

```bash
cd gayan-gold-full
docker compose up -d
```

Wait ~20–30 seconds for MySQL to become healthy.

---

## 2. Start the Spring Boot backend

```bash
cd backend
mvn spring-boot:run
```

Backend: **http://localhost:8080**  
Health check: http://localhost:8080/api/health

Seeded admin accounts:

| Email | Password |
|-------|----------|
| admin@gayangold.com | AdminGold2026! |
| admin@gayangoldhouse.lk | AdminGold2026! |
| customer@example.com | gold123 |

---

## 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend: **http://localhost:5173**

Open the browser → the UI will call the Spring Boot APIs automatically via the Vite proxy.

---

## Quick verification

1. Open http://localhost:5173  
2. Login with `admin@gayangold.com` / `AdminGold2026!`  
3. Browse products / categories (data comes from MySQL via Spring Boot)

---

## Development notes

- **API contract**: The backend matches the existing `src/services/api.ts` endpoints and TypeScript types.
- **CORS**: Backend already allows `localhost:5173`.
- **Token**: Still stored in `localStorage` as `gayan_gold_token` – no change needed.
- **Old Node backend**: Removed from the runtime path. The frontend no longer starts the Express server; it uses pure Vite + Spring Boot.

---

## Production build (optional)

```bash
# Backend
cd backend && mvn clean package -DskipTests
java -jar target/gayan-gold-backend-1.0.0.jar

# Frontend
cd frontend && npm run build
# Serve the `dist/` folder with any static server or nginx
```

When serving the frontend from a different origin, set the backend CORS origins and (if needed) configure the frontend to call the absolute backend URL.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Frontend 502 / network error on /api | Ensure Spring Boot is running on port 8080 |
| MySQL connection refused | `docker compose up -d` and wait for healthy |
| CORS error | Check `app.cors.allowed-origins` in backend |
| Login fails | Use seeded credentials above |

Enjoy Gayan Gold House!
