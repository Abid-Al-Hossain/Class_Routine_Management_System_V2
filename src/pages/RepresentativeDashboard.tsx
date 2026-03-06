import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ChatBox } from "../components/ChatBox";
import { LoginModal } from "../components/LoginModal";
import { useAuthStore, UserRole } from "../store/authStore";
import { useRoutineStore } from "../store/routineStore";
import { useNotificationStore } from "../store/notificationStore";
import { RoutineViewer } from "../components/RoutineViewer";
import {
  Trash,
  Megaphone,
  Plus,
  Calendar,
  Bell,
  Users,
  Edit2,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const RepresentativeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login, logout, currentUsers } = useAuthStore();
  const currentUser = currentUsers.representative;
  const { routine, fetchRoutine } = useRoutineStore();
  const {
    notifications,
    fetchNotifications,
    addNotification,
    deleteNotification,
    markAsRead,
    updateNotification,
  } = useNotificationStore();
  const [announcement, setAnnouncement] = useState("");
  const [targetRole, setTargetRole] = useState<UserRole | "all">("student");
  const [notifFilter, setNotifFilter] = useState<"all" | "unread">("all");
  const [editingNotifId, setEditingNotifId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  // No pagination, using scrollable feed instead

  useEffect(() => {
    fetchRoutine();
    fetchNotifications("representative", currentUser?.fullName);
  }, [fetchNotifications, fetchRoutine, currentUser?.fullName]);

  const handleLogout = () => {
    logout("representative");
    navigate("/");
  };

  const handleCreateAnnouncement = () => {
    if (announcement.trim()) {
      addNotification(
        announcement,
        currentUser?.fullName || "Alice Brown",
        currentUser?.role || "representative",
        targetRole,
      );
      setAnnouncement("");
      fetchNotifications("representative", currentUser?.fullName);
    }
  };

  const handleDeleteNotification = (id: string) => {
    deleteNotification(id);
  };

  const handleUpdateNotification = (id: string) => {
    if (editContent.trim()) {
      updateNotification(id, editContent);
      setEditingNotifId(null);
      setEditContent("");
    }
  };



  if (!isAuthenticated.representative) {
    return (
      <LoginModal
        role="representative"
        onLogin={(email, password) => {
          login("representative", email, password);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar
        title="Representative Dashboard"
        showLogout
        onLogout={handleLogout}
      />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 text-violet-600 text-xs font-black uppercase tracking-wider mb-3"
          >
            <Users size={14} />
            Class Management
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-extrabold text-gray-900 tracking-tight"
          >
            Welcome, {currentUser?.fullName}
          </motion.h1>
          <p className="text-gray-500 mt-2 text-lg">
            Lead your class, keep everyone informed and updated.
          </p>
        </header>

        <div className="flex flex-col gap-8">
          {/* Routine Section */}
          <div className="w-full">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden"
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">

            {/* Create Announcement Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden"
            >
              <div className="p-8 border-b border-gray-50 flex items-center gap-3">
                <div className="p-3 bg-violet-50 text-violet-600 rounded-2xl">
                  <Megaphone size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Broadcaster
                </h2>
              </div>
              <div className="p-8">
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-none">
                  {(["student", "teacher", "all"] as (UserRole | "all")[]).map(
                    (role) => (
                      <button
                        key={role}
                        onClick={() => setTargetRole(role)}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-100 border ${
                          targetRole === role
                            ? "bg-violet-600 text-white border-violet-600 shadow-md"
                            : "bg-gray-50 text-gray-400 border-gray-100 hover:border-violet-100"
                        }`}
                      >
                        {role === "all" ? "🌐 Everyone" : `👤 ${role}s`}
                      </button>
                    ),
                  )}
                </div>
                <textarea
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl mb-4 focus:ring-2 focus:ring-violet-500 outline-none transition-all duration-150 resize-none"
                  rows={4}
                  placeholder={`Broadcast to ${targetRole === "all" ? "everyone" : targetRole + "s"}...`}
                />
                <button
                  onClick={handleCreateAnnouncement}
                  disabled={!announcement.trim()}
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-violet-100 hover:shadow-violet-200 disabled:opacity-50 disabled:shadow-none transition-all duration-150 flex items-center justify-center gap-2 group"
                >
                  <Plus
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                  Post Announcement
                </button>
              </div>
            </motion.section>
          </div>

          <div className="space-y-8 flex flex-col h-full">
            {/* Announcements Section */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden flex-grow flex flex-col"
            >
              <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
                    <Bell size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Alert Feed</h2>
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

              <div className="p-8 flex-grow space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                <AnimatePresence mode="popLayout">
                  {notifications
                    .filter(n => notifFilter === "all" || !(n.readBy || []).includes(currentUser?.fullName || ""))
                    .map((notif) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      key={notif.id}
                      className={`group p-5 rounded-2xl border transition-all duration-150 relative text-left ${
                        !(notif.readBy || []).includes(currentUser?.fullName || "")
                          ? "bg-indigo-50/40 border-indigo-100 shadow-sm"
                          : "bg-gray-50 border-gray-50 hover:border-violet-100"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold text-gray-900 text-sm group-hover:text-violet-600 transition-colors flex items-center gap-2">
                              {notif.sender}
                              {notif.senderRole && (
                                <span className="text-[9px] bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded uppercase">{notif.senderRole}</span>
                              )}
                              {!(notif.readBy || []).includes(currentUser?.fullName || "") && (
                                <span className="bg-indigo-600 text-white text-[8px] px-1.5 py-0.5 rounded-full font-black uppercase">New</span>
                              )}
                            </p>
                          </div>
                          {notif.targetRole && (
                            <div className="mb-2">
                                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                                    Audience: {notif.targetRole === "all" ? "Everyone" : notif.targetRole + "s"}
                                </span>
                            </div>
                          )}
                          {editingNotifId === notif.id ? (
                            <div className="space-y-2 mt-2">
                              <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 outline-none"
                                rows={3}
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleUpdateNotification(notif.id)}
                                  className="px-3 py-1.5 bg-violet-600 text-white rounded-lg text-xs font-bold"
                                >
                                  Save Change
                                </button>
                                <button
                                  onClick={() => setEditingNotifId(null)}
                                  className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                              {notif.content}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-3">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1">
                              {new Date(notif.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
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
                        {(notif.sender === currentUser?.fullName || 
                          (notif.sender === "Class Representative" && currentUser?.role === "representative") ||
                          (notif.sender === "Alice Brown" && currentUser?.role === "representative")) && (
                          <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all ml-4 flex-shrink-0 z-10">
                            <button
                              onClick={() => {
                                setEditingNotifId(notif.id);
                                setEditContent(notif.content);
                              }}
                              className="text-gray-400 hover:text-indigo-600 p-1.5 transition-colors"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteNotification(notif.id)}
                              className="text-gray-400 hover:text-red-500 p-1.5 transition-colors"
                            >
                              <Trash size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </main>

      <ChatBox
        username={currentUser?.fullName || "Class Representative"}
        userRole={currentUser?.role}
      />
      <Footer />
    </div>
  );
};
