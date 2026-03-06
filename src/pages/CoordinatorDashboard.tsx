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
  Edit2,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const CoordinatorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login, logout, currentUsers } = useAuthStore();
  const currentUser = currentUsers.coordinator;
  const {
    requests,
    fetchRequests,
    acceptRequest,
    rejectRequest,
    routine,
    fetchRoutine,
    clearRoutine,
    updateRequest
  } = useRoutineStore();

  const {
    addNotification,
    fetchNotifications,
    notifications,
    deleteNotification,
    markAsRead,
    updateNotification
  } = useNotificationStore();

  // No pagination, using scrollable feed instead
  
  const [notification, setNotification] = useState("");
  const [targetRole, setTargetRole] = useState<UserRole | "all">("all");
  const [showRoutineCreator, setShowRoutineCreator] = useState(false);
  const [selectedDay, setSelectedDay] = useState("Sunday");
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [editingNotifId, setEditingNotifId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editingRequestId, setEditingRequestId] = useState<string | null>(null);
  const [editRequestContent, setEditRequestContent] = useState("");

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.readBy?.includes(currentUser?.fullName || "");
    return true;
  });


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
        currentUser?.fullName || "Admin Coordinator",
        currentUser?.role || "coordinator",
        targetRole,
      );
      setNotification("");
      fetchNotifications("coordinator");
    }
  };

  const handleUpdateNotification = (id: string) => {
    if (editContent.trim()) {
      updateNotification(id, editContent);
      setEditingNotifId(null);
      setEditContent("");
    }
  };

  const handleDeleteNotification = (id: string) => {
    deleteNotification(id);
  };

  const handleUpdateRequest = (id: string) => {
    if (editRequestContent.trim()) {
      updateRequest(id, editRequestContent);
      setEditingRequestId(null);
      setEditRequestContent("");
    }
  };


  if (!isAuthenticated.coordinator) {
    return (
      <LoginModal
        role="coordinator"
        onLogin={(email, password) => {
          login("coordinator", email, password);
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
              <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                    <MessageSquare size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Change Requests
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
                  <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                    Live Feed
                  </span>
                </div>
              </div>
              <div className="p-8 max-h-[500px] overflow-y-auto space-y-4 custom-scrollbar bg-amber-50/5">
                {requests.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <p>No pending schedule change requests.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4 text-left">
                    <AnimatePresence>
                      {requests.map((request) => (
                        <motion.div
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          key={request.id}
                          className={`p-5 rounded-2xl border transition-all duration-150 ${
                            request.acceptStatus === "accepted"
                              ? "bg-green-50 border-green-100"
                              : request.acceptStatus === "rejected"
                                ? "bg-red-50 border-red-100"
                                : "bg-white border-gray-100 shadow-sm hover:shadow-md"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="font-bold text-gray-900 flex items-center gap-2">
                                {request.teacherName}
                                <span className="text-[9px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded uppercase">Teacher</span>
                              </p>
                              <p className="text-xs text-gray-400 font-medium">
                                {new Date(request.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(request.timestamp).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {request.teacherName === currentUser?.fullName && (
                                <button
                                  onClick={() => {
                                    setEditingRequestId(request.id);
                                    setEditRequestContent(request.content);
                                  }}
                                  className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors"
                                >
                                  <Edit2 size={14} />
                                </button>
                              )}
                              <span
                                className={`px-2 py-1 rounded-full text-[10px] uppercase font-black ${
                                  request.acceptStatus === "accepted"
                                    ? "bg-green-200 text-green-700"
                                    : request.acceptStatus === "rejected"
                                      ? "bg-red-200 text-red-700"
                                      : "bg-amber-100 text-amber-700"
                                }`}
                              >
                                {request.acceptStatus}
                              </span>
                            </div>
                          </div>
                          {editingRequestId === request.id ? (
                            <div className="space-y-3">
                              <textarea
                                value={editRequestContent}
                                onChange={(e) => setEditRequestContent(e.target.value)}
                                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                rows={3}
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleUpdateRequest(request.id)}
                                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold"
                                >
                                  Save Change
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
                            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                              {request.content}
                            </p>
                          )}
                          {request.acceptStatus === "pending" && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => acceptRequest(request.id)}
                                className="flex-1 bg-green-500 text-white py-2 rounded-xl hover:bg-green-600 shadow-sm hover:shadow-green-200 transition-all duration-200 flex items-center justify-center gap-2 font-bold text-xs"
                              >
                                <Check size={16} /> Accept
                              </button>
                              <button
                                onClick={() => rejectRequest(request.id)}
                                className="flex-1 bg-red-500 text-white py-2 rounded-xl hover:bg-red-600 shadow-sm hover:shadow-red-200 transition-all duration-200 flex items-center justify-center gap-2 font-bold text-xs"
                              >
                                <X size={16} /> Reject
                              </button>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
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
              <div className="p-8 border-b border-gray-50 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800">Live Feed</h2>
                  <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button
                      onClick={() => setFilter("all")}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${filter === "all" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-400"}`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilter("unread")}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-1 ${filter === "unread" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-400"}`}
                    >
                      Unread
                      {notifications.filter(n => !(n.readBy || []).includes(currentUser?.fullName || "")).length > 0 && (
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-8 max-h-[400px] overflow-y-auto space-y-4 custom-scrollbar">
                <AnimatePresence>
                  {filteredNotifications.map((notif) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      key={notif.id}
                      className={`group p-4 rounded-2xl border transition-all duration-150 relative text-left ${
                        !(notif.readBy || []).includes(currentUser?.fullName || "")
                          ? "bg-indigo-50/30 border-indigo-100 shadow-sm"
                          : "border-gray-50 hover:border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold text-gray-900 text-sm flex items-center gap-2">
                              {notif.sender}
                              {notif.senderRole && (
                                <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded uppercase">{notif.senderRole}</span>
                              )}
                              {!(notif.readBy || []).includes(currentUser?.fullName || "") && (
                                <span className="bg-indigo-600 text-white text-[8px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter">New</span>
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
                            <div className="mt-2 space-y-2">
                              <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full p-3 bg-white border border-indigo-100 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                rows={3}
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleUpdateNotification(notif.id)}
                                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold"
                                >
                                  Save
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
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {notif.content}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between mt-3">
                            <p className="text-[10px] text-gray-400 flex items-center gap-1 uppercase font-bold tracking-wider">
                              <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                              {new Date(notif.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                            <div className="flex items-center gap-1">
                              {!(notif.readBy || []).includes(currentUser?.fullName || "") ? (
                                <button
                                  onClick={() => markAsRead(notif.id, currentUser?.fullName || "")}
                                  className="flex items-center gap-1 text-[9px] font-black text-indigo-600 uppercase hover:bg-indigo-100 px-2 py-1 rounded-lg transition-all"
                                >
                                  <Eye size={12} /> Mark read
                                </button>
                              ) : (
                                <span className="text-[9px] font-black text-gray-400 uppercase flex items-center gap-1 px-2 py-1">
                                  <Check size={12} /> Seen
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {notif.sender === currentUser?.fullName && editingNotifId !== notif.id && (
                          <div className="flex flex-col gap-1 ml-4 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
                            <button
                              onClick={() => {
                                setEditingNotifId(notif.id);
                                setEditContent(notif.content);
                              }}
                              className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteNotification(notif.id)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
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
      </main>
      <ChatBox
        username={currentUser?.fullName || "Coordinator"}
        userRole={currentUser?.role}
      />
      <Footer />
    </div>
  );
};
