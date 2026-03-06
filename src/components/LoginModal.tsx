import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserRole, useAuthStore } from "../store/authStore";
import { UserCircle, Lock, UserPlus, LogIn, ChevronRight, Briefcase, Mail } from "lucide-react";

interface LoginModalProps {
  onLogin: (email: string, password: string) => void;
  role: UserRole;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onLogin, role }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [position, setPosition] = useState("");
  const [error, setError] = useState("");
  const { register } = useAuthStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isRegistering) {
      if (!email || !password || !fullName || (role === "teacher" && !position)) {
        setError("Please fill in all required fields");
        return;
      }
      const success = register({ email, password, role, fullName, position: role === "teacher" ? position : undefined });
      if (success) {
        setIsRegistering(false);
        setError("Registration successful! Please login.");
      } else {
        setError("Email already in use");
      }
    } else {
      onLogin(email, password);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-8 text-white relative">
          <div className="absolute top-4 right-4 opacity-20">
            <UserCircle size={80} />
          </div>
          <h2 className="text-3xl font-bold mb-2">
            {isRegistering ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="opacity-90">
            Login as {role.charAt(0).toUpperCase() + role.slice(1)}
          </p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={isRegistering ? "register" : "login"}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {isRegistering && (
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <div className="relative">
                      <UserCircle
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>
                )}

                {isRegistering && role === "teacher" && (
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Position Title
                    </label>
                    <div className="relative">
                      <Briefcase
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        type="text"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        placeholder="e.g. Lecturer, Professor, Adjunct"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email address"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className={`text-sm font-medium text-center ${error.includes("successful") ? "text-green-600" : "text-red-500"}`}
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
            >
              {isRegistering ? <UserPlus size={20} /> : <LogIn size={20} />}
              {isRegistering ? "Register Now" : "Login Securely"}
              <ChevronRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-sm">
              {isRegistering
                ? "Already have an account?"
                : "Don't have an account?"}{" "}
              <button
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors"
              >
                {isRegistering ? "Log in instead" : "Create one now"}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
