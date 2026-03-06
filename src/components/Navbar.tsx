import React from "react";
import { Link } from "react-router-dom";
import { School, LogOut, Layout, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { storage } from "../utils/storage";

interface NavbarProps {
  title: string;
  showLogout?: boolean;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  title,
  showLogout,
  onLogout,
}) => {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-indigo-100/90 backdrop-blur-md border-b border-indigo-200/50 shadow-[0_4px_24px_rgba(79,70,229,0.12)] px-6 py-4"
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center space-x-3 group transition-all"
        >
          <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-100 group-hover:rotate-12 transition-transform">
            <School size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-gray-900 tracking-tight leading-none group-hover:text-indigo-600 transition-colors">
              ClassHub
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              Management V2
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100">
            <Layout size={14} className="text-indigo-500" />
            <span className="text-xs font-black text-gray-500 uppercase tracking-wider">
              {title}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to reset all app data back to defaults?",
                  )
                ) {
                  storage.clearAll();
                  window.location.href = "/";
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-indigo-600 transition-all text-xs font-bold"
            >
              <RefreshCw size={14} />
              Reset Data
            </button>
            <Link
              to="/"
              className="text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors"
            >
              Home
            </Link>

            {showLogout && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onLogout}
                className="flex items-center gap-2 bg-red-50 text-red-600 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-red-600 hover:text-white transition-all shadow-sm"
              >
                <LogOut size={16} />
                Logout
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
