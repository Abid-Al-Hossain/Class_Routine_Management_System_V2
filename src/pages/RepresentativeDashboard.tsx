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
import { Trash, Megaphone, Plus, Calendar, Bell, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const RepresentativeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login, logout, currentUser } = useAuthStore();
  const { routine, fetchRoutine } = useRoutineStore();
  const {
    notifications,
    fetchNotifications,
    addNotification,
    deleteNotification,
  } = useNotificationStore();
  const [announcement, setAnnouncement] = useState("");
  const [targetRole, setTargetRole] = useState<UserRole | "all">("student");

  // Pagination state for notifications
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(notifications.length / itemsPerPage);
  const paginatedNotifications = notifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    fetchRoutine();
    fetchNotifications("representative");
  }, [fetchNotifications, fetchRoutine]);

  const handleLogout = () => {
    logout("representative");
    navigate("/");
  };

  const handleCreateAnnouncement = () => {
    if (announcement.trim()) {
      addNotification(
        announcement,
        currentUser?.fullName || "Class Representative",
        targetRole,
      );
      setAnnouncement("");
      fetchNotifications("representative");
    }
  };

  const handleDeleteNotification = (id: string) => {
    deleteNotification(id);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (!isAuthenticated.representative) {
    return (
      <LoginModal
        role="representative"
        onLogin={(username, password) => {
          login("representative", username, password);
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Routine Section */}
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
              <div className="p-8 border-b border-gray-50 flex items-center gap-3">
                <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
                  <Bell size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Alert Feed</h2>
              </div>

              <div className="p-8 flex-grow space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                <AnimatePresence mode="popLayout">
                  {paginatedNotifications.map((notif) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      key={notif.id}
                      className="group p-5 rounded-2xl border border-gray-50 hover:border-violet-100 hover:bg-violet-50/10 transition-all duration-150 relative text-left"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-gray-900 text-sm group-hover:text-violet-600 transition-colors">
                            {notif.sender}
                          </p>
                          <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                            {notif.content}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-3 font-bold uppercase tracking-widest">
                            {new Date(notif.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        {notif.sender === currentUser?.fullName && (
                          <button
                            onClick={() => handleDeleteNotification(notif.id)}
                            className="bg-red-50 text-red-500 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                          >
                            <Trash size={14} />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {totalPages > 1 && (
                  <div className="flex justify-center space-x-2 pt-4">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-10 h-10 rounded-xl font-bold transition-all duration-100 ${
                            page === currentPage
                              ? "bg-violet-600 text-white shadow-lg"
                              : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                          }`}
                        >
                          {page}
                        </button>
                      ),
                    )}
                  </div>
                )}
              </div>
            </motion.section>
          </div>
        </div>
      </main>

      <ChatBox
        username={currentUser?.fullName || "Class Representative"}
        channel="students"
        title="Student Union"
      />
      <Footer />
    </div>
  );
};
