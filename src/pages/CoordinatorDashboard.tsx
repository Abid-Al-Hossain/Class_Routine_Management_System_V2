import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ChatBox } from "../components/ChatBox";
import { LoginModal } from "../components/LoginModal";
import { useAuthStore, UserRole } from "../store/authStore";
import { useRoutineStore } from "../store/routineStore";
import { useNotificationStore } from "../store/notificationStore";
import { RoutineCreator } from "../components/RoutineCreator";
import { RoutineViewer } from "../components/RoutineViewer";
import {
  Trash,
  Check,
  X,
  Plus,
  Calendar,
  Bell,
  MessageSquare,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const CoordinatorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login, logout, currentUser } = useAuthStore();
  const {
    requests,
    fetchRequests,
    acceptRequest,
    rejectRequest,
    routine,
    fetchRoutine,
    clearRoutine,
  } = useRoutineStore();
  const {
    addNotification,
    fetchNotifications,
    notifications,
    deleteNotification,
  } = useNotificationStore();

  // Pagination state for schedule change requests
  const requestsPerPage = 6;
  const [requestPage, setRequestPage] = useState(1);
  const totalRequestPages = Math.ceil(requests.length / requestsPerPage);
  const paginatedRequests = requests.slice(
    (requestPage - 1) * requestsPerPage,
    requestPage * requestsPerPage,
  );

  // Pagination state for notifications
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(notifications.length / itemsPerPage);
  const paginatedNotifications = notifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Other state
  const [notification, setNotification] = useState("");
  const [targetRole, setTargetRole] = useState<UserRole | "all">("all");
  const [showRoutineCreator, setShowRoutineCreator] = useState(false);
  const [selectedDay, setSelectedDay] = useState("Sunday");

  const handleRequestPageChange = (page: number) => {
    setRequestPage(page);
  };

  useEffect(() => {
    fetchRoutine();
    fetchNotifications("coordinator");
    fetchRequests();
  }, [fetchRoutine, fetchNotifications, fetchRequests]);

  const handleLogout = () => {
    logout("coordinator");
    navigate("/");
  };

  const handleSendNotification = () => {
    if (notification.trim()) {
      addNotification(
        notification,
        currentUser?.fullName || "Coordinator",
        targetRole,
      );
      setNotification("");
      fetchNotifications("coordinator");
    }
  };

  const handleDeleteNotification = (id: string) => {
    deleteNotification(id);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (!isAuthenticated.coordinator) {
    return (
      <LoginModal
        role="coordinator"
        onLogin={(username, password) => {
          login("coordinator", username, password);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar
        title="Coordinator Dashboard"
        showLogout
        onLogout={handleLogout}
      />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-extrabold text-gray-900 tracking-tight"
          >
            Welcome, {currentUser?.fullName}
          </motion.h1>
          <p className="text-gray-500 mt-2 text-lg">
            Manage your department's schedule and communications from here.
          </p>
        </header>

        <div className="flex flex-col gap-8">
          {/* Main Content Area */}
          <div className="w-full space-y-8">
            {/* Manage Schedule Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden"
            >
              <div className="p-8 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                    <Calendar size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Department Routine
                  </h2>
                </div>
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  <button
                    onClick={() => setShowRoutineCreator(false)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-100 ${!showRoutineCreator ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                  >
                    View
                  </button>
                  <button
                    onClick={() => setShowRoutineCreator(true)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-100 ${showRoutineCreator ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                  >
                    Create
                  </button>
                </div>
              </div>
              <div className="p-8">
                <AnimatePresence mode="wait">
                  {showRoutineCreator ? (
                    <motion.div
                      key="creator"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <RoutineCreator
                        onSave={() => setShowRoutineCreator(false)}
                        selectedDay={selectedDay}
                        onDayChange={(day) => setSelectedDay(day)}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="viewer"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <div className="flex justify-end mb-4">
                        <button
                          onClick={clearRoutine}
                          className="text-red-500 hover:text-red-700 text-sm font-bold flex items-center gap-1 group transition-colors"
                        >
                          <Trash
                            size={16}
                            className="group-hover:scale-110 transition-transform"
                          />
                          Clear Entire Routine
                        </button>
                      </div>
                      <RoutineViewer routine={routine} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.section>

            {/* Schedule Change Requests Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden"
            >
              <div className="p-8 border-b border-gray-50 flex items-center gap-3">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                  <MessageSquare size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Change Requests
                </h2>
              </div>
              <div className="p-8">
                {paginatedRequests.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <p>No pending schedule change requests.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    {paginatedRequests.map((request) => (
                      <motion.div
                        layout
                        key={request.id}
                        className={`p-5 rounded-2xl border transition-all duration-150 ${
                          request.acceptStatus === "accepted"
                            ? "bg-green-50 border-green-100"
                            : request.acceptStatus === "rejected"
                              ? "bg-red-50 border-red-100"
                              : "bg-gray-50 border-gray-100"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-bold text-gray-900">
                              {request.teacherName}
                            </p>
                            <p className="text-xs text-gray-400 font-medium">
                              {new Date(request.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-[10px] uppercase font-black ${
                              request.acceptStatus === "accepted"
                                ? "bg-green-200 text-green-700"
                                : request.acceptStatus === "rejected"
                                  ? "bg-red-200 text-red-700"
                                  : "bg-amber-200 text-amber-700"
                            }`}
                          >
                            {request.acceptStatus}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {request.content}
                        </p>
                        {request.acceptStatus === "pending" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => acceptRequest(request.id)}
                              className="flex-1 bg-green-500 text-white py-2 rounded-xl hover:bg-green-600 transition-colors duration-100 flex items-center justify-center"
                            >
                              <Check size={18} />
                            </button>
                            <button
                              onClick={() => rejectRequest(request.id)}
                              className="flex-1 bg-red-500 text-white py-2 rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}

                {totalRequestPages > 1 && (
                  <div className="flex justify-center space-x-2 mt-8">
                    {Array.from(
                      { length: totalRequestPages },
                      (_, i) => i + 1,
                    ).map((page) => (
                      <button
                        key={page}
                        onClick={() => handleRequestPageChange(page)}
                        className={`w-10 h-10 rounded-xl font-bold transition-all ${
                          page === requestPage
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                            : "bg-white text-gray-500 border border-gray-100 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.section>
          </div>

          {/* Sidebar Area */}
          <div className="w-full space-y-8">
            {/* Quick Announcement Section */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden"
            >
              <div className="p-8 border-b border-gray-50 flex items-center gap-3">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                  <Bell size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Broadcast</h2>
              </div>
              <div className="p-8">
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-none">
                  {(
                    ["all", "student", "teacher", "representative"] as (
                      | UserRole
                      | "all"
                    )[]
                  ).map((role) => (
                    <button
                      key={role}
                      onClick={() => setTargetRole(role)}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-100 border ${
                        targetRole === role
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                          : "bg-gray-50 text-gray-400 border-gray-100 hover:border-indigo-100"
                      }`}
                    >
                      {role === "all" ? "🌐 Everyone" : `👤 ${role}s`}
                    </button>
                  ))}
                </div>
                <textarea
                  value={notification}
                  onChange={(e) => setNotification(e.target.value)}
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl mb-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all duration-150 resize-none"
                  rows={4}
                  placeholder={`Draft announcement for ${targetRole === "all" ? "everyone" : targetRole + "s"}...`}
                />
                <button
                  onClick={handleSendNotification}
                  disabled={!notification.trim()}
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:shadow-indigo-200 disabled:opacity-50 disabled:shadow-none transition-all duration-150 flex items-center justify-center gap-2 group"
                >
                  <Plus
                    size={20}
                    className="group-hover:rotate-90 transition-transform"
                  />
                  Post Announcement
                </button>
              </div>
            </motion.section>

            {/* Announcements List */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden flex-grow"
            >
              <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Live Feed</h2>
                <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-black uppercase">
                  Recent
                </span>
              </div>
              <div className="p-8 max-h-[400px] overflow-y-auto space-y-4 custom-scrollbar">
                <AnimatePresence>
                  {paginatedNotifications.map((notif) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      key={notif.id}
                      className="group p-4 rounded-2xl border border-gray-50 hover:border-indigo-100 hover:bg-indigo-50/10 transition-all duration-150 relative text-left"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-gray-900 text-sm group-hover:text-indigo-600 transition-colors">
                            {notif.sender}
                          </p>
                          <p className="text-gray-600 text-sm leading-relaxed mt-1">
                            {notif.content}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1 uppercase font-bold tracking-wider">
                            <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
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
                          className={`w-8 h-8 rounded-lg text-xs font-black transition-all duration-100 ${
                            page === currentPage
                              ? "bg-gray-800 text-white"
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
        username={currentUser?.fullName || "Coordinator"}
        channel="faculty"
        title="Faculty Lounge"
      />
      <Footer />
    </div>
  );
};
