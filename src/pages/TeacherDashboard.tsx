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
  Send,
  Calendar,
  Bell,
  MessageSquare,
  Edit2,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login, logout, currentUsers } = useAuthStore();
  const currentUser = currentUsers.teacher;
  const {
    addRequest,
    fetchRequests,
    deleteRequest,
    updateRequest,
    requests,
    routine,
    fetchRoutine,
  } = useRoutineStore();
  const { notifications, fetchNotifications, deleteNotification, markAsRead } =
    useNotificationStore();
  const [request, setRequest] = useState("");
  const [notifFilter, setNotifFilter] = useState<"all" | "unread">("all");
  const [editingRequestId, setEditingRequestId] = useState<string | null>(null);
  const [editRequestContent, setEditRequestContent] = useState("");

  const myRequests = requests.filter(
    (req) => req.teacherName === currentUser?.fullName,
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

  const handleUpdateRequest = (id: string) => {
    if (editRequestContent.trim()) {
      updateRequest(id, editRequestContent);
      setEditingRequestId(null);
      setEditRequestContent("");
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
              <div className="p-8 max-h-[400px] overflow-y-auto space-y-4 custom-scrollbar bg-gray-50/5">
                <AnimatePresence>
                  {myRequests.length === 0 ? (
                    <p className="text-center text-gray-400 py-4">
                      No requests found.
                    </p>
                  ) : (
                    myRequests.map((req) => (
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
                          <div className="flex items-center gap-1">
                            {req.acceptStatus === "pending" && (
                              <button
                                onClick={() => {
                                  setEditingRequestId(req.id);
                                  setEditRequestContent(req.content);
                                }}
                                className="text-gray-400 hover:text-indigo-600 transition-colors"
                              >
                                <Edit2 size={14} />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteRequest(req.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash size={14} />
                            </button>
                          </div>
                        </div>
                        {editingRequestId === req.id ? (
                          <div className="space-y-2">
                            <textarea
                              value={editRequestContent}
                              onChange={(e) => setEditRequestContent(e.target.value)}
                              className="w-full p-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                              rows={2}
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdateRequest(req.id)}
                                className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-xs font-bold"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingRequestId(null)}
                                className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-700 text-sm mb-2">
                            {req.content}
                          </p>
                        )}
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
              <div className="p-8 max-h-[400px] overflow-y-auto space-y-4 custom-scrollbar bg-gray-50/5">
                <AnimatePresence>
                  {notifications
                    .filter(n => notifFilter === "all" || !(n.readBy || []).includes(currentUser?.fullName || ""))
                    .map((notif) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={notif.id}
                      className={`group p-5 rounded-2xl border transition-all duration-150 relative text-left ${
                        !(notif.readBy || []).includes(currentUser?.fullName || "")
                          ? "bg-indigo-50/40 border-indigo-100"
                          : "bg-gray-50 border-gray-100 shadow-sm hover:border-violet-100"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold text-gray-900 text-sm group-hover:text-violet-600 transition-colors flex items-center gap-2">
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
                          </div>
                            <p className="text-gray-600 text-sm">
                              {notif.content}
                            </p>
                            <div className="flex items-center justify-between mt-3">
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                              {!(notif.readBy || []).includes(currentUser?.fullName || "") && (
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
                            <div className="flex flex-col gap-1 ml-4 opacity-0 group-hover:opacity-100 transition-all">
                              <button
                                onClick={() => handleDeleteNotification(notif.id)}
                                className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
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
        username={currentUser?.fullName || "Teacher"} 
        userRole={currentUser?.role} 
      />
      <Footer />
    </div>
  );
};
