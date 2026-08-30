<div align="center">

  <a href="https://gfg-student-chapter.vercel.app" target="_blank">
    <img src="https://upload.wikimedia.org/wikipedia/commons/4/43/GeeksforGeeks.svg" alt="GeeksforGeeks Official Logo" width="160" height="160" />
  </a>

  # 🚀 GeeksforGeeks Student Chapter — NIET
  ### *Official Community Website & Enterprise Management Portal*

  [![Vercel Deployment](https://img.shields.io/badge/Vercel-Deploys%20Live-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://gfg-student-chapter.vercel.app)
  [![Designed By](https://img.shields.io/badge/Architected%20By-Ashutosh%20Kumar-00E676?style=for-the-badge&logo=linkedin&logoColor=black)](https://www.linkedin.com/in/ashutosh-kumar-92612b236)
  [![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Node.js](https://img.shields.io/badge/Node.js-Express--v4-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)

  <p align="center">
    <b>Official Portal for Noida Institute of Engineering and Technology (NIET)</b><br />
    Featuring a high-performance public community site and a role-based executive management dashboard.
  </p>

  [🌐 Live Production Website](https://gfg-student-chapter.vercel.app) • [👨‍💻 Creator Profile](https://www.linkedin.com/in/ashutosh-kumar-92612b236) • [📖 API Specifications](#-api-specifications)

</div>

---

## 👨‍💻 Lead Architect & Engineer

<div align="center">
  
  ### **Ashutosh Kumar**
  *Lead Full-Stack Engineer, Database Architect & UI/UX Designer*

  [![LinkedIn](https://img.shields.io/badge/LinkedIn-Ashutosh%20Kumar-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ashutosh-kumar-92612b236)
  [![GitHub](https://img.shields.io/badge/GitHub-Ashutosh2245-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Ashutosh2245)

</div>

---

## 🛠️ Complete Technology Stack

<div align="center">

### **Frontend & UI Engineering**
<p align="center">
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" alt="React" width="50" height="50"/> &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/vitejs/vitejs-original.svg" alt="Vite" width="50" height="50"/> &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-original.svg" alt="Tailwind CSS" width="50" height="50"/> &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="JavaScript" width="50" height="50"/> &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original.svg" alt="HTML5" width="50" height="50"/> &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg" alt="CSS3" width="50" height="50"/>
</p>

### **Backend, Database & Cloud Infrastructure**
<p align="center">
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg" alt="Node.js" width="50" height="50"/> &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original.svg" alt="Express" width="50" height="50" style="filter: invert(1);"/> &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original.svg" alt="PostgreSQL" width="50" height="50"/> &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/vercel/vercel-original.svg" alt="Vercel" width="50" height="50" style="filter: invert(1);"/> &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/git/git-original.svg" alt="Git" width="50" height="50"/> &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/github/github-original.svg" alt="GitHub" width="50" height="50" style="filter: invert(1);"/>
</p>

</div>

---

## ⚡ System Architecture

The ecosystem consists of **Two Isolated Core Systems**:

```mermaid
graph TD
    A[Public Visitors & Students] -->|Public Routes| B[Public Website Portal]
    B --> C[Hero & GFG Emblem]
    B --> D[7 Department Showcases]
    B --> E[Universal XP Leaderboard]
    B --> F[Hackathons & Workshops]
    
    G[Authorized Chapter Members] -->|JWT Auth & Security| H[Private Management Portal]
    H -->|President Role| I[Admin Roster Control, Member Onboarding, Edit & Delete]
    H -->|Executive Leadership| J[Chapter Analytics & Audit Logging]
    H -->|Team Lead / Co-Lead| K[Department Tasks, Proof Verification & XP Grants]
    H -->|Member Dashboard| L[Self-Service Profile Photo, Bio & Security Settings]
```

### 1. 🌐 Public Community Portal
- **Hero & Chapter Branding**: Official GeeksforGeeks branding, dynamic statistics counters, and event spotlight banners.
- **7 Department Showcase**: Deep-dive pages for Technical, Social Media, Event Management, Design, Content & Research, Media, and PR teams.
- **Universal Leaderboard**: Live ranking board calculated dynamically from completed tasks, hackathons, and awards.
- **Events Hub**: Direct registration links for flagship 24-hour hackathons and technical bootcamps.

### 2. 🔒 Private Management Portal (RBAC)
- **Zero Public Registration**: Strictly locked to authorized accounts created by the Chapter President.
- **Role Hierarchy**:
  - `PRESIDENT`: Full administrative authority, member account onboarding, force profile edits, account deletions, and system audit logging.
  - `VICE_PRESIDENT` & `COORDINATOR`: Executive analytics, cross-department governance, and strategy monitoring.
  - `LEAD` (Team Leads): Department-scoped task creation, submission verification, and XP distribution.
  - `CO_LEAD` (Co-Leads): Interactive task desk, deliverable proof submissions (GitHub PRs / Google Drive), and profile customization.

---

## 🏛️ 7 Core Operational Departments

| Icon | Department Name | Key Deliverables & Focus |
| :---: | :--- | :--- |
| 💻 | **Technical Team** | Full-stack web apps, system architecture, open-source projects, competitive programming. |
| 📱 | **Social Media Team** | Digital strategy, Instagram Reels video editing, LinkedIn posts, engagement analytics. |
| 🎪 | **Event Management** | 24-hour hackathons, auditorium logistics, speaker scheduling, student registration desks. |
| 🎨 | **Design Team** | UI/UX design systems, Figma wireframes, hackathon poster art, merchandise branding. |
| 📝 | **Content & Research** | GeeksforGeeks technical blogs, newsletters, API specifications, documentation. |
| 🎬 | **Photography & Video** | Cinematography, event aftermovies, Premiere Pro editing, motion graphics animations. |
| 🤝 | **PR & Outreach** | Corporate sponsorships, inter-college alliances, industry guest speaker relations. |

---

## 🔑 Demo Access Credentials

| Role | Email Address | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **👑 President** | `president@gfgniet.ac.in` | `gfgniet2026` | Full Admin Control, Edit/Delete Members, Audit Logs |
| **💻 Tech Lead** | `lead.tech@gfgniet.ac.in` | `gfgniet2026` | Technical Task Creation & Code Review |
| **⚡ Tech Co-Lead** | `colead.tech1@gfgniet.ac.in` | `gfgniet2026` | Task Submissions, Self Profile & Photo Edit |
| **🎨 Design Lead** | `lead.design@gfgniet.ac.in` | `gfgniet2026` | Design Task Creation & Deliverable Verification |

---

## 📡 API Specifications

| Method | Endpoint | Authorization | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Authenticate member credentials & receive JWT token |
| `POST` | `/api/auth/forgot-password` | Public | Request 6-digit email password reset token |
| `POST` | `/api/auth/reset-password` | Public | Verify code & update portal password |
| `GET` | `/api/users` | Public | Retrieve chapter member roster with filters |
| `PUT` | `/api/users/:id` | President | Full administrative profile edit & password reset |
| `DELETE`| `/api/users/:id` | President | Permanent member account deletion |
| `PATCH`| `/api/users/profile/update`| Auth Member| Self-service profile, avatar photo & social update |
| `GET` | `/api/tasks` | Auth Member| Fetch assigned department tasks |
| `POST` | `/api/tasks/:id/submit` | Co-Lead | Submit deliverable proof (GitHub / Google Drive) |
| `GET` | `/api/leaderboard` | Public | Fetch real-time XP rankings |

---

## 💻 Local Setup & Installation

```bash
# 1. Clone repository
git clone https://github.com/Ashutosh2245/gfg-student-chapter.git
cd gfg-student-chapter

# 2. Start Backend API Server
cd backend
npm install
node server.js
# Backend listening on http://localhost:5000

# 3. Start Frontend Dev Server
cd ../frontend
npm install
npm run dev
# Frontend running live on http://localhost:3000
```

---

<div align="center">

  <p>Engineered & Designed with ❤️ by <a href="https://www.linkedin.com/in/ashutosh-kumar-92612b236"><b>Ashutosh Kumar</b></a></p>
  <p>© 2026 GeeksforGeeks Student Chapter NIET. All Rights Reserved.</p>

</div>
