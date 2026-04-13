# Simple full-stack web app

This workspace contains a **React** frontend and a **Node.js (Express)** backend connected over HTTP. The backend persists data in **MySQL** using **Sequelize**. The frontend uses **Redux Toolkit** for auth state, **TanStack React Query** for server state (users and products lists), and **Formik** with **Yup** for the login form.

## Project layout

| Path | Role |
|------|------|
| `backend/` | REST API: Express, Sequelize, JWT login |
| `frontend/` | SPA: Vite + React, Redux, React Query, Formik |
| `DOCUMENTATION.md` | This file |

## Prerequisites

- **Node.js** 18 or newer  
- **MySQL** 8 (or compatible) with permission to create a database  

## Backend setup

1. Create a MySQL database (example name matches the default in config):

   ```sql
   CREATE DATABASE simple_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. Copy environment variables:

   ```bash
   cd backend
   copy .env.example .env
   ```

   On macOS or Linux, use `cp .env.example .env` instead of `copy`.

3. Edit `backend/.env` and set at least:

   - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` so Sequelize can connect  
   - `JWT_SECRET` to a long random string (never commit real secrets)  

4. Install dependencies and start the API:

   ```bash
   npm install
   npm run dev
   ```

   The server listens on `http://localhost:4000` by default (`PORT` in `.env`).

5. **First run:** Sequelize `sync` runs in development (`alter` enabled in `server.js` when `NODE_ENV=development`). If the `users` table is empty, the server seeds:

   - **Admin user:** `admin@example.com` / `admin123`  
   - Two sample **products**  

6. **Health check:** `GET http://localhost:4000/health`  

### API overview (all JSON under `/api`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/login` | No | Body: `{ "email", "password" }` → `{ token, user }` |
| GET | `/api/users` | Bearer JWT | List users |
| GET | `/api/users/:id` | Bearer JWT | Get one user |
| POST | `/api/users` | Bearer JWT | Create user (`email`, `password`, `name`) |
| PATCH | `/api/users/:id` | Bearer JWT | Update (`email`, `name`, optional `password`) |
| DELETE | `/api/users/:id` | Bearer JWT | Delete user |
| GET | `/api/products` | Bearer JWT | List products |
| GET | `/api/products/:id` | Bearer JWT | Get one product |
| POST | `/api/products` | Bearer JWT | Create (`name`, `price`, `stock`, optional `description`) |
| PATCH | `/api/products/:id` | Bearer JWT | Update fields |
| DELETE | `/api/products/:id` | Bearer JWT | Delete product |

Send `Authorization: Bearer <token>` for protected routes.

### Backend conventions

- **Layering:** `routes` → `controllers` (thin) → `services` (business logic) → `models`  
- **Async errors:** route handlers are wrapped with `asyncHandler` so rejected promises reach the centralized error middleware  
- **Passwords:** stored as bcrypt hashes; the default Sequelize scope excludes `passwordHash` from queries  

## Frontend setup

1. Optional: copy `frontend/.env.example` to `frontend/.env` if you need a custom API base URL.

2. Install and run the dev server:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   The app is served at `http://localhost:5173`.

3. **Development API calls:** `vite.config.js` proxies `/api` to `http://localhost:4000`, and `src/api/client.js` uses `baseURL` `/api` when `VITE_API_URL` is unset. Start the backend on port 4000 for this to work.

4. **Production build:** set `VITE_API_URL` to the full public API base (for example `https://api.example.com/api`), then:

   ```bash
   npm run build
   npm run preview
   ```

### Frontend pages

- **`/login`** — Formik + Yup validation; on success, Redux stores the JWT and user, and localStorage persists the session.  
- **`/products`** — React Query fetches `/api/products` (requires login).  
- **`/users`** — React Query fetches `/api/users` (requires login).  

Unauthenticated users are redirected to `/login`. The Axios response interceptor clears the session on **401** responses except for the login request, so expired tokens do not leave stale UI state.

## Connecting frontend and backend

1. Run MySQL and the backend with a valid `.env`.  
2. Run the frontend dev server.  
3. Open `http://localhost:5173`, sign in with the seeded admin (or any user you create via the API).  
4. Open **Products** and **Users** to verify lists load from MySQL through the API.

CORS is restricted to `FRONTEND_URL` (default `http://localhost:5173`) in `backend/src/app.js`.

## Libraries used

**Backend:** express, sequelize, mysql2, cors, dotenv, bcryptjs, jsonwebtoken  

**Frontend:** react, react-dom, react-router-dom, @reduxjs/toolkit, react-redux, @tanstack/react-query, axios, formik, yup, vite  

## Security notes (production)

- Use strong `JWT_SECRET`, HTTPS, and secure cookie or token storage policies appropriate to your threat model.  
- Replace `sequelize.sync({ alter: true })` with **migrations** for production schema management.  
- Add rate limiting, input validation, and role-based authorization as your product grows.  

## Troubleshooting

- **ECONNREFUSED / proxy errors:** ensure the backend is running on the host/port expected by Vite’s proxy (`vite.config.js`).  
- **Access denied for MySQL user:** verify `DB_USER` / `DB_PASSWORD` and that the user has rights on `DB_NAME`.  
- **401 on products/users:** log in again; the JWT may be missing or expired.  
