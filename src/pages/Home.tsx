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
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar title="Intelligence Routine System" />

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-32 bg-white">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-20">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-violet-200 rounded-full blur-[100px]"></div>
          </div>

          <div className="container mx-auto px-6 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-sm font-black uppercase tracking-wider mb-8"
            >
              <Zap size={16} />
              The Future of Academic Management
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-[1.1] mb-8"
            >
              Streamline Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                Educational Journey
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-500 max-w-2xl mx-auto mb-12"
            >
              A high-performance Class Routine Management System built for
              modern institutions. Experience seamless coordination and
              real-time updates.
            </motion.p>

            <div className="flex flex-wrap items-center justify-center gap-8 text-gray-400 font-bold uppercase tracking-widest text-xs">
              <span className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-indigo-400" /> Persistent
                Storage
              </span>
              <span className="flex items-center gap-2 shadow-indigo-100">
                <Globe size={16} className="text-violet-400" /> Distributed
                Roles
              </span>
              <span className="flex items-center gap-2">
                <Zap size={16} className="text-amber-400" /> Instant Sync
              </span>
            </div>
          </div>
        </div>

        {/* Roles Grid */}
        <div className="container mx-auto px-6 py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {dashboards.map((dashboard, index) => {
              const Icon = dashboard.icon;
              return (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  key={dashboard.path}
                  onClick={() => navigate(dashboard.path)}
                  className="group relative bg-white rounded-[40px] p-8 cursor-pointer border border-gray-100 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-500"
                >
                  <div
                    className={`w-16 h-16 rounded-3xl bg-gray-50 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 text-indigo-600`}
                  >
                    <Icon size={32} />
                  </div>

                  <h2 className="text-2xl font-black text-gray-900 mb-4 tracking-tight group-hover:text-indigo-600 transition-colors">
                    {dashboard.title}
                  </h2>
                  <p className="text-gray-500 font-medium leading-relaxed mb-8">
                    {dashboard.description}
                  </p>

                  <div className="flex items-center gap-2 text-indigo-600 font-black text-sm uppercase tracking-widest">
                    Enter Dashboard
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-2 transition-transform"
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
