# 🎓 ClassHub V2 — Class Routine Management System

[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge&logo=github)](https://github.com/Abid-Al-Hossain/Class_Routine_Management_System_V2)
[![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646cff?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Zustand](https://img.shields.io/badge/State-Zustand-orange?style=for-the-badge)](https://zustand-demo.pmnd.rs/)

**ClassHub V2** is a full-featured, intelligent Class Routine Management System built for modern academic institutions. It provides role-based dashboards for Coordinators, Teachers, Class Representatives, and Students — all with a premium, glassmorphic UI and zero backend requirement thanks to its Local-First architecture.

---

## 🚀 Architecture: Local-First

Originally a Node.js/MongoDB application, **V2** migrates entirely to a **Local-First Architecture**:

- **Zero Latency**: All data is read/written directly to `localStorage` via a custom utility, delivering instant interactions.
- **Persistent Sessions**: Active login sessions and all application data persist across browser refreshes.
- **Static-Hosting Ready**: Deployable to GitHub Pages, Vercel, or Netlify with no backend configuration.
- **Zustand State Management**: Four dedicated stores (`authStore`, `routineStore`, `notificationStore`, `chatStore`) keep the application state reactive and consistent.

---

## 🎭 Role-Based Dashboards

ClassHub V2 provides deeply tailored dashboards for four distinct roles:

### 🏛️ 1. Course Coordinator

The power-user dashboard with full institutional control.

- **Create & Manage Routines**: Build full weekly class schedules using the `RoutineCreator` component with per-day, per-slot control including lab session support.
- **View & Clear Routines**: Switch between a creation view and a read-only viewer. Clear the entire routine with a single click.
- **Schedule Change Requests**: Review, accept, or reject schedule change requests submitted by Teachers in a live, animated feed.
- **Broadcast Announcements**: Send targeted announcements to specific roles (Students, Teachers, Representatives, or Everyone).
- **Live Feed**: A scrollable, filterable live feed of all announcements with full **read/unread** tracking, **sender role badges**, and **target audience labels**.
- **Edit & Delete Own Posts**: Coordinators can inline-edit or delete their own announcements directly from the feed on hover.

### 👨‍🏫 2. Teacher

A focused dashboard for classroom efficiency and communication.

- **Live Routine View**: Always displays the most current class schedule using the `RoutineViewer` component.
- **Schedule Change Requests**: Submit, edit, and delete schedule conflict resolution requests to the coordinator.
- **Alerts Feed**: Scrollable, filterable (All / Unread) notification feed with **Mark as Read** functionality and **sender role badges**.

### 🎓 3. Student

A streamlined, information-rich dashboard.

- **Dynamic Routine Viewer**: A clean, chronologically-organized view of the weekly class schedule, with lab class highlighting.
- **Alerts Feed**: Scrollable, filterable notification feed showing institutional announcements with **sender role badges**, **Mark as Read** support, and unread counters.

### 📢 4. Class Representative (CR)

The vital link between faculty and the student body.

- **View Class Routine**: Full-width read-only view of the current class routine.
- **Broadcaster**: Compose and publish announcements targeting Students, Teachers, or Everyone.
- **Live Feed**: A scrollable, filterable feed of all notifications, featuring **sender role badges**, **target audience labels**, **edit/delete for own posts**, and **read/unread tracking**.
- **Peer Visibility**: CRs can see announcements from other CRs in addition to their own broadcasts.

---

## ✨ Key Features

### 🔔 Advanced Notification System

- **Targeted Broadcasting**: Notifications can be sent to specific roles (`student`, `teacher`, `representative`, `all`).
- **Sender Role Badges**: Every notification card displays a color-coded role badge (e.g., `COORDINATOR`, `REPRESENTATIVE`) next to the sender's name, providing instant context.
- **Audience Labels**: Coordinators and CRs can see the `Audience` for each notification they sent (e.g., `Audience: Students`, `Audience: Everyone`).
- **Read / Unread System**: Each user has individual read tracking. Unread notifications are visually highlighted. Users can mark notifications as **Read** individually.
- **Unread Filter**: A quick toggle to show only unread notifications.
- **Edit & Delete**: Authors can edit or delete their own announcements directly from the Live Feed on hover.
- **Peer Visibility**: Peers with the same role (e.g., multiple Coordinators, multiple CRs) can each see all announcements sent by their peers.

### 💬 Global Community Chat

- A floating `ChatBox` component available across all four dashboards.
- Animated slide-in/out panel with a pulsing live indicator.
- Messages attributed to the current user with timestamps.
- Full message history persisted in `localStorage`.
- Mobile-responsive panel layout.

### 🔐 Authentication System

- Role-based login (`coordinator`, `teacher`, `student`, `representative`) with email/password validation.
- Multi-role session support (e.g., a Teacher and a Student can be logged in simultaneously in separate tabs).
- Session state persisted in `localStorage`.
- A self-service **User Registration** flow for new accounts.

### 🗓️ Routine Creator & Viewer

- **Creator**: Build weekly class schedules slot-by-slot. Supports course name, teacher name, room, section, and a lab/theory toggle.
- **Viewer**: A responsive, cleanly-formatted table showing the full weekly schedule, with visual distinction for lab sessions.
- **Day Selector**: Navigate between days when creating schedules.
- **Clear Routine**: Coordinators can wipe and rebuild the schedule at any time.

### 📱 Responsive & Mobile-Ready

- **Hamburger Navigation**: A full-screen animated slide-in menu on mobile devices.
- **Adaptive Layouts**: Dashboard sections reflow from multi-column to single-column on smaller screens.
- **Responsive Tables**: The routine viewer uses a horizontally-scrollable container on mobile.

### 🔄 Data Reset

- A globally accessible **Reset Data** button in the Navbar clears all `localStorage` data, providing a clean slate for demo or testing purposes.

---

## 🛠️ Tech Stack

| Layer          | Technology                                           |
| :------------- | :--------------------------------------------------- |
| **Framework**  | React 18 + TypeScript 5                              |
| **Build Tool** | Vite 5                                               |
| **Styling**    | Tailwind CSS (with custom `custom-scrollbar` class)  |
| **State**      | Zustand (4 dedicated stores)                         |
| **Routing**    | React Router DOM v6                                  |
| **Animations** | Framer Motion                                        |
| **Icons**      | Lucide React                                         |
| **Persistence**| Browser `localStorage` via custom `storage` utility  |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ChatBox.tsx          # Floating global community chat
│   ├── Footer.tsx           # Site footer
│   ├── LoginModal.tsx       # Role-based authentication modal
│   ├── Navbar.tsx           # Responsive top navigation bar
│   ├── PageTransition.tsx   # Framer Motion page wrapper
│   ├── RoutineCreator.tsx   # Slot-based routine builder for Coordinators
│   └── RoutineViewer.tsx    # Read-only weekly routine table
├── pages/
│   ├── Home.tsx                     # Landing page with role-based navigation
│   ├── CoordinatorDashboard.tsx     # Coordinator role dashboard
│   ├── TeacherDashboard.tsx         # Teacher role dashboard
│   ├── StudentDashboard.tsx         # Student role dashboard
│   └── RepresentativeDashboard.tsx  # Class Representative dashboard
├── store/
│   ├── authStore.ts          # User authentication & session management
│   ├── chatStore.ts          # Global chat message state
│   ├── notificationStore.ts  # Notification CRUD, read tracking, filtering
│   └── routineStore.ts       # Class routine & change request management
└── utils/
    └── storage.ts            # localStorage abstraction utility
```

---

## 🏃‍♂️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or higher recommended)
- npm

### Installation & Run

```bash
# 1. Clone the repository
git clone https://github.com/Abid-Al-Hossain/Class_Routine_Management_System_V2.git
cd Class_Routine_Management_System_V2

# 2. Install dependencies
npm install

# 3. Run the development server
npm run dev
```

Open `http://localhost:5173` in your browser.

### Default Demo Credentials

| Role            | Email                  | Password |
| :-------------- | :--------------------- | :------- |
| Coordinator     | admin@classhub.edu     | 1234     |
| Teacher         | teacher1@classhub.edu  | 2345     |
| Student         | student1@classhub.edu  | 4567     |
| Representative  | rep1@classhub.edu      | 5678     |

> **Tip**: Use the **Reset Data** button in the navbar to restore demo data at any time.

---

## 📄 License

Distributed under the MIT License.

## ✍️ Developed By

**Abid Al Hossain**  
_Passionate about building intelligent, user-centric academic solutions._

---

_Built with ❤️ using React, TypeScript & Vite_
