import React from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import {
  Users,
  UserCircle,
  GraduationCap,
  User,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
} from "lucide-react";
import { motion } from "framer-motion";

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const dashboards = [
    {
      title: "Course Coordinator",
      icon: Users,
      path: "/coordinator",
      description: "Manage class schedules and coordinate with teachers",
      color: "blue",
    },
    {
      title: "Teacher",
      icon: UserCircle,
      path: "/teacher",
      description: "View schedules and manage classes",
      color: "indigo",
    },
    {
      title: "Student",
      icon: GraduationCap,
      path: "/student",
      description: "Access class schedules and information",
      color: "violet",
    },
    {
      title: "Class Representative",
      icon: User,
      path: "/representative",
      description: "Coordinate between students and teachers",
      color: "fuchsia",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden relative">
      {/* Global Background Grid */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(#4f46e5 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      ></div>

      <Navbar title="Intelligence Routine System" />

      <main className="flex-grow relative z-10">
        {/* Hero Section */}
        <div className="relative pt-16 pb-24 lg:pt-32 lg:pb-32">
          {/* Abstract Background Elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-200/40 rounded-full blur-[160px]"
            ></motion.div>
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                rotate: [0, -90, 0],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-200/40 rounded-full blur-[140px]"
            ></motion.div>
          </div>

          <div className="container mx-auto px-6 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-indigo-50/80 backdrop-blur-md text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] mb-10 border border-indigo-100/50 shadow-sm"
            >
              <Zap size={14} />
              Next-Gen Academic Infrastructure
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-[0.95] mb-10"
            >
              Intelligence <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-[length:200%_auto] animate-gradient">
                Routine Flow
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-500/80 max-w-2xl mx-auto mb-16 font-medium leading-relaxed"
            >
              A high-fidelity management experience refactored for speed,
              persistence, and visual excellence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-10 text-gray-400 font-black uppercase tracking-[0.3em] text-[10px]"
            >
              <span className="flex items-center gap-3">
                <ShieldCheck size={16} className="text-indigo-500" /> Persistent
                Layer
              </span>
              <span className="flex items-center gap-3">
                <Globe size={16} className="text-violet-500" /> Distributed
                Roles
              </span>
              <span className="flex items-center gap-3">
                <Zap size={16} className="text-amber-500" /> Zero Latency
              </span>
            </motion.div>
          </div>
        </div>

        {/* Roles Grid */}
        <div className="container mx-auto px-6 py-24 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {dashboards.map((dashboard, index) => {
              const Icon = dashboard.icon;
              return (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.2 + index * 0.05,
                    duration: 0.4,
                    ease: "circOut",
                  }}
                  key={dashboard.path}
                  onClick={() => navigate(dashboard.path)}
                  className="group relative bg-white rounded-[48px] p-10 cursor-pointer border border-indigo-50 shadow-[0_32px_64px_-16px_rgba(79,70,229,0.12)] hover:shadow-[0_48px_80px_-20px_rgba(79,70,229,0.2)] hover:-translate-y-4 transition-all duration-150 flex flex-col overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-150"></div>

                  <div
                    className={`relative z-10 w-20 h-20 rounded-[2rem] bg-indigo-50/50 flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-150 text-indigo-600 shadow-inner`}
                  >
                    <Icon size={36} />
                  </div>

                  <div className="relative z-10 flex-grow">
                    <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter group-hover:text-indigo-600 transition-colors duration-150 leading-none">
                      {dashboard.title}
                    </h2>
                    <p className="text-gray-500/90 font-medium leading-relaxed mb-10 text-lg">
                      {dashboard.description}
                    </p>
                  </div>

                  <div className="relative z-10 mt-auto flex items-center gap-3 text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] border-t border-gray-100 pt-8 group-hover:border-indigo-100 transition-colors duration-150">
                    Access System
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-3 transition-transform duration-150"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
