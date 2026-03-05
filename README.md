# 🎓 ClassHub V2: Intelligence Routine System

[![Build Status](https://img.shields.io/badge/Build-Success-emerald?style=for-the-badge&logo=github)](https://github.com/Abid-Al-Hossain/Class_Routine_Management_System_V2)
[![Architecture](https://img.shields.io/badge/Architecture-Local--First-indigo?style=for-the-badge&logo=react)](https://github.com/Abid-Al-Hossain/Class_Routine_Management_System_V2)
[![UI/UX](https://img.shields.io/badge/UI--UX-Premium%20Glassmorphism-violet?style=for-the-badge&logo=framer)](https://github.com/Abid-Al-Hossain/Class_Routine_Management_System_V2)

**ClassHub V2** is a high-performance, intelligent class routine management platform refactored for the modern web. Specifically designed for educational institutions, it streamlines the coordination between coordinators, teachers, and students through a beautiful, logic-driven interface.

---

## 🚀 The V2 Evolution: Architecture

Originally built with a traditional Node.js/MongoDB backend, **V2** introduces a **Local-First Architecture**.

### Why Local-First?

- **Zero Latency**: Instant data interactions without network bottlenecks.
- **Persistent Sessions**: Every change is synchronized with the browser's `localStorage`, ensuring data survives refreshes and session restarts.
- **Portfolio Ready**: Perfectly optimized for static hosting (GitHub Pages, Vercel, Netlify) while maintaining full functionality without a complex backend setup.
- **Privacy Driven**: User data remains in the user's control within their own browser environment.

---

## 🎭 Role-Based Intelligence

ClassHub V2 provides tailored experiences for four distinct academic roles:

### 🏛️ 1. Course Coordinator (The Architect)

The power-user dashboard for full institutional control.

- **Timeline Management**: Construct complex weekly schedules with a robust, drag-and-drop-like interface.
- **Lab Session Support**: Specialized toggles for laboratory sessions, featuring unique visual distinction in the viewer.
- **Instant Deployment**: Reflect schedule changes globally with a single click.
- **Data Tips**: Integrated guidance on maximizing local persistence.

### 👨‍🏫 2. Teacher (The Instructor)

Focused on classroom efficiency and communication.

- **Real-Time View**: Access the most up-to-date personal teaching schedule.
- **Schedule Requests**: Submit conflict resolution or schedule change requests directly to the coordinator.
- **Notification Inbox**: Keep track of institutional updates and approved requests.

### 🎓 3. Student (The Learner)

A streamlined, informative dashboard.

- **Dynamic Routine Viewer**: Clear, chronologically sorted view of daily sessions.
- **Lab Highlights**: Visual cues for lab vs. theory classes for better preparation.
- **Peer Announcements**: Access real-time updates from Class Representatives.
- **Global Chat**: Connect with peers instantly through the integrated community chat.

### 📢 4. Class Representative (The Liaison)

The vital link between faculty and the student body.

- **Announcement Broadcasting**: Post urgent updates or announcements that appear instantly on student dashboards.
- **Coordination Hub**: Manage information flow effectively with dedicated representative tools.

---

## ✨ Premium UI/UX & Global Features

- **Glassmorphic Aesthetic**: A modern, premium design system featuring curated gradients, subtle blurs, and sophisticated typography.
- **Fluid Animations**: Powered by `framer-motion`, the app features 60fps page transitions, interactive hover states, and smooth entrance/exit effects.
- **Global Community Chat**: A floating, animated chat component available across all dashboards for seamless peer-to-peer communication.
- **Notification System**: A robust, animated feed for keeping users updated on institutional movements.

---

## 🛠️ Technology Stack

| Layer          | Technologies                              |
| :------------- | :---------------------------------------- |
| **Frontend**   | React 18, TypeScript, Vite                |
| **Styling**    | Tailwind CSS, CSS3 (Glassmorphism)        |
| **State**      | Zustand (Persistent State Management)     |
| **Animations** | Framer Motion                             |
| **Icons**      | Lucide React                              |
| **Storage**    | Browser LocalStorage API (Custom Wrapper) |

---

## 🏃‍♂️ Getting Started

ClassHub V2 requires **zero** database configuration.

### Prerequisites

- [Node.js](https://nodejs.org/) (v16.x or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Abid-Al-Hossain/Class_Routine_Management_System_V2.git
   cd Class_Routine_Management_System_V2
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Launch the Application**
   ```bash
   npm run dev
   ```
   _The app will be available at `http://localhost:5173`._

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## ✍️ Developed By

**Abid Al Hossain**  
_Passionate about building intelligent, user-centric academic solutions._

---

_Created with ❤️ by Antigravity AI_
