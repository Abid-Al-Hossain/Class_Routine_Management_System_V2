import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ChatBox } from "../components/ChatBox";
import { LoginModal } from "../components/LoginModal";
import { useAuthStore } from "../store/authStore";
import { useRoutineStore } from "../store/routineStore";
import { useNotificationStore } from "../store/notificationStore";
import { RoutineViewer } from "../components/RoutineViewer";
import {
  Trash,
  Calendar,
  Bell,
  Sparkles,
  GraduationCap,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login, logout, currentUsers } = useAuthStore();
  const currentUser = currentUsers.student;
  const { routine, fetchRoutine } = useRoutineStore();
  const { notifications, fetchNotifications, deleteNotification, markAsRead } =
    useNotificationStore();
  const [notifFilter, setNotifFilter] = useState<"all" | "unread">("all");

  // No pagination, using scrollable feed instead

  useEffect(() => {
    fetchRoutine();
    fetchNotifications("student");
  }, [fetchNotifications, fetchRoutine]);

  const handleLogout = () => {
    logout("student");
    navigate("/");
  };

  const handleDeleteNotification = (id: string) => {
    deleteNotification(id);
    fetchNotifications("student");
  };



  if (!isAuthenticated.student) {
    return (
      <LoginModal
        role="student"
        onLogin={(email, password) => {
          login("student", email, password);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar title="Student Dashboard" showLogout onLogout={handleLogout} />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-black uppercase tracking-wider mb-3"
            >
              <GraduationCap size={14} />
              Student Portal
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl font-extrabold text-gray-900 tracking-tight"
            >
              Welcome, {currentUser?.fullName}
            </motion.h1>
            <p className="text-gray-500 mt-2 text-lg">
              Your academic schedule and announcements at a glance.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Sparkles size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Today is
              </p>
              <p className="font-bold text-gray-800">
                {new Date().toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-8">
          {/* Class Routine Section */}
          <div className="w-full">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden h-full"
            >
              <div className="p-8 border-b border-gray-50 flex items-center gap-3">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                  <Calendar size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Class Routine
                </h2>
              </div>
              <div className="p-8">
                <RoutineViewer routine={routine} />
              </div>
            </motion.section>
          </div>

          {/* Notifications Section */}
          <div className="w-full">
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden h-full flex flex-col"
            >
              <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
                    <Bell size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Alerts</h2>
                </div>
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  <button
                    onClick={() => setNotifFilter("all")}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${notifFilter === "all" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-400"}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setNotifFilter("unread")}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-1 ${notifFilter === "unread" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-400"}`}
                  >
                    Unread
                    {notifications.filter(n => !(n.readBy || []).includes(currentUser?.fullName || "")).length > 0 && (
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                    )}
                  </button>
                </div>
              </div>

              <div className="p-8 flex-grow space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar bg-gray-50/5">
                <AnimatePresence mode="popLayout">
                  {notifications.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <p>No new notifications.</p>
                    </div>
                  ) : (
                    notifications
                      .filter((n) => notifFilter === "all" || !(n.readBy || []).includes(currentUser?.fullName || ""))
                      .map((notif) => (
                        <motion.div
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          key={notif.id}
                          className={`group p-5 rounded-2xl border transition-all duration-150 relative text-left ${
                            !(notif.readBy || []).includes(currentUser?.fullName || "")
                              ? "bg-indigo-50/40 border-indigo-100"
                              : "bg-gray-50 border-gray-100"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-black text-[10px] text-indigo-600 uppercase tracking-widest mb-1 flex items-center gap-2">
                                {notif.sender}
                                {notif.senderRole && (
                                  <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase ${
                                      notif.senderRole === 'coordinator' ? 'bg-red-100 text-red-600' : 'bg-violet-100 text-violet-600'
                                  }`}>{notif.senderRole}</span>
                                )}
                                {!(notif.readBy || []).includes(currentUser?.fullName || "") && (
                                  <span className="bg-indigo-600 text-white text-[8px] px-1.5 py-0.5 rounded-full font-black uppercase">New</span>
                                )}
                              </p>
                              <p className="text-gray-700 text-sm leading-relaxed">
                                {notif.content}
                              </p>
                              <div className="flex items-center justify-between mt-3">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                  {new Date(notif.timestamp).toLocaleTimeString(
                                    [],
                                    { hour: "2-digit", minute: "2-digit" },
                                  )}
                                </p>
                                {!notif.readBy?.includes(currentUser?.fullName || "") && (
                                  <button
                                    onClick={() => markAsRead(notif.id, currentUser?.fullName || "")}
                                    className="flex items-center gap-1 text-[9px] font-black text-indigo-600 uppercase hover:bg-indigo-100 px-2 py-1 rounded-lg transition-all"
                                  >
                                    <Eye size={12} /> Mark read
                                  </button>
                                )}
                              </div>
                            </div>
                            {notif.sender === currentUser?.fullName && (
                              <button
                                onClick={() => handleDeleteNotification(notif.id)}
                                className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"
                              >
                                <Trash size={16} />
                              </button>
                            )}
                          </div>
                        </motion.div>
                      ))
                  )}
                </AnimatePresence>
              </div>


            </motion.section>
          </div>
        </div>
      </main>

      <ChatBox
        username={currentUser?.fullName || "Student"}
        userRole={currentUser?.role}
      />
      <Footer />
    </div>
  );
};
