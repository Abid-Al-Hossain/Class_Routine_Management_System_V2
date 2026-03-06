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
import { Trash, Send, Calendar, Bell, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login, logout, currentUsers } = useAuthStore();
  const currentUser = currentUsers.teacher;
  const {
    addRequest,
    fetchRequests,
    deleteRequest,
    requests,
    routine,
    fetchRoutine,
  } = useRoutineStore();
  const { notifications, fetchNotifications, deleteNotification } =
    useNotificationStore();
  const [request, setRequest] = useState("");

  // Pagination for notifications
  const itemsPerPage = 6;
  const [currentPage] = useState(1);
  const paginatedNotifications = notifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Pagination for schedule change requests
  const requestsPerPage = 6;
  const [requestPage] = useState(1);
  const myRequests = requests.filter(
    (req) => req.teacherName === currentUser?.fullName,
  );
  const paginatedRequests = myRequests.slice(
    (requestPage - 1) * requestsPerPage,
    requestPage * requestsPerPage,
  );

  // Fetch data on load
  useEffect(() => {
    fetchRoutine();
    fetchRequests();
    fetchNotifications("teacher");
  }, [fetchRequests, fetchNotifications, fetchRoutine]);

  const handleLogout = () => {
    logout("teacher");
    navigate("/");
  };

  const handleSubmitRequest = () => {
    if (request.trim() && currentUser) {
      addRequest(currentUser.fullName, request);
      setRequest("");
      fetchRequests();
    }
  };

  const handleDeleteRequest = (id: string) => {
    deleteRequest(id);
    fetchRequests();
  };

  const handleDeleteNotification = (id: string) => {
    deleteNotification(id);
    fetchNotifications("teacher");
  };

  if (!isAuthenticated.teacher) {
    return (
      <LoginModal
        role="teacher"
        onLogin={(email, password) => {
          login("teacher", email, password);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar title="Teacher Dashboard" showLogout onLogout={handleLogout} />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-extrabold text-gray-900 tracking-tight"
          >
            Hello, {currentUser?.position || "Prof."} {currentUser?.fullName?.split(" ").pop()}
          </motion.h1>
          <p className="text-gray-500 mt-2 text-lg">
            Check your schedule and manage class change requests.
          </p>
        </header>

        <div className="flex flex-col gap-8">
          {/* Class Routine Section */}
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
              {/* Request Schedule Change Section */}
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
                    Request Change
                  </h2>
                </div>
                <div className="p-8">
                  <textarea
                    value={request}
                    onChange={(e) => setRequest(e.target.value)}
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl mb-4 focus:ring-2 focus:ring-amber-500 outline-none transition-all duration-150 resize-none"
                    rows={4}
                    placeholder="Describe the change you need (e.g., reschedule Monday's 10AM class)..."
                  />
                  <button
                    onClick={handleSubmitRequest}
                    disabled={!request.trim()}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-amber-100 hover:shadow-amber-200 disabled:opacity-50 disabled:shadow-none transition-all duration-150 flex items-center justify-center gap-2 group"
                  >
                    <Send
                      size={18}
                      className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                    />
                    Submit Request
                  </button>
                </div>
              </motion.section>

            {/* Your Requests List */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden"
            >
              <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">My Requests</h2>
                <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-black uppercase">
                  Track
                </span>
              </div>
              <div className="p-8 space-y-4">
                <AnimatePresence>
                  {paginatedRequests.length === 0 ? (
                    <p className="text-center text-gray-400 py-4">
                      No requests found.
                    </p>
                  ) : (
                    paginatedRequests.map((req) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={req.id}
                        className={`p-4 rounded-2xl border transition-all duration-150 relative ${
                          req.acceptStatus === "accepted"
                            ? "bg-green-50 border-green-100"
                            : req.acceptStatus === "rejected"
                              ? "bg-red-50 border-red-100"
                              : "bg-gray-50 border-gray-100"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span
                            className={`px-2 py-1 rounded-full text-[10px] uppercase font-black ${
                              req.acceptStatus === "accepted"
                                ? "bg-green-200 text-green-700"
                                : req.acceptStatus === "rejected"
                                  ? "bg-red-200 text-red-700"
                                  : "bg-amber-200 text-amber-700"
                            }`}
                          >
                            {req.acceptStatus}
                          </span>
                          <button
                            onClick={() => handleDeleteRequest(req.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash size={14} />
                          </button>
                        </div>
                        <p className="text-gray-700 text-sm mb-2">
                          {req.content}
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                          {new Date(req.timestamp).toLocaleDateString()}
                        </p>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </motion.section>
          </div>

          <div className="space-y-8">
            {/* Notifications Section */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden"
            >
              <div className="p-8 border-b border-gray-50 flex items-center gap-3">
                <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
                  <Bell size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Alerts</h2>
              </div>
              <div className="p-8 space-y-4">
                <AnimatePresence>
                  {paginatedNotifications.map((notif) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      key={notif.id}
                      className="p-4 rounded-2xl bg-gray-50 border border-gray-100 group relative"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-gray-900 text-sm">
                            {notif.sender}
                          </p>
                          <p className="text-gray-600 text-sm mt-1">
                            {notif.content}
                          </p>
                        </div>
                        {notif.sender === currentUser?.fullName && (
                          <button
                            onClick={() => handleDeleteNotification(notif.id)}
                            className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all"
                          >
                            <Trash size={14} />
                          </button>
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
        username={currentUser?.fullName || "Teacher"} 
        userRole={currentUser?.role} 
      />
      <Footer />
    </div>
  );
};
