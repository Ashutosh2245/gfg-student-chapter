# 🚀 GFG Student Chapter NIET — Official Website & Management Portal

Production-ready official web platform and internal management portal for the **GeeksforGeeks Student Chapter at Noida Institute of Engineering and Technology (NIET)**.

---

## 🏗 Architecture Overview

The system consists of two clearly separated domains:

1. **PUBLIC WEBSITE** (`/`, `/about`, `/team`, `/team/:deptSlug`, `/members/:id`, `/events`, `/leaderboard`):
   - Accessible to all students, guests, and external visitors.
   - Showcases chapter mission, leadership, 7 operational departments, upcoming hackathons, and dynamic universal leaderboards.

2. **PRIVATE MANAGEMENT PORTAL** (`/admin/*`, `/dashboard/*`):
   - Restricted exclusively to authorized members created by the President (`PRESIDENT`).
   - **Zero Public Registration**: Account onboarding is strictly handled by the President.
   - Enforces **Strict Department Data Isolation** for Team Leads (`LEAD`) and Co-Leads (`CO_LEAD`).
   - Handles task assignments, proof submissions (GitHub PRs, Drive links, post URLs), reviewer feedback, and automated XP audit distribution.

---

## ⚡ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, React Router v6, Framer Motion, Lucide React icons, Axios.
- **Backend**: Node.js, Express.js REST APIs.
- **Database**: PostgreSQL (DDL schema with PKs, FKs, indexes, constraints) + fallback memory store.
- **Security**: JWT authentication, bcryptjs password hashing, role & department permission middleware.

---

## 🛠 Local Setup & Running Instructions

### 1. Prerequisites
- Node.js `v18.x` or `v20.x`+
- npm `v9.x` or `v10.x`+
- PostgreSQL `v14`+ (Optional, fallback store runs automatically if PostgreSQL is inactive)

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
# Running on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Running on http://localhost:3000
```

---

## 🔒 Pre-Configured Demo Credentials

| Role | Email | Password | Scope & Access |
| :--- | :--- | :--- | :--- |
| **President** | `president@gfgniet.ac.in` | `gfgniet2026` | Full administrative control, member onboarding |
| **Vice President (Tech)** | `vp.tech@gfgniet.ac.in` | `gfgniet2026` | Executive oversight, task review, leaderboard config |
| **Technical Team Lead** | `lead.tech@gfgniet.ac.in` | `gfgniet2026` | Technical department task creation & review queue |
| **Technical Co-Lead** | `colead.tech1@gfgniet.ac.in` | `gfgniet2026` | Task execution, proof submission, personal XP view |
| **Design Team Lead** | `lead.design@gfgniet.ac.in` | `gfgniet2026` | Design department task management & review |

---

## 📡 Key API Health Check

Verify backend status:
```bash
curl http://localhost:5000/api/health
```

Output:
```json
{
  "status": "HEALTHY",
  "service": "GFG Student Chapter NIET Backend API System",
  "timestamp": "2026-08-17T17:27:12.235Z",
  "version": "1.0.0"
}
```

---

## 🌐 Production Deployment (.me domain & custom subdomains)

- **Frontend Target**: `https://gfgniet.me`
- **Backend API Subdomain**: `https://api.gfgniet.me`

To build for production:
```bash
cd frontend
npm run build
```
The output static bundle will be generated in `frontend/dist/`.
